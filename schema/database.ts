import {
  pgTable,
  pgEnum,
  uuid,
  text,
  varchar,
  integer,
  smallint,
  boolean,
  numeric,
  jsonb,
  timestamp,
  date,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const experienceTypeEnum = pgEnum("experience_type", [
  "activity",
  "dining",
  "accommodation",
  "transit",
  "cultural_site",
  "natural_wonder",
  "event",
  "neighborhood",
  "day_trip",
  "multi_day",
  "sports_venue",
  "fan_experience",
]);

export const experienceStatusEnum = pgEnum("experience_status", [
  "draft",
  "in_review",
  "published",
  "archived",
  "flagged",
]);

export const experienceAvailabilityEnum = pgEnum("experience_availability", [
  "perennial",   // always available
  "event_only",  // only during linked sporting event
  "event_adjacent", // best during event, surfaced 6-8 weeks before
]);

export const curationTierEnum = pgEnum("curation_tier", [
  "editorial",
  "local_expert",
  "community",
]);

export const paceEnum = pgEnum("pace", [
  "slow",
  "moderate",
  "active",
  "intense",
]);

export const budgetTierEnum = pgEnum("budget_tier", [
  "free",
  "budget",
  "moderate",
  "splurge",
  "luxury",
]);

export const destinationTypeEnum = pgEnum("destination_type", [
  "city",
  "region",
  "island",
  "national_park",
  "neighborhood",
]);

export const curatorTierEnum = pgEnum("curator_tier", [
  "staff",
  "local_expert",
  "community",
]);

export const reactionTypeEnum = pgEnum("reaction_type", [
  "dreaming",   // aspirational save
  "planning",   // active trip intent
  "been_here",  // verified visit
]);

export const purchaseStatusEnum = pgEnum("purchase_status", [
  "active",
  "refunded",
  "disputed",
]);

export const savedItemStatusEnum = pgEnum("saved_item_status", [
  "to_do",
  "booked",
  "done",
]);

export const sportEnum = pgEnum("sport", [
  "tennis",
  "cricket",
  "football",
  "rugby",
  "golf",
  "formula_one",
  "cycling",
  "athletics",
  "other",
]);

// ─── Curators ─────────────────────────────────────────────────────────────────

export const curators = pgTable("curators", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  tier: curatorTierEnum("tier").notNull().default("community"),
  bio: text("bio"),
  travelPhilosophy: text("travel_philosophy"),
  profileImageUrl: text("profile_image_url"),
  socialLinks: jsonb("social_links").$type<Record<string, string>>(),
  areasOfExpertise: text("areas_of_expertise").array(),
  followerCount: integer("follower_count").notNull().default(0),
  publishedCount: integer("published_count").notNull().default(0),
  verificationStatus: varchar("verification_status", { length: 20 }).notNull().default("pending"),
  userId: uuid("user_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (t) => [
  index("curators_slug_idx").on(t.slug),
]);

// ─── Destinations ─────────────────────────────────────────────────────────────

export const destinations = pgTable("destinations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  countryCode: varchar("country_code", { length: 2 }).notNull(),
  region: varchar("region", { length: 100 }),
  destinationType: destinationTypeEnum("destination_type").notNull().default("city"),
  // Coordinates stored as numeric for portability; PostGIS point added via migration
  lat: numeric("lat", { precision: 9, scale: 6 }),
  lng: numeric("lng", { precision: 9, scale: 6 }),
  heroImageUrl: text("hero_image_url"),
  gallery: jsonb("gallery").$type<Array<{ url: string; alt: string; credit?: string }>>(),
  editorialOverview: text("editorial_overview"),
  vibeTags: text("vibe_tags").array(),
  bestFor: text("best_for").array(),
  bestSeasons: text("best_seasons").array(),
  avoidSeasons: jsonb("avoid_seasons").$type<Array<{ month: string; reason: string }>>(),
  minDays: smallint("min_days"),
  idealDays: smallint("ideal_days"),
  gettingThere: text("getting_there"),
  gettingAround: text("getting_around"),
  safetyNotes: text("safety_notes"),
  visaInfo: text("visa_info"),
  currency: varchar("currency", { length: 10 }),
  language: varchar("language", { length: 100 }),
  timezone: varchar("timezone", { length: 60 }),
  budgetContext: text("budget_context"),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (t) => [
  index("destinations_country_idx").on(t.countryCode),
  index("destinations_slug_idx").on(t.slug),
]);

// ─── Sporting Events ───────────────────────────────────────────────────────────

export const sportingEvents = pgTable("sporting_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 220 }).notNull().unique(),
  sport: sportEnum("sport").notNull(),
  // e.g. "Wimbledon", "The Ashes", "Roland Garros", "Formula 1"
  tournamentSeries: varchar("tournament_series", { length: 150 }).notNull(),
  editionYear: smallint("edition_year").notNull(),
  destinationId: uuid("destination_id").references(() => destinations.id),
  venueName: varchar("venue_name", { length: 200 }),
  venueAddress: text("venue_address"),
  venueLat: numeric("venue_lat", { precision: 9, scale: 6 }),
  venueLng: numeric("venue_lng", { precision: 9, scale: 6 }),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  recurrence: varchar("recurrence", { length: 30 }),
  ticketingUrl: text("ticketing_url"),
  heroImageUrl: text("hero_image_url"),
  editorialOverview: text("editorial_overview"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (t) => [
  index("sporting_events_series_idx").on(t.tournamentSeries),
  index("sporting_events_dates_idx").on(t.startDate, t.endDate),
  index("sporting_events_sport_idx").on(t.sport),
]);

// ─── Experiences ──────────────────────────────────────────────────────────────

export const experiences = pgTable("experiences", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 60 }).notNull(),
  subtitle: varchar("subtitle", { length: 120 }),
  slug: varchar("slug", { length: 150 }).notNull().unique(),
  experienceType: experienceTypeEnum("experience_type").notNull(),
  status: experienceStatusEnum("status").notNull().default("draft"),
  version: integer("version").notNull().default(1),

  // Location
  destinationId: uuid("destination_id").notNull().references(() => destinations.id),
  neighborhood: varchar("neighborhood", { length: 100 }),
  lat: numeric("lat", { precision: 9, scale: 6 }),
  lng: numeric("lng", { precision: 9, scale: 6 }),
  address: text("address"),
  googlePlaceId: varchar("google_place_id", { length: 100 }),

  // Editorial
  heroImageUrl: text("hero_image_url"),
  heroImageAlt: varchar("hero_image_alt", { length: 200 }),
  heroImageCredit: varchar("hero_image_credit", { length: 150 }),
  gallery: jsonb("gallery").$type<Array<{ url: string; alt: string; credit?: string }>>(),
  bodyContent: text("body_content"),
  whyItsSpecial: text("why_its_special"),
  practicalInfo: jsonb("practical_info").$type<{
    hours?: string;
    costRange?: string;
    bookingMethod?: string;
    reservationsRequired?: boolean;
    website?: string;
    phone?: string;
    howToBook?: string;
  }>(),
  gettingThere: text("getting_there"),
  insiderTips: text("insider_tips").array(),
  whatToAvoid: text("what_to_avoid"),
  bestFor: text("best_for").array(),

  // Discovery
  moodTags: text("mood_tags").array(),
  interestCategories: text("interest_categories").array(),
  pace: paceEnum("pace"),
  physicalIntensity: smallint("physical_intensity"),
  budgetTier: budgetTierEnum("budget_tier"),
  budgetCurrency: varchar("budget_currency", { length: 3 }),
  budgetMinCost: numeric("budget_min_cost", { precision: 10, scale: 2 }),
  budgetMaxCost: numeric("budget_max_cost", { precision: 10, scale: 2 }),

  // Temporal
  bestSeasons: text("best_seasons").array(),
  avoidSeasons: jsonb("avoid_seasons").$type<Array<{ month: string; reason: string }>>(),
  openingHours: text("opening_hours"),
  advanceBookingRequired: boolean("advance_booking_required").default(false),
  advanceBookingDays: smallint("advance_booking_days"),
  timeSensitive: boolean("time_sensitive").default(false),
  lastVerifiedDate: date("last_verified_date"),
  lastVerifiedBy: uuid("last_verified_by").references(() => curators.id),

  // Sports — event linkage (null for non-sports experiences)
  sportingEventId: uuid("sporting_event_id").references(() => sportingEvents.id),
  availability: experienceAvailabilityEnum("availability").notNull().default("perennial"),

  // Attribution
  primaryCuratorId: uuid("primary_curator_id").references(() => curators.id),
  editorialNote: text("editorial_note"),
  curationTier: curationTierEnum("curation_tier").notNull().default("editorial"),

  // Quality
  specScoreSpecificity: smallint("spec_score_specificity"),
  specScoreProvenance: smallint("spec_score_provenance"),
  specScoreExceptionalism: smallint("spec_score_exceptionalism"),
  specScoreCurrency: smallint("spec_score_currency"),

  // Analytics
  saveCount: integer("save_count").notNull().default(0),
  viewCount: integer("view_count").notNull().default(0),
  shareCount: integer("share_count").notNull().default(0),
  bookingClickCount: integer("booking_click_count").notNull().default(0),
  averagePostVisitRating: numeric("average_post_visit_rating", { precision: 3, scale: 2 }),
  postVisitRatingCount: integer("post_visit_rating_count").notNull().default(0),

  // Booking
  bookingLinks: jsonb("booking_links").$type<Array<{
    platform: string;
    url: string;
    affiliateTag?: string;
    pricePoint?: string;
  }>>(),
  operatorName: varchar("operator_name", { length: 200 }),
  operatorWebsite: text("operator_website"),

  reviewNotes: text("review_notes"),

  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (t) => [
  index("experiences_destination_idx").on(t.destinationId),
  index("experiences_status_idx").on(t.status),
  index("experiences_curator_idx").on(t.primaryCuratorId),
  index("experiences_event_idx").on(t.sportingEventId),
  index("experiences_availability_idx").on(t.availability),
  index("experiences_published_at_idx").on(t.publishedAt),
]);

// ─── Users ────────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 100 }),
  avatarUrl: text("avatar_url"),
  isPro: boolean("is_pro").notNull().default(false),
  proExpiresAt: timestamp("pro_expires_at"),
  curatorId: uuid("curator_id").references(() => curators.id),
  // Supabase Auth user id (links to auth.users)
  authId: uuid("auth_id").unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── Taste Profiles ───────────────────────────────────────────────────────────

export const tasteProfiles = pgTable("taste_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id).unique(),
  // Archetype label derived from quiz (e.g. "cultural_immersionist", "sports_enthusiast")
  archetype: varchar("archetype", { length: 50 }),
  // 0-100 scores across interest dimensions
  scoreFood: smallint("score_food").default(0),
  scoreArt: smallint("score_art").default(0),
  scoreNature: smallint("score_nature").default(0),
  scoreArchitecture: smallint("score_architecture").default(0),
  scoreHistory: smallint("score_history").default(0),
  scoreAdventure: smallint("score_adventure").default(0),
  scoreWellness: smallint("score_wellness").default(0),
  scoreNightlife: smallint("score_nightlife").default(0),
  scoreSports: smallint("score_sports").default(0),
  // Preference axes
  pacePreference: smallint("pace_preference"),       // 0=slow/immersive → 100=fast/efficient
  comfortLevel: smallint("comfort_level"),            // 0=roughing it → 100=luxury
  budgetSensitivity: smallint("budget_sensitivity"), // 0=budget-first → 100=money-no-object
  socialMode: varchar("social_mode", { length: 20 }), // solo, couple, group
  // Sports preferences (for Segment C)
  favoriteSports: sportEnum("favorite_sports").array(),
  // Past destinations logged by user (seeds collaborative filtering)
  pastDestinations: text("past_destinations").array(),
  // pgvector embedding stored as jsonb until pgvector extension is enabled
  embeddingVector: jsonb("embedding_vector"),
  quizCompletedAt: timestamp("quiz_completed_at"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── Trip Boards ──────────────────────────────────────────────────────────────

export const tripBoards = pgTable("trip_boards", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  title: varchar("title", { length: 120 }).notNull(),
  slug: varchar("slug", { length: 150 }).notNull(),
  description: text("description"),
  isPublic: boolean("is_public").notNull().default(false),
  shareToken: varchar("share_token", { length: 32 }).unique(),
  // Optional link to a sporting event (auto-created when user searches an event)
  sportingEventId: uuid("sporting_event_id").references(() => sportingEvents.id),
  coverImageUrl: text("cover_image_url"),
  tripStartDate: date("trip_start_date"),
  tripEndDate: date("trip_end_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (t) => [
  index("trip_boards_user_idx").on(t.userId),
  index("trip_boards_token_idx").on(t.shareToken),
]);

// ─── Saved Items ──────────────────────────────────────────────────────────────

export const savedItems = pgTable("saved_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  experienceId: uuid("experience_id").notNull().references(() => experiences.id),
  tripBoardId: uuid("trip_board_id").references(() => tripBoards.id),
  status: savedItemStatusEnum("status").notNull().default("to_do"),
  notes: text("notes"),
  postVisitRating: smallint("post_visit_rating"),
  visitedAt: date("visited_at"),
  scheduledAt: timestamp("scheduled_at"),
  durationMinutes: integer("duration_minutes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => [
  index("saved_items_user_idx").on(t.userId),
  index("saved_items_experience_idx").on(t.experienceId),
  index("saved_items_board_idx").on(t.tripBoardId),
  uniqueIndex("saved_items_user_experience_unique").on(t.userId, t.experienceId),
]);

// ─── Community Flags ──────────────────────────────────────────────────────────

export const communityFlags = pgTable("community_flags", {
  id: uuid("id").primaryKey().defaultRandom(),
  experienceId: uuid("experience_id").notNull().references(() => experiences.id),
  userId: uuid("user_id").notNull().references(() => users.id),
  reason: varchar("reason", { length: 30 }).notNull(), // outdated, inaccurate, closed, inappropriate
  notes: text("notes"),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => [
  index("flags_experience_idx").on(t.experienceId),
]);

// ─── Purchases ────────────────────────────────────────────────────────────────

export const purchases = pgTable("purchases", {
  id: uuid("id").primaryKey().defaultRandom(),
  // Null until the buyer completes account creation via magic link
  userId: uuid("user_id").references(() => users.id),
  // Email captured by Paddle — primary link key before account exists
  email: varchar("email", { length: 255 }).notNull(),
  sportingEventId: uuid("sporting_event_id").notNull().references(() => sportingEvents.id),
  // Paddle references (stored for refunds, disputes, and audit)
  paddleOrderId: varchar("paddle_order_id", { length: 100 }).notNull().unique(),
  paddleCustomerId: varchar("paddle_customer_id", { length: 100 }),
  paddlePriceId: varchar("paddle_price_id", { length: 100 }).notNull(),
  priceTier: varchar("price_tier", { length: 20 }).notNull().default("standard"), // early_bird | standard
  pricePaid: numeric("price_paid", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).notNull(),
  status: purchaseStatusEnum("status").notNull().default("active"),
  purchasedAt: timestamp("purchased_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => [
  index("purchases_user_idx").on(t.userId),
  index("purchases_email_idx").on(t.email),
  index("purchases_event_idx").on(t.sportingEventId),
  uniqueIndex("purchases_email_event_unique").on(t.email, t.sportingEventId),
]);

export const userProfiles = pgTable("user_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  email: varchar("email", { length: 255 }).notNull().unique(),
  archetype: varchar("archetype", { length: 50 }),
  quizAnswers: jsonb("quiz_answers").$type<Record<string, string>>(),
  quizCompletedAt: timestamp("quiz_completed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (t) => [
  index("user_profiles_user_idx").on(t.userId),
  index("user_profiles_email_idx").on(t.email),
]);

export const proSubscriptions = pgTable("pro_subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  email: varchar("email", { length: 255 }).notNull(),
  paddleSubscriptionId: varchar("paddle_subscription_id", { length: 100 }).notNull().unique(),
  paddleCustomerId: varchar("paddle_customer_id", { length: 100 }),
  paddlePriceId: varchar("paddle_price_id", { length: 100 }).notNull(),
  billingCycle: varchar("billing_cycle", { length: 10 }).notNull(), // monthly | annual
  status: varchar("status", { length: 20 }).notNull().default("active"), // active | cancelled | past_due | paused
  currentPeriodEnd: timestamp("current_period_end"),
  cancelledAt: timestamp("cancelled_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (t) => [
  index("pro_subscriptions_user_idx").on(t.userId),
  index("pro_subscriptions_email_idx").on(t.email),
]);

export const travelLogs = pgTable("travel_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  experienceId: uuid("experience_id").notNull().references(() => experiences.id),
  visitedAt: date("visited_at").notNull(),
  rating: smallint("rating").notNull(), // 1–5
  moodTags: text("mood_tags").array().notNull().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (t) => [
  uniqueIndex("travel_logs_user_experience_idx").on(t.userId, t.experienceId),
  index("travel_logs_user_idx").on(t.userId),
  index("travel_logs_experience_idx").on(t.experienceId),
]);

// ─── Relations ────────────────────────────────────────────────────────────────

export const experiencesRelations = relations(experiences, ({ one, many }) => ({
  destination: one(destinations, {
    fields: [experiences.destinationId],
    references: [destinations.id],
  }),
  primaryCurator: one(curators, {
    fields: [experiences.primaryCuratorId],
    references: [curators.id],
  }),
  sportingEvent: one(sportingEvents, {
    fields: [experiences.sportingEventId],
    references: [sportingEvents.id],
  }),
  savedItems: many(savedItems),
  flags: many(communityFlags),
}));

export const destinationsRelations = relations(destinations, ({ many }) => ({
  experiences: many(experiences),
  sportingEvents: many(sportingEvents),
}));

export const sportingEventsRelations = relations(sportingEvents, ({ one, many }) => ({
  destination: one(destinations, {
    fields: [sportingEvents.destinationId],
    references: [destinations.id],
  }),
  experiences: many(experiences),
  tripBoards: many(tripBoards),
  purchases: many(purchases),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  tasteProfile: one(tasteProfiles, {
    fields: [users.id],
    references: [tasteProfiles.userId],
  }),
  tripBoards: many(tripBoards),
  savedItems: many(savedItems),
  purchases: many(purchases),
  curator: one(curators, {
    fields: [users.curatorId],
    references: [curators.id],
  }),
}));

export const tripBoardsRelations = relations(tripBoards, ({ one, many }) => ({
  user: one(users, {
    fields: [tripBoards.userId],
    references: [users.id],
  }),
  savedItems: many(savedItems),
  sportingEvent: one(sportingEvents, {
    fields: [tripBoards.sportingEventId],
    references: [sportingEvents.id],
  }),
}));

export const savedItemsRelations = relations(savedItems, ({ one }) => ({
  user: one(users, {
    fields: [savedItems.userId],
    references: [users.id],
  }),
  experience: one(experiences, {
    fields: [savedItems.experienceId],
    references: [experiences.id],
  }),
  tripBoard: one(tripBoards, {
    fields: [savedItems.tripBoardId],
    references: [tripBoards.id],
  }),
}));

export const purchasesRelations = relations(purchases, ({ one }) => ({
  user: one(users, {
    fields: [purchases.userId],
    references: [users.id],
  }),
  sportingEvent: one(sportingEvents, {
    fields: [purchases.sportingEventId],
    references: [sportingEvents.id],
  }),
}));

export const travelLogsRelations = relations(travelLogs, ({ one }) => ({
  user: one(users, {
    fields: [travelLogs.userId],
    references: [users.id],
  }),
  experience: one(experiences, {
    fields: [travelLogs.experienceId],
    references: [experiences.id],
  }),
}));
