// Reusable responsive 16:9 YouTube embed. First use case: "How Ticket
// Intelligence works" video (https://www.youtube.com/watch?v=ROsERYXtY2g),
// 19 Nov 2026, on the TI methodology page and the F1 TI picker page. No
// existing video-embed pattern anywhere in the codebase before this.
//
// loading="lazy" on the iframe defers loading YouTube's player until the
// browser decides it's needed (near-viewport) — same reasoning as every
// other below-the-fold asset on this site, so a visitor who never scrolls
// to it never pays for it.
export default function YouTubeEmbed({ videoId, title }: { videoId: string; title: string }) {
  return (
    <div className="relative w-full aspect-video rounded-sm overflow-hidden border border-[#2A2A2A] bg-[#141414]">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        className="absolute inset-0 w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}
