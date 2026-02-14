import { getJourneys as getJourneysFromSupabase, getDayTrips as getDayTripsFromSupabase } from "@/lib/supabase";
import JourneysContent from "./JourneysContent";

// Revalidate every hour
export const revalidate = 3600;

interface Journey {
  type: "journey" | "daytrip" | "overnight";
  slug: string;
  title: string;
  description: string;
  heroImage: string;
  price: number;
  durationDays?: number;
  durationHours?: number;
  focus?: string;
  category?: string;
  destinations?: string;
  startCity?: string;
  hidden?: boolean;
}

async function getJourneys(): Promise<{
  journeys: Journey[];
  dayTrips: Journey[];
  overnightTrips: Journey[];
}> {
  try {
    // Fetch journeys from Supabase
    const journeysData = await getJourneysFromSupabase({ published: true });
    const journeys: Journey[] = journeysData
      .filter((j) => j.journey_type !== "epic")
      .map((j) => ({
        type: "journey" as const,
        slug: j.slug,
        title: j.title,
        description: j.short_description || j.arc_description || "",
        heroImage: j.hero_image_url || "",
        price: j.price_eur || 0,
        durationDays: j.duration_days || 0,
        focus: j.focus_type || undefined,
        category: j.category || undefined,
        destinations: j.destinations || undefined,
        startCity: j.start_city || undefined,
        hidden: !j.show_on_journeys_page,
      }));

    // Fetch day trips from Supabase
    const dayTripsData = await getDayTripsFromSupabase({ published: true });
    const dayTrips: Journey[] = dayTripsData.map((d) => ({
      type: "daytrip" as const,
      slug: d.slug,
      title: d.title,
      description: d.short_description || "",
      heroImage: d.hero_image_url || "",
      price: d.final_price_eur || 0,
      durationHours: d.duration_hours || 0,
      category: d.category || undefined,
      startCity: d.departure_city || undefined,
    }));

    // Overnight trips (hardcoded for now)
    const overnightTrips: Journey[] = [
      {
        type: "overnight",
        slug: "agafay-desert",
        title: "Agafay Desert Overnight",
        description:
          "One night in the hammada—the stone desert. Sunset camel ride, dinner under the sky, silence you can feel.",
        heroImage:
          "https://res.cloudinary.com/drstfu5yr/image/upload/v1769611923/agafay-desert_sp7d6n.jpg",
        price: 450,
        durationDays: 2,
        category: "Desert",
        startCity: "Marrakech",
      },
    ];

    return { journeys, dayTrips, overnightTrips };
  } catch (error) {
    console.error("Error fetching journeys:", error);
    return { journeys: [], dayTrips: [], overnightTrips: [] };
  }
}

export default async function JourneysPage() {
  const { journeys, dayTrips, overnightTrips } = await getJourneys();

  // Filter visible journeys (not hidden)
  const visibleJourneys = journeys.filter((j) => !j.hidden);
  const dataLoaded = journeys.length > 0 || dayTrips.length > 0;

  return (
    <JourneysContent
      initialJourneys={journeys}
      visibleJourneys={visibleJourneys}
      dayTrips={dayTrips}
      overnightTrips={overnightTrips}
      dataLoaded={dataLoaded}
    />
  );
}
