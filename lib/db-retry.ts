// Bounded retry-once wrapper for transient, read-only DB failures.
// Never apply to checkout/payment/webhook mutations — retrying a write risks
// double-charging/double-writing (idempotency risk). See
// project_homepage_db_statement_timeout_incident memory for why this exists:
// a stale pooled connection (Fluid Compute freeze/resume) can hand a request
// a dead socket, surfacing as pg's "Connection terminated unexpectedly" or a
// raw ECONNRESET/ETIMEDOUT — these are safe to retry once on a fresh client.
// 57014 (statement timeout) is deliberately excluded by default: it can mean
// the query is genuinely slow, and blindly retrying a 2-minute-timeout query
// doubles load/latency during a real problem instead of fixing a stale socket.

type ReadRetryOptions = {
  operation: string;
  retryStatementTimeout?: boolean;
};

const RETRYABLE_CODES = new Set([
  "ECONNRESET",
  "ETIMEDOUT",
  "EPIPE",
  "ECONNREFUSED",
  "57P01",
  "57P02",
  "57P03",
]);

function getErrorChain(error: unknown): Array<{ code?: unknown; message?: unknown; cause?: unknown }> {
  const chain: Array<{ code?: unknown; message?: unknown; cause?: unknown }> = [];
  const seen = new Set<unknown>();
  let current: unknown = error;

  while (current && typeof current === "object" && !seen.has(current)) {
    seen.add(current);
    const item = current as { code?: unknown; message?: unknown; cause?: unknown };
    chain.push(item);
    current = item.cause;
  }

  return chain;
}

function isRetryableReadError(error: unknown, retryStatementTimeout: boolean): boolean {
  return getErrorChain(error).some((item) => {
    const code = typeof item.code === "string" ? item.code : "";
    const message = typeof item.message === "string" ? item.message.toLowerCase() : "";

    if (RETRYABLE_CODES.has(code)) return true;
    if (message.includes("connection terminated unexpectedly")) return true;
    if (retryStatementTimeout && code === "57014" && message.includes("statement timeout")) return true;

    return false;
  });
}

function getErrorCode(error: unknown): string | undefined {
  return getErrorChain(error).find((item) => typeof item.code === "string")?.code as string | undefined;
}

export async function withReadDbRetry<T>(
  operationFn: () => PromiseLike<T>,
  options: ReadRetryOptions,
): Promise<T> {
  try {
    return await operationFn();
  } catch (firstError) {
    if (!isRetryableReadError(firstError, options.retryStatementTimeout ?? false)) {
      throw firstError;
    }

    const errorCode = getErrorCode(firstError);
    console.warn("[DB] Transient read failure; retrying once", {
      operation: options.operation,
      code: errorCode ?? "UNKNOWN",
      message: firstError instanceof Error ? firstError.message : String(firstError),
    });

    await new Promise((resolve) => setTimeout(resolve, 150));

    try {
      const result = await operationFn();
      console.info("[DB] Read retry succeeded", {
        operation: options.operation,
        originalCode: errorCode ?? "UNKNOWN",
      });
      return result;
    } catch (secondError) {
      console.error("[DB] Read retry failed", {
        operation: options.operation,
        originalCode: errorCode ?? "UNKNOWN",
        retryCode: getErrorCode(secondError) ?? "UNKNOWN",
        message: secondError instanceof Error ? secondError.message : String(secondError),
      });
      throw secondError;
    }
  }
}
