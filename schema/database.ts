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

// Richer than isHidden — adds a state for "event is calendared (e.g. on
// the Content Calendar / for the season planner) but no pack has been
// built yet," which isHidden alone can't represent (it only distinguishes
// "pack exists but not activated" from "pack live").
export const packStatusEnum = pgEnum("pack_status", [
  "planned",
  "building",
  "built_hidden",
  "live",
]);

// Drives which UI app/event-pack/[slug]/page.tsx renders. Defaults to
// "classic" so every existing live event (Wimbledon, Belgian GP, Italian GP,
// etc.) needs zero changes — only events deliberately built in the new
// hub-and-spoke format (see hub-and-spoke-event-pack skill) get switched.
export const packFormatEnum = pgEnum("pack_format", [
  "classic",
  "hub_and_spoke",
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
  // Nearest bookable airport — a sports destination like "Belgian Ardennes"
  // isn't itself a flight-searchable place; this is what real flight-price
  // seeding (Skyscanner/Google Flights lookups) actually keys against.
  // Added 19 Jul 2026 for the Season Planner's flight-cost matrix.
  nearestAirportIata: varchar("nearest_airport_iata", { length: 3 }),
  // Optional budget-alternate airport — only set when a genuine, sourced
  // secondary option exists (most destinations stay NULL). Qualitative
  // Tradeoff Engine lever, not a calculated saving — see design doc
  // "Alternate-airport lever" section. BLOCKER: never seed without
  // explicit user approval, same rule as nearestAirportIata.
  budgetAlternateAirportIata: varchar("budget_alternate_airport_iata", { length: 3 }),
  // Real, specific ground-transport facts (shuttle/bus name, approx cost,
  // approx time) — freeform editorial text, not structured fields, since
  // this is a one-off fact per destination, not a repeating data pattern.
  alternateAirportNote: text("alternate_airport_note"),
  // Hotel-search zone logic for the Season Planner — added 21 Jul 2026 per
  // the planner-data-researcher skill's Hotels methodology. NULL = this
  // destination is itself a genuine fan booking base (search radius: 20km
  // from the event VENUE, not the destination centroid). Set to another
  // destination's id = this is a venue-adjacent/satellite destination (e.g.
  // Belgian Ardennes -> Brussels, Surrey/Virginia Water -> London); hotel
  // sampling then draws 70% from the anchor city, 30% from this venue area.
  // BLOCKER: never set without presenting reasoning and getting explicit
  // user approval, one destination at a time (same rule as nearestAirportIata).
  nextClosestHotelDestinationId: uuid("next_closest_hotel_destination_id"),
  // Local Travel/Food cost-research proxy — added 23 Jul 2026 per the
  // planner-data-researcher skill's Local Travel & Food methodology. NULL =
  // this destination has its own real Budget Your Trip coverage. Set to a
  // free-text city name = this destination isn't covered (or has thin/
  // unreliable data) on Budget Your Trip, so its planner_destination_bands
  // row borrows the named city's Food/Local Travel figures instead. Not a
  // strict "capital city" rule — the substitute is whichever nearby major
  // city has genuinely representative, well-covered data (e.g. Turin ->
  // Milan, not Rome; Adelaide/Perth -> Sydney, not Canberra). Free text, not
  // an FK, since some substitutes (e.g. London for Liverpool/Manchester,
  // used as a data-quality fallback, not a geographic proxy) don't need a
  // full destination row of their own. BLOCKER: never set without
  // presenting reasoning and getting explicit user approval, same rule as
  // nearestAirportIata / nextClosestHotelDestinationId.
  nearestMajorCity: varchar("nearest_major_city", { length: 100 }),
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
  // For multi-city tours only (cricket-style series spanning several venues)
  // — plain city names in visiting order, INCLUDING the event's own anchor
  // destination (this is what actually renders in the Planner's "Multiple
  // venues — City, City, City" line, so it must be complete on its own,
  // not rely on a separately-shown destination name elsewhere in that UI).
  // e.g. ["Johannesburg", "Durban", "Cape Town"]. venueName stays free text
  // for the main event-pack page ("Kingsmead (Durban), Wanderers
  // (Johannesburg)..."). NULL for single-venue events.
  tourCities: text("tour_cities").array(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  recurrence: varchar("recurrence", { length: 30 }),
  ticketingUrl: text("ticketing_url"),
  heroImageUrl: text("hero_image_url"),
  editorialOverview: text("editorial_overview"),
  preTripBriefLiveAt: timestamp("pre_trip_brief_live_at"),
  preTripBriefApprovalToken: varchar("pre_trip_brief_approval_token", { length: 64 }),
  preTripBriefLines: text("pre_trip_brief_lines").array(),
  preTripBriefUpdatedAt: timestamp("pre_trip_brief_updated_at"),
  homepageSlot: smallint("homepage_slot"),
  isHidden: boolean("is_hidden").notNull().default(true),
  // Hard exclusion flag — every email-sending cron that queries sportingEvents
  // must filter this false. Any dev/test event, however production-shaped
  // (isHidden: false, activatedAt backdated, etc.), must be created with this
  // true so it can never satisfy a real cron's send trigger. See incident
  // 20 Jul 2026: a fake "TEST EVENT" row without this flag reached 20 real
  // newsletter subscribers.
  isTestEvent: boolean("is_test_event").notNull().default(false),
  packStatus: packStatusEnum("pack_status").notNull().default("live"),
  packFormat: packFormatEnum("pack_format").notNull().default("classic"),
  // Real currency the event's Dodo/Paddle pack is actually priced in — the
  // single source of truth for grantFreeAccess (writes purchases.currency)
  // and LocalCurrencyHint (converts FROM this, not a hardcoded GBP
  // assumption). Nullable: events without a pack (or not yet priced) have
  // no currency yet. Added 1 Aug 2026 after grantFreeAccess was found
  // hardcoding "GBP" for every free-access grant regardless of the event's
  // real currency (Hungarian GP is EUR, US Open is USD, etc.) — purchases
  // rows were silently wrong for every non-GBP event.
  packCurrency: varchar("pack_currency", { length: 3 }),
  // When isHidden last flipped false — anchors the 2-day-later newsletter announcement
  activatedAt: timestamp("activated_at"),
  newsletterAnnouncedAt: timestamp("newsletter_announced_at"),
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
  sport: text("sport").array(),
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
  rescueSentAt: timestamp("rescue_sent_at"),
  postTripEmailSentAt: timestamp("post_trip_email_sent_at"),
  preTripReminderSentAt: timestamp("pre_trip_reminder_sent_at"),
  conciergeOutreachPreTripSentAt: timestamp("concierge_outreach_pre_trip_sent_at"),
  conciergeOutreachPostTripSentAt: timestamp("concierge_outreach_post_trip_sent_at"),
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

// ─── Event Pack Feedback ──────────────────────────────────────────────────────

export const eventPackFeedback = pgTable("event_pack_feedback", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull(),
  sportingEventId: uuid("sporting_event_id").notNull().references(() => sportingEvents.id),
  rating: smallint("rating").notNull(),
  comment: text("comment"),
  displayConsent: boolean("display_consent").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (t) => [
  uniqueIndex("event_pack_feedback_email_event_unique").on(t.email, t.sportingEventId),
  index("event_pack_feedback_event_idx").on(t.sportingEventId),
  index("event_pack_feedback_rating_idx").on(t.rating),
]);

// ─── Sporting Event Experiences (join table) ──────────────────────────────────

export const sportingEventExperiences = pgTable("sporting_event_experiences", {
  id: uuid("id").primaryKey().defaultRandom(),
  sportingEventId: uuid("sporting_event_id").notNull().references(() => sportingEvents.id, { onDelete: "cascade" }),
  experienceId: uuid("experience_id").notNull().references(() => experiences.id, { onDelete: "cascade" }),
  packRank: integer("pack_rank"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => [
  uniqueIndex("see_event_experience_unique").on(t.sportingEventId, t.experienceId),
  index("see_event_idx").on(t.sportingEventId),
  index("see_experience_idx").on(t.experienceId),
  index("see_rank_idx").on(t.sportingEventId, t.packRank),
]);

// ─── Gift Codes ───────────────────────────────────────────────────────────────

export const giftCodes = pgTable("gift_codes", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 12 }).notNull().unique(),
  generatedByEmail: varchar("generated_by_email", { length: 255 }).notNull(),
  sportingEventId: uuid("sporting_event_id").references(() => sportingEvents.id),
  claimedByEmail: varchar("claimed_by_email", { length: 255 }),
  claimedAt: timestamp("claimed_at"),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => [
  uniqueIndex("gift_codes_code_unique").on(t.code),
  index("gift_codes_generated_by_idx").on(t.generatedByEmail),
]);

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  source: varchar("source", { length: 50 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => [
  uniqueIndex("newsletter_subscribers_email_unique").on(t.email),
]);

// Tracks the 5-day pre-trip reminder for Annual Pro members, who have free
// pack access with no purchases row for a given event to key idempotency off.
export const eventRemindersSent = pgTable("event_reminders_sent", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull(),
  sportingEventId: uuid("sporting_event_id").notNull().references(() => sportingEvents.id),
  sentAt: timestamp("sent_at").notNull().defaultNow(),
}, (t) => [
  uniqueIndex("event_reminders_sent_email_event_unique").on(t.email, t.sportingEventId),
]);

// ─── Season/Budget Planner (G3) ────────────────────────────────────────────────
// See docs/Season Budget Planner Tool G3 - Customer and Monetization Journey.txt
// for the full design brief. All prices in this section are USD-only — the
// planner is a planning surface, not a checkout surface; nothing here touches
// the local-currency pack/checkout pages.

// "general" dropped 19 Jul 2026 — Screen 2 now uses the real "moderate"
// tier as its default display value instead of a synthetic blend, so the
// Tradeoff Engine's "current tier" is a known fact, not an inference.
export const plannerTierEnum = pgEnum("planner_tier", [
  "budget",
  "moderate",
  "splurge",
  "luxury",
]);

// Fixed, sortable tier keys — NOT tier names. Real display names are
// sport-level (plannerTicketTierSportLabel) with an optional event-level
// override (plannerTicketTierCost.eventTierLabel). Redesigned 19 Jul 2026
// after research confirmed F1's General Admission/Grandstand/Premium
// Grandstand/Hospitality vocabulary does not generalize to tennis/golf/
// cricket — tier1 (cheapest) through tier4 (priciest) sorts correctly
// regardless of what each sport calls that rung.
// "general" dropped 19 Jul 2026 — Screen 2 now uses the real "tier2"
// (Grandstand-equivalent) row as its default display value instead of a
// synthetic blend.
export const plannerTicketTierEnum = pgEnum("planner_ticket_tier", [
  "tier1",
  "tier2",
  "tier3",
  "tier4",
]);

export const plannerTimeWindowEnum = pgEnum("planner_time_window", [
  "next_3mo",
  "next_6mo",
  "next_9mo",
  "flexible",
]);

// Tracks which of the 3 scheduled research passes (planner-data-researcher
// skill §5) produced a given Flights/Hotels row — added 21 Jul 2026 so a
// missed or late refresh is directly visible in the data, not something
// that has to be inferred after the fact from lastUpdated timing.
export const plannerRefreshPassEnum = pgEnum("planner_refresh_pass", [
  "initial",
  "t60",
  "t30",
]);

export const plannerGateActionEnum = pgEnum("planner_gate_action", [
  "saved",
  "compared",
  "notified",
]);

export const plannerDripStepEnum = pgEnum("planner_drip_step", [
  "immediate",
  "day_3",
  "day_10",
  "notify_live",
]);

// Origin-market cities — where fans are based and travel FROM, researched
// against real outbound fan-travel patterns for F1/tennis/golf/cricket (not
// host-venue fame — Monaco/St Andrews were correctly rejected as candidates
// since fans travel TO those, not FROM them). DB table, not a TS const, per
// the standing rule against hardcoded per-entity Record<string,> tables —
// iataCode exists so real flight-price seeding can join against a real
// bookable airport instead of the fan-facing city label. Screen 1's dropdown
// reads this table directly.
export const plannerOriginMarkets = pgTable("planner_origin_markets", {
  id: uuid("id").primaryKey().defaultRandom(),
  city: varchar("city", { length: 100 }).notNull().unique(),
  region: varchar("region", { length: 50 }).notNull(),
  iataCode: varchar("iata_code", { length: 3 }).notNull(),
});

// Route-and-season flight cost matrix — destination x origin x seasonal band,
// NOT per-event. Events look this up by (destination, month); this is what
// keeps the same real-world route (e.g. Sydney-London) from being duplicated
// and drifting out of sync across every event in that city.
export const plannerFlightCost = pgTable("planner_flight_cost", {
  id: uuid("id").primaryKey().defaultRandom(),
  destinationId: uuid("destination_id").notNull().references(() => destinations.id),
  // Free-form for now — the exact ~20-market origin list is not yet finalized
  // (deferred to detailed build per standing decision); enforce the real list
  // at the application layer once chosen, not via a schema-level enum, so
  // adding/adjusting markets doesn't require a migration.
  originMarket: varchar("origin_market", { length: 100 }).notNull(),
  seasonalBand: varchar("seasonal_band", { length: 20 }).notNull(), // e.g. "jan", "feb" ... or a quarterly code
  costLow: numeric("cost_low", { precision: 10, scale: 2 }).notNull(),
  costHigh: numeric("cost_high", { precision: 10, scale: 2 }).notNull(),
  // All planner cost data is USD-only, no exceptions — standing rule added
  // 22 Jul 2026 after being violated twice in one session (Milan EUR,
  // Virginia Water GBP). This column makes that rule structural rather
  // than relying on memory every seeding pass.
  currency: varchar("currency", { length: 3 }).notNull().default("USD"),
  refreshPass: plannerRefreshPassEnum("refresh_pass").notNull().default("initial"),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
}, (t) => [
  uniqueIndex("planner_flight_cost_route_season_unique").on(t.destinationId, t.originMarket, t.seasonalBand),
]);

// Hotel tier cost — keyed by destination, not event (a budget hotel in Monza
// serves any Monza-based event). No lead-time dimension — see design doc for
// why (footnote disclaimer covers the approximation instead).
export const plannerHotelTierCost = pgTable("planner_hotel_tier_cost", {
  id: uuid("id").primaryKey().defaultRandom(),
  destinationId: uuid("destination_id").notNull().references(() => destinations.id),
  tier: plannerTierEnum("tier").notNull(),
  // Same pattern as planner_flight_cost.seasonalBand — a destination shared
  // by events in genuinely different seasons (e.g. Johannesburg: Sep vs
  // Dec/Jan) needs separate price data per season, added 22 Jul 2026 after
  // this exact gap was caught.
  seasonalBand: varchar("seasonal_band", { length: 20 }).notNull(),
  costLow: numeric("cost_low", { precision: 10, scale: 2 }).notNull(),
  costHigh: numeric("cost_high", { precision: 10, scale: 2 }).notNull(),
  // All planner cost data is USD-only, no exceptions — see the same note on
  // plannerFlightCost.currency.
  currency: varchar("currency", { length: 3 }).notNull().default("USD"),
  refreshPass: plannerRefreshPassEnum("refresh_pass").notNull().default("initial"),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
}, (t) => [
  uniqueIndex("planner_hotel_tier_cost_dest_tier_season_unique").on(t.destinationId, t.tier, t.seasonalBand),
]);

// Sport-level default tier labels — real per-sport vocabulary (e.g. F1's
// "Grandstand" vs tennis's "Outer Court Reserved"), one row per (sport,
// tierKey). DB table, not a hardcoded TS constant, per the standing rule
// against hardcoded per-entity Record<string,> tables. This is what
// Screen 2 / Tradeoff Engine display when an event has no eventTierLabel
// override set below.
export const plannerTicketTierSportLabel = pgTable("planner_ticket_tier_sport_label", {
  id: uuid("id").primaryKey().defaultRandom(),
  sport: sportEnum("sport").notNull(),
  tierKey: plannerTicketTierEnum("tier_key").notNull(),
  defaultLabel: varchar("default_label", { length: 100 }).notNull(),
}, (t) => [
  uniqueIndex("planner_ticket_tier_sport_label_sport_tier_unique").on(t.sport, t.tierKey),
]);

// Ticket tier cost — keyed by event, not destination (grandstand pricing is
// specific to one event, not shared across events in the same city).
export const plannerTicketTierCost = pgTable("planner_ticket_tier_cost", {
  id: uuid("id").primaryKey().defaultRandom(),
  sportingEventId: uuid("sporting_event_id").notNull().references(() => sportingEvents.id),
  tier: plannerTicketTierEnum("tier").notNull(),
  // Event-level label override — real named stand(s) for this specific
  // event (e.g. Italian GP tier2 = "Grandstand 26/27, Curva Grande"),
  // enabling genuinely curated advice instead of generic sport-level
  // labels. NULL falls back to plannerTicketTierSportLabel's default.
  // Plain string for V1, not structured — see design doc "Ticket tier
  // structure" section (19 Jul 2026) for why.
  eventTierLabel: varchar("event_tier_label", { length: 255 }),
  costLow: numeric("cost_low", { precision: 10, scale: 2 }).notNull(),
  costHigh: numeric("cost_high", { precision: 10, scale: 2 }).notNull(),
  // All planner cost data is USD-only, no exceptions — see the same note on
  // plannerFlightCost.currency.
  currency: varchar("currency", { length: 3 }).notNull().default("USD"),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
}, (t) => [
  uniqueIndex("planner_ticket_tier_cost_event_tier_unique").on(t.sportingEventId, t.tier),
]);

// Local travel and food/daily spend — simplified per-destination bands, not
// per-event and not tiered (these don't vary enough within one destination to
// justify the extra structure the other three line items carry).
export const plannerDestinationBands = pgTable("planner_destination_bands", {
  id: uuid("id").primaryKey().defaultRandom(),
  destinationId: uuid("destination_id").notNull().references(() => destinations.id).unique(),
  localTravelLow: numeric("local_travel_low", { precision: 10, scale: 2 }).notNull(),
  localTravelHigh: numeric("local_travel_high", { precision: 10, scale: 2 }).notNull(),
  foodPerDayLow: numeric("food_per_day_low", { precision: 10, scale: 2 }).notNull(),
  foodPerDayHigh: numeric("food_per_day_high", { precision: 10, scale: 2 }).notNull(),
  // All planner cost data is USD-only, no exceptions — see the same note on
  // plannerFlightCost.currency.
  currency: varchar("currency", { length: 3 }).notNull().default("USD"),
  // Short (2-sentence) curated editorial notes for the Tradeoff Engine's
  // Flights-Local Travel-Food commentary sequence — added 19 Jul 2026.
  // Researched from real published experience content where available
  // (destination-specific, not generic travel-blog advice). Nullable —
  // not every destination has this written yet.
  localTravelNote: text("local_travel_note"),
  foodNote: text("food_note"),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
});

// A single planner intake + gate-action session. Append-only per email — a
// second session with different inputs (e.g. re-planning) is a real, separate
// signal and must never overwrite an earlier one (standing decision, see
// design doc). This is the qualifying-signal record the post-planner drip
// sequence (PlannerDripSent) is driven entirely from.
export const plannerSessions = pgTable("planner_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull(),
  sports: sportEnum("sports").array().notNull(),
  budgetMin: numeric("budget_min", { precision: 10, scale: 2 }).notNull(),
  budgetMax: numeric("budget_max", { precision: 10, scale: 2 }).notNull(),
  timeWindow: plannerTimeWindowEnum("time_window").notNull(),
  tripLengthDays: smallint("trip_length_days").notNull(),
  // One of the eventual ~20-market list, or "unspecified" if the visitor's
  // origin isn't on it — same free-form-for-now reasoning as originMarket above.
  originMarket: varchar("origin_market", { length: 100 }).notNull().default("unspecified"),
  shortlistedEventIds: uuid("shortlisted_event_ids").array().notNull().default([]),
  gateAction: plannerGateActionEnum("gate_action").notNull(),
  gateActionEventIds: uuid("gate_action_event_ids").array().notNull().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  // Set the moment the user clicks through to a pack page from any drip email
  // (via the /api/planner/click tracked redirect). Stops the saved/compared
  // drip sequences immediately — see design doc "Post-Planner Drip Sequence".
  clickedAt: timestamp("clicked_at"),
}, (t) => [
  index("planner_sessions_email_idx").on(t.email),
]);

// Idempotency/tracking for the post-planner drip sequence — mirrors the
// existing eventRemindersSent pattern.
export const plannerDripSent = pgTable("planner_drip_sent", {
  id: uuid("id").primaryKey().defaultRandom(),
  plannerSessionId: uuid("planner_session_id").notNull().references(() => plannerSessions.id),
  sequenceStep: plannerDripStepEnum("sequence_step").notNull(),
  sentAt: timestamp("sent_at").notNull().defaultNow(),
}, (t) => [
  uniqueIndex("planner_drip_sent_session_step_unique").on(t.plannerSessionId, t.sequenceStep),
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
  eventExperiences: many(sportingEventExperiences),
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
  eventExperiences: many(sportingEventExperiences),
  tripBoards: many(tripBoards),
  purchases: many(purchases),
}));

export const sportingEventExperiencesRelations = relations(sportingEventExperiences, ({ one }) => ({
  sportingEvent: one(sportingEvents, {
    fields: [sportingEventExperiences.sportingEventId],
    references: [sportingEvents.id],
  }),
  experience: one(experiences, {
    fields: [sportingEventExperiences.experienceId],
    references: [experiences.id],
  }),
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

export const plannerFlightCostRelations = relations(plannerFlightCost, ({ one }) => ({
  destination: one(destinations, {
    fields: [plannerFlightCost.destinationId],
    references: [destinations.id],
  }),
}));

export const plannerHotelTierCostRelations = relations(plannerHotelTierCost, ({ one }) => ({
  destination: one(destinations, {
    fields: [plannerHotelTierCost.destinationId],
    references: [destinations.id],
  }),
}));

export const plannerTicketTierCostRelations = relations(plannerTicketTierCost, ({ one }) => ({
  sportingEvent: one(sportingEvents, {
    fields: [plannerTicketTierCost.sportingEventId],
    references: [sportingEvents.id],
  }),
}));

export const plannerDestinationBandsRelations = relations(plannerDestinationBands, ({ one }) => ({
  destination: one(destinations, {
    fields: [plannerDestinationBands.destinationId],
    references: [destinations.id],
  }),
}));

export const plannerSessionsRelations = relations(plannerSessions, ({ many }) => ({
  dripSent: many(plannerDripSent),
}));

export const plannerDripSentRelations = relations(plannerDripSent, ({ one }) => ({
  plannerSession: one(plannerSessions, {
    fields: [plannerDripSent.plannerSessionId],
    references: [plannerSessions.id],
  }),
}));
