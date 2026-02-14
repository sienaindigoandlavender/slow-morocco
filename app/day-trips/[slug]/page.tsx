import { notFound } from "next/navigation";
import { getDayTripBySlug, getDayTripAddons } from "@/lib/supabase";
import DayTripDetailContent from "./DayTripDetailContent";

export const revalidate = 3600;

async function getDayTripData(slug: string) {
  const tripData = await getDayTripBySlug(slug);
  if (!tripData) return null;

  const dayTrip = {
    slug: tripData.slug || "",
    routeId: tripData.route_id || "",
    title: tripData.title || "",
    shortDescription: tripData.short_description || "",
    durationHours: tripData.duration_hours || 0,
    priceMAD: tripData.final_price_mad || 0,
    priceEUR: tripData.final_price_eur || 0,
    departureCity: tripData.departure_city || "",
    category: tripData.category || "",
    heroImage: tripData.hero_image_url || "",
    includes: tripData.includes ? (typeof tripData.includes === 'string' ? tripData.includes.split('|').map((s: string) => s.trim()) : tripData.includes) : [],
    excludes: tripData.excludes ? (typeof tripData.excludes === 'string' ? tripData.excludes.split('|').map((s: string) => s.trim()) : tripData.excludes) : [],
    meetingPoint: tripData.meeting_point || "",
    narrative: tripData.narrative || "",
    fromCity: tripData.from_city || "",
    toCity: tripData.to_city || "",
    viaCities: tripData.via_cities || "",
    travelTime: tripData.travel_time || "",
    activities: tripData.activities || "",
    difficulty: tripData.difficulty || "",
    region: tripData.region || "",
    routeImage: tripData.route_image_url || "",
  };

  const addonsData = await getDayTripAddons(slug);
  const addons = (addonsData || []).map((a: any) => ({
    id: a.addon_id || "",
    name: a.addon_name || "",
    description: a.description || "",
    priceMAD: a.final_price_mad_pp || 0,
    priceEUR: a.final_price_eur_pp || 0,
  }));

  return { dayTrip, addons };
}

export default async function DayTripDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getDayTripData(slug);

  if (!data) {
    notFound();
  }

  return (
    <DayTripDetailContent
      dayTrip={data.dayTrip}
      addons={data.addons}
      slug={slug}
    />
  );
}
