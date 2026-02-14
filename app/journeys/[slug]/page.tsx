import { notFound } from "next/navigation";
import { getJourneyBySlug, getRoutesByIds, getJourneys } from "@/lib/supabase";
import JourneyDetailContent from "./JourneyDetailContent";

export const revalidate = 3600;

interface Journey {
  slug: string;
  title: string;
  duration: string;
  durationDays: number;
  description: string;
  arcDescription: string;
  heroImage: string;
  startCity: string;
  focus: string;
  destinations: string;
  journeyId: string;
  journeyType?: string;
  epicPrice?: number;
  price?: number;
}

interface ItineraryDay {
  dayNumber: number;
  cityName: string;
  fromCity: string;
  toCity: string;
  description: string;
  imageUrl: string;
  travelTime: string;
  difficulty: string;
  activities: string;
  meals: string;
  routeType: string;
}

async function getJourneyData(slug: string) {
  const journeyData =
    (await getJourneyBySlug(slug)) ||
    (await getJourneyBySlug(decodeURIComponent(slug)));

  if (!journeyData) return null;

  const journey: Journey = {
    slug: journeyData.slug || "",
    title: journeyData.title || "",
    duration: journeyData.duration_days
      ? `${journeyData.duration_days}-Day`
      : "",
    durationDays: journeyData.duration_days || 0,
    description: journeyData.short_description || "",
    arcDescription: journeyData.arc_description || "",
    heroImage: journeyData.hero_image_url || "",
    price: journeyData.price_eur || 0,
    startCity: journeyData.start_city || "",
    focus: journeyData.focus_type || "",
    destinations: journeyData.destinations || "",
    journeyId: journeyData.id || "",
    journeyType: journeyData.journey_type || "regular",
    epicPrice: journeyData.epic_price_eur || undefined,
  };

  // Build itinerary from Route_Sequence
  const routeSequence = journeyData.route_sequence || "";
  const routeIds = routeSequence
    .split(",")
    .map((id: string) => id.trim())
    .filter((id: string) => id.length > 0);

  const routes = await getRoutesByIds(routeIds);

  const itinerary: ItineraryDay[] = routeIds.map(
    (routeId: string, index: number) => {
      const route = routes.find((r) => r.id === routeId);
      if (!route) {
        return {
          dayNumber: index + 1, cityName: "", fromCity: "", toCity: "",
          description: "", imageUrl: "", travelTime: "", difficulty: "",
          activities: "", meals: "", routeType: "",
        };
      }
      return {
        dayNumber: index + 1,
        cityName: route.to_city || "",
        fromCity: route.from_city || "",
        toCity: route.to_city || "",
        description: route.route_narrative || "",
        imageUrl: route.image_url || "",
        travelTime: String(route.travel_time_hours || ""),
        difficulty: route.difficulty_level || "",
        activities: route.activities || "",
        meals: route.meals || "",
        routeType: route.route_type || "",
      };
    }
  );

  return { journey, itinerary };
}

async function getOtherJourneys(currentSlug: string) {
  try {
    const allJourneys = await getJourneys({ published: true });
    return allJourneys
      .filter((j) => j.slug !== currentSlug)
      .map((j) => ({
        slug: j.slug || "",
        title: j.title || "",
        duration: j.duration_days ? `${j.duration_days}-Day` : "",
        durationDays: j.duration_days || 0,
        description: j.short_description || "",
        arcDescription: j.arc_description || "",
        heroImage: j.hero_image_url || "",
        price: j.price_eur || 0,
        startCity: j.start_city || "",
        focus: j.focus_type || "",
        destinations: j.destinations || "",
        journeyId: j.id || "",
        journeyType: j.journey_type || "regular",
        epicPrice: j.epic_price_eur || undefined,
      }));
  } catch {
    return [];
  }
}

export default async function JourneyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getJourneyData(slug);

  if (!data) {
    notFound();
  }

  const otherJourneys = await getOtherJourneys(slug);

  return (
    <JourneyDetailContent
      journey={data.journey}
      itinerary={data.itinerary}
      otherJourneys={otherJourneys}
      slug={slug}
    />
  );
}
