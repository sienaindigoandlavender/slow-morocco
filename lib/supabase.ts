import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// =============================================
// HELPERS
// =============================================

/** Convert Google Drive sharing URL to direct image URL */
export function convertDriveUrl(url: string): string {
  if (!url) return "";
  if (!url.includes("drive.google.com")) return url;

  let fileId = "";
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) fileId = fileMatch[1];
  const openMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (openMatch) fileId = openMatch[1];
  const ucMatch = url.match(/\/uc\?.*id=([a-zA-Z0-9_-]+)/);
  if (ucMatch) fileId = ucMatch[1];

  if (fileId) return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200`;
  return url;
}

/** Get all website_settings as a key→value map */
export async function getSettingsMap(): Promise<Record<string, string>> {
  const settings = await getWebsiteSettings();
  const map: Record<string, string> = {};
  settings.forEach((s) => {
    if (s.key) map[s.key] = s.value || "";
  });
  return map;
}

// =============================================
// TYPE DEFINITIONS
// =============================================

export interface Journey {
  id: string;
  title: string;
  slug: string;
  image_prompt: string | null;
  hero_image_url: string | null;
  short_description: string | null;
  arc_description: string | null;
  duration_days: number | null;
  price_eur: number | null;
  epic_price_eur: number | null;
  start_city: string | null;
  focus_type: string | null;
  route_sequence: string | null;
  category: string | null;
  destinations: string | null;
  journey_type: string | null;
  marketing_priority: string | null;
  published: boolean;
  show_on_journeys_page: boolean;
  featured_on_homepage: boolean;
  created_at: string;
  updated_at: string;
}

export interface Route {
  id: string;
  route_narrative: string | null;
  route_description: string | null;
  image_prompt: string | null;
  image_url: string | null;
  hero_image_url: string | null;
  hero_title: string | null;
  hero_blurb: string | null;
  from_city: string | null;
  to_city: string | null;
  via_cities: string | null;
  day_number: string | null;
  day_title: string | null;
  region: string | null;
  sub_region: string | null;
  route_type: string | null;
  travel_time_hours: number | null;
  day_duration_hours: number | null;
  difficulty_level: string | null;
  highlights: string | null;
  activities: string | null;
  meals: string | null;
  accommodation_type: string | null;
  practical_information: string | null;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: number;
  testimonial_id: string;
  quote: string;
  author: string;
  journey_title: string | null;
  published: boolean;
  sort_order: number;
  created_at: string;
}

export interface FooterLink {
  id: number;
  column_number: number;
  column_title: string | null;
  link_order: number;
  link_label: string;
  link_href: string | null;
  link_type: string | null;
}

export interface WebsiteGuide {
  id: number;
  guide_id: string;
  title: string;
  slug: string | null;
  subtitle: string | null;
  image_url: string | null;
  description: string | null;
  published: boolean;
  sort_order: number | null;
}

export interface ChatbotTraining {
  id: number;
  category: string;
  question: string;
  answer: string;
  keywords: string | null;
  sort_order: number | null;
}

export interface GentleJourney {
  id: number;
  journey_id: string;
  title: string;
  slug: string | null;
  hero_image_url: string | null;
  tagline: string | null;
  description: string | null;
  duration_days: number | null;
  price_eur: number | null;
  route_cities: string | null;
  highlights: string | null;
  accessibility_notes: string | null;
  published: boolean;
  sort_order: number | null;
}

export interface GentleSetting {
  key: string;
  value: string | null;
}

export interface WebsiteTeamMember {
  id: number;
  team_id: string;
  name: string;
  role: string | null;
  quote: string | null;
  bio: string | null;
  image_url: string | null;
  published: boolean;
  sort_order: number | null;
  show_on_gentle: boolean;
}

export interface Quote {
  id: number;
  client_id: string;
  first_name: string | null;
  last_name: string | null;
  country: string | null;
  email: string | null;
  whatsapp_country_code: string | null;
  whatsapp_number: string | null;
  journey_interest: string | null;
  start_date: string | null;
  end_date: string | null;
  days: string | null;
  nights: string | null;
  language: string | null;
  hospitality_level: string | null;
  dream_experience: string | null;
  requests: string | null;
  hear_about_us: string | null;
  number_travelers: string | null;
  budget: string | null;
  start_city: string | null;
  end_city: string | null;
  journey_type: string | null;
  status: string;
  itinerary_doc_link: string | null;
  proposal_url: string | null;
  created_date: string | null;
  last_updated: string | null;
  notes: string | null;
}

export interface Proposal {
  id: number;
  proposal_id: string;
  client_id: string | null;
  client_name: string | null;
  country: string | null;
  hero_image_url: string | null;
  hero_title: string | null;
  hero_blurb: string | null;
  start_date: string | null;
  end_date: string | null;
  days: string | null;
  nights: string | null;
  num_guests: string | null;
  total_price: string | null;
  formatted_price: string | null;
  route_points: string | null;
  days_list: string | null;
  created_at: string | null;
}

export interface OvernightBooking {
  id: number;
  booking_ref: string;
  created_at: string;
  experience: string | null;
  trip_date: string | null;
  guest_name: string | null;
  email: string | null;
  phone: string | null;
  pickup: string | null;
  notes: string | null;
  subtotal_eur: number | null;
  handling_fee_eur: number | null;
  total_eur: number | null;
  transaction_id: string | null;
  status: string;
}

export interface Accommodation {
  id: number;
  accommodation_id: string;
  region: string | null;
  subregion: string | null;
  hospitality_level: string | null;
  accommodation_type: string | null;
  accommodation_name: string | null;
  website_url: string | null;
  google_maps_link: string | null;
}

// =============================================
// JOURNEY QUERIES
// =============================================

export async function getJourneys(options?: {
  published?: boolean;
  showOnJourneysPage?: boolean;
  featuredOnHomepage?: boolean;
  category?: string;
  includeHidden?: boolean;
}) {
  let query = supabase.from("journeys").select("*");

  if (options?.published !== undefined) {
    query = query.eq("published", options.published);
  } else if (!options?.includeHidden) {
    query = query.eq("published", true);
  }

  if (options?.showOnJourneysPage !== undefined) {
    query = query.eq("show_on_journeys_page", options.showOnJourneysPage);
  }

  if (options?.featuredOnHomepage !== undefined) {
    query = query.eq("featured_on_homepage", options.featuredOnHomepage);
  }

  if (options?.category) {
    query = query.eq("category", options.category);
  }

  const { data, error } = await query.order("duration_days", { ascending: true });
  if (error) { console.error("Error fetching journeys:", error); return []; }
  return data as Journey[];
}

export async function getJourneyBySlug(slug: string) {
  const { data, error } = await supabase.from("journeys").select("*").eq("slug", slug).single();
  if (error) { console.error("Error fetching journey:", error); return null; }
  return data as Journey;
}

// =============================================
// ROUTE QUERIES
// =============================================

export async function getRoutes(options?: {
  region?: string;
  routeType?: string;
  fromCity?: string;
  toCity?: string;
}) {
  let query = supabase.from("routes").select("*");
  if (options?.region) query = query.eq("region", options.region);
  if (options?.routeType) query = query.eq("route_type", options.routeType);
  if (options?.fromCity) query = query.eq("from_city", options.fromCity);
  if (options?.toCity) query = query.eq("to_city", options.toCity);

  const { data, error } = await query;
  if (error) { console.error("Error fetching routes:", error); return []; }
  return data as Route[];
}

export async function getRouteById(id: string) {
  const { data, error } = await supabase.from("routes").select("*").eq("id", id).single();
  if (error) { console.error("Error fetching route:", error); return null; }
  return data as Route;
}

export async function getRoutesByIds(ids: string[]) {
  const { data, error } = await supabase.from("routes").select("*").in("id", ids);
  if (error) { console.error("Error fetching routes:", error); return []; }
  const routeMap = new Map(data.map((r) => [r.id, r]));
  return ids.map((id) => routeMap.get(id)).filter(Boolean) as Route[];
}

// =============================================
// TRANSFORM HELPERS
// =============================================

export function transformJourneyForAPI(journey: Journey) {
  return {
    slug: journey.slug,
    title: journey.title,
    heroImage: journey.hero_image_url,
    shortDescription: journey.short_description,
    description: journey.arc_description,
    durationDays: journey.duration_days,
    price: journey.price_eur,
    epicPrice: journey.epic_price_eur,
    startCity: journey.start_city,
    focus: journey.focus_type,
    category: journey.category,
    destinations: journey.destinations,
    routeSequence: journey.route_sequence,
    journeyType: journey.journey_type,
    marketingPriority: journey.marketing_priority,
    published: journey.published,
    showOnJourneysPage: journey.show_on_journeys_page,
    featuredOnHomepage: journey.featured_on_homepage,
    hidden: !journey.show_on_journeys_page,
  };
}

export function transformRouteForAPI(route: Route) {
  return {
    id: route.id,
    narrative: route.route_narrative,
    description: route.route_description,
    imagePrompt: route.image_prompt,
    imageUrl: route.image_url,
    heroImageUrl: convertDriveUrl(route.hero_image_url || ""),
    heroTitle: route.hero_title,
    heroBlurb: route.hero_blurb,
    fromCity: route.from_city,
    toCity: route.to_city,
    viaCities: route.via_cities,
    dayNumber: route.day_number,
    dayTitle: route.day_title,
    region: route.region,
    subRegion: route.sub_region,
    routeType: route.route_type,
    travelTimeHours: route.travel_time_hours,
    dayDurationHours: route.day_duration_hours,
    difficultyLevel: route.difficulty_level,
    highlights: route.highlights,
    activities: route.activities,
    meals: route.meals,
    accommodationType: route.accommodation_type,
    practicalInfo: route.practical_information,
  };
}

// =============================================
// DAY TRIPS
// =============================================

export interface DayTrip {
  slug: string;
  route_id: string | null;
  title: string;
  short_description: string | null;
  duration_hours: number | null;
  driver_cost_mad: number | null;
  margin_percent: number | null;
  paypal_percent: number | null;
  final_price_mad: number | null;
  final_price_eur: number | null;
  departure_city: string | null;
  category: string | null;
  hero_image_url: string | null;
  includes: string | null;
  excludes: string | null;
  meeting_point: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
  // Additional DB columns
  narrative: string | null;
  from_city: string | null;
  to_city: string | null;
  via_cities: string | null;
  travel_time: string | null;
  activities: string | null;
  difficulty: string | null;
  region: string | null;
  route_image_url: string | null;
}

export interface DayTripAddon {
  addon_id: string;
  addon_name: string;
  description: string | null;
  cost_mad_pp: number | null;
  margin_percent: number | null;
  paypal_percent: number | null;
  final_price_mad_pp: number | null;
  final_price_eur_pp: number | null;
  applies_to: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface DayTripBooking {
  booking_id: string;
  created_at: string;
  trip_slug: string;
  trip_title: string | null;
  trip_date: string | null;
  guests: number | null;
  base_price_mad: number | null;
  addons: string | null;
  addons_price_mad: number | null;
  total_mad: number | null;
  total_eur: number | null;
  guest_name: string | null;
  guest_email: string | null;
  guest_phone: string | null;
  pickup_location: string | null;
  notes: string | null;
  paypal_transaction_id: string | null;
  status: string;
}

export async function getDayTrips(options?: { published?: boolean }) {
  let query = supabase.from("day_trips").select("*");
  if (options?.published !== undefined) query = query.eq("published", options.published);
  const { data, error } = await query.order("duration_hours", { ascending: true });
  if (error) { console.error("Error fetching day trips:", error); return []; }
  return data as DayTrip[];
}

export async function getDayTripBySlug(slug: string) {
  const { data, error } = await supabase.from("day_trips").select("*").eq("slug", slug).single();
  if (error) { console.error("Error fetching day trip:", error); return null; }
  return data as DayTrip;
}

export async function getDayTripAddons(tripSlug?: string) {
  const { data, error } = await supabase.from("day_trip_addons").select("*").eq("published", true);
  if (error) { console.error("Error fetching day trip addons:", error); return []; }
  if (tripSlug) {
    return (data as DayTripAddon[]).filter((addon) => addon.applies_to?.split("|").includes(tripSlug));
  }
  return data as DayTripAddon[];
}

export async function createDayTripBooking(booking: Omit<DayTripBooking, "booking_id" | "created_at">) {
  const { data, error } = await supabase.from("day_trip_bookings").insert(booking).select().single();
  if (error) { console.error("Error creating booking:", error); return null; }
  return data as DayTripBooking;
}

// =============================================
// PLACES
// =============================================

export interface Place {
  slug: string;
  title: string;
  destination: string | null;
  category: string | null;
  address: string | null;
  opening_hours: string | null;
  fees: string | null;
  notes: string | null;
  hero_image: string | null;
  hero_caption: string | null;
  excerpt: string | null;
  body: string | null;
  sources: string | null;
  tags: string | null;
  published: boolean;
  featured: boolean;
  sort_order: number | null;
  created_at: string;
  updated_at: string;
}

export interface PlaceImage {
  id: number;
  place_slug: string;
  image_order: number;
  image_url: string | null;
  caption: string | null;
  created_at: string;
}

export async function getPlaces(options?: {
  published?: boolean;
  destination?: string;
  category?: string;
  featured?: boolean;
}) {
  let query = supabase.from("places").select("*");
  if (options?.published !== undefined) query = query.eq("published", options.published);
  if (options?.destination) query = query.eq("destination", options.destination);
  if (options?.category) query = query.eq("category", options.category);
  if (options?.featured !== undefined) query = query.eq("featured", options.featured);
  const { data, error } = await query.order("sort_order", { ascending: true });
  if (error) { console.error("Error fetching places:", error); return []; }
  return data as Place[];
}

export async function getPlaceBySlug(slug: string) {
  const { data, error } = await supabase.from("places").select("*").eq("slug", slug).single();
  if (error) { console.error("Error fetching place:", error); return null; }
  return data as Place;
}

export async function getPlaceImages(placeSlug: string) {
  const { data, error } = await supabase.from("place_images").select("*").eq("place_slug", placeSlug).order("image_order", { ascending: true });
  if (error) { console.error("Error fetching place images:", error); return []; }
  return data as PlaceImage[];
}

// =============================================
// STORIES
// =============================================

export interface Story {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  category: string | null;
  source_type: string | null;
  hero_image: string | null;
  mj_prompt: string | null;
  hero_caption: string | null;
  excerpt: string | null;
  body: string | null;
  read_time: number | null;
  year: number | null;
  text_by: string | null;
  images_by: string | null;
  sources: string | null;
  tags: string | null;
  published: boolean;
  featured: boolean;
  sort_order: number | null;
  the_facts: string | null;
  region: string | null;
  country: string | null;
  theme: string | null;
  era: string | null;
  era_start: number | null;
  era_end: number | null;
  created_at: string;
  updated_at: string;
}

export async function getStories(options?: {
  published?: boolean;
  featured?: boolean;
  category?: string;
  region?: string;
  limit?: number;
}) {
  let query = supabase.from("stories").select("*");
  if (options?.published !== undefined) query = query.eq("published", options.published);
  if (options?.featured !== undefined) query = query.eq("featured", options.featured);
  if (options?.category) query = query.eq("category", options.category);
  if (options?.region) query = query.eq("region", options.region);
  query = query.order("sort_order", { ascending: true });
  if (options?.limit) query = query.limit(options.limit);
  const { data, error } = await query;
  if (error) { console.error("Error fetching stories:", error); return []; }
  return data as Story[];
}

export async function getStoryBySlug(slug: string) {
  const { data, error } = await supabase.from("stories").select("*").eq("slug", slug).single();
  if (error) { console.error("Error fetching story:", error); return null; }
  return data as Story;
}

export async function createStory(story: Partial<Story>) {
  const { data, error } = await supabase.from("stories").insert(story).select().single();
  if (error) { console.error("Error creating story:", error); return null; }
  return data as Story;
}

export async function createStories(stories: Partial<Story>[]) {
  const { data, error } = await supabase.from("stories").insert(stories).select();
  if (error) { console.error("Error creating stories:", error); return []; }
  return data as Story[];
}

// =============================================
// REGIONS
// =============================================

export interface Region {
  slug: string;
  title: string;
  subtitle: string | null;
  hero_image: string | null;
  description: string | null;
  sort_order: number | null;
  created_at: string;
}

export async function getRegions() {
  const { data, error } = await supabase.from("regions").select("*").order("sort_order", { ascending: true });
  if (error) { console.error("Error fetching regions:", error); return []; }
  return data as Region[];
}

// =============================================
// DESTINATIONS
// =============================================

export interface Destination {
  slug: string;
  title: string;
  subtitle: string | null;
  region: string | null;
  hero_image: string | null;
  hero_caption: string | null;
  excerpt: string | null;
  body: string | null;
  published: boolean;
  featured: boolean;
  sort_order: number | null;
  created_at: string;
}

export async function getDestinations(options?: {
  published?: boolean;
  featured?: boolean;
  region?: string;
}) {
  let query = supabase.from("destinations").select("*");
  if (options?.published !== undefined) query = query.eq("published", options.published);
  if (options?.featured !== undefined) query = query.eq("featured", options.featured);
  if (options?.region) query = query.ilike("region", `%${options.region}%`);
  const { data, error } = await query.order("sort_order", { ascending: true });
  if (error) { console.error("Error fetching destinations:", error); return []; }
  return data as Destination[];
}

export async function getDestinationBySlug(slug: string) {
  const { data, error } = await supabase.from("destinations").select("*").eq("slug", slug).single();
  if (error) { console.error("Error fetching destination:", error); return null; }
  return data as Destination;
}

// =============================================
// PAGE BANNERS
// =============================================

export interface PageBanner {
  page_slug: string;
  hero_image_url: string | null;
  title: string | null;
  subtitle: string | null;
  label_text: string | null;
  created_at: string;
}

export async function getPageBanners() {
  const { data, error } = await supabase.from("page_banners").select("*");
  if (error) { console.error("Error fetching page banners:", error); return []; }
  return data as PageBanner[];
}

export async function getPageBannerBySlug(slug: string) {
  const { data, error } = await supabase.from("page_banners").select("*").eq("page_slug", slug).single();
  if (error) { console.error("Error fetching page banner:", error); return null; }
  return data as PageBanner;
}

// =============================================
// WEBSITE SETTINGS
// =============================================

export interface WebsiteSetting {
  key: string;
  value: string | null;
  updated_at: string;
}

export async function getWebsiteSettings() {
  const { data, error } = await supabase.from("website_settings").select("*");
  if (error) { console.error("Error fetching website settings:", error); return []; }
  return data as WebsiteSetting[];
}

export async function getWebsiteSettingByKey(key: string) {
  const { data, error } = await supabase.from("website_settings").select("*").eq("key", key).single();
  if (error) { console.error("Error fetching website setting:", error); return null; }
  return data as WebsiteSetting;
}

// =============================================
// TESTIMONIALS
// =============================================

export async function getTestimonials(options?: { published?: boolean }) {
  let query = supabase.from("testimonials").select("*");
  if (options?.published !== undefined) query = query.eq("published", options.published);
  const { data, error } = await query.order("sort_order", { ascending: true });
  if (error) { console.error("Error fetching testimonials:", error); return []; }
  return data as Testimonial[];
}

// =============================================
// FOOTER LINKS
// =============================================

export async function getFooterLinks() {
  const { data, error } = await supabase
    .from("footer_links")
    .select("*")
    .order("column_number", { ascending: true })
    .order("link_order", { ascending: true });
  if (error) { console.error("Error fetching footer links:", error); return []; }
  return data as FooterLink[];
}

// =============================================
// WEBSITE GUIDES
// =============================================

export async function getGuides(options?: { published?: boolean }) {
  let query = supabase.from("website_guides").select("*");
  if (options?.published !== undefined) query = query.eq("published", options.published);
  const { data, error } = await query.order("sort_order", { ascending: true });
  if (error) { console.error("Error fetching guides:", error); return []; }
  return data as WebsiteGuide[];
}

// =============================================
// CHATBOT TRAINING
// =============================================

export async function getChatbotTraining() {
  const { data, error } = await supabase.from("chatbot_training").select("*").order("sort_order", { ascending: true });
  if (error) { console.error("Error fetching chatbot training:", error); return []; }
  return data as ChatbotTraining[];
}

// =============================================
// GENTLE JOURNEYS
// =============================================

export async function getGentleJourneys(options?: { published?: boolean }) {
  let query = supabase.from("gentle_journeys").select("*");
  if (options?.published !== undefined) query = query.eq("published", options.published);
  const { data, error } = await query.order("sort_order", { ascending: true });
  if (error) { console.error("Error fetching gentle journeys:", error); return []; }
  return data as GentleJourney[];
}

export async function getGentleSettings(): Promise<Record<string, string>> {
  const { data, error } = await supabase.from("gentle_settings").select("*");
  if (error) { console.error("Error fetching gentle settings:", error); return {}; }
  const map: Record<string, string> = {};
  (data as GentleSetting[]).forEach((s) => { if (s.key) map[s.key] = s.value || ""; });
  return map;
}

export async function getWebsiteTeam(options?: { published?: boolean; showOnGentle?: boolean }) {
  let query = supabase.from("website_team").select("*");
  if (options?.published !== undefined) query = query.eq("published", options.published);
  if (options?.showOnGentle !== undefined) query = query.eq("show_on_gentle", options.showOnGentle);
  const { data, error } = await query.order("sort_order", { ascending: true });
  if (error) { console.error("Error fetching website team:", error); return []; }
  return data as WebsiteTeamMember[];
}

// =============================================
// QUOTES (NOT MIGRATED - returning empty stubs)
// =============================================

export async function getQuotes() {
  return [] as Quote[];
}

export async function getQuoteByClientId(_clientId: string) {
  return null;
}

export async function createQuote(_quote: Partial<Quote>) {
  console.warn("Quotes table not migrated to Supabase");
  return null;
}

export async function updateQuote(_clientId: string, _updates: Partial<Quote>) {
  console.warn("Quotes table not migrated to Supabase");
  return null;
}

export async function generateClientId(): Promise<string> {
  const year = new Date().getFullYear();
  return `SM-${year}-001`;
}

// =============================================
// PROPOSALS (CRUD)
// =============================================

export async function getProposals() {
  const { data, error } = await supabase.from("proposals").select("*").order("created_at", { ascending: false });
  if (error) { console.error("Error fetching proposals:", error); return []; }
  return data as Proposal[];
}

export async function getProposalById(proposalId: string) {
  const { data, error } = await supabase.from("proposals").select("*").eq("proposal_id", proposalId).single();
  if (error) { console.error("Error fetching proposal:", error); return null; }
  return data as Proposal;
}

export async function createProposal(proposal: Partial<Proposal>) {
  const { data, error } = await supabase.from("proposals").insert(proposal).select().single();
  if (error) { console.error("Error creating proposal:", error); return null; }
  return data as Proposal;
}

// =============================================
// OVERNIGHT BOOKINGS
// =============================================

export async function createOvernightBooking(booking: Partial<OvernightBooking>) {
  const { data, error } = await supabase.from("overnight_bookings").insert(booking).select().single();
  if (error) { console.error("Error creating overnight booking:", error); return null; }
  return data as OvernightBooking;
}

// =============================================
// ACCOMMODATIONS (NOT MIGRATED - returning empty stub)
// =============================================

export async function getAccommodations() {
  return [] as Accommodation[];
}
