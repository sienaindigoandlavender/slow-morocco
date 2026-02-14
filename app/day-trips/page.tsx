import { getDayTrips } from "@/lib/supabase";
import DayTripsContent from "./DayTripsContent";

export const revalidate = 3600;

export default async function DayTripsPage() {
  let dayTrips: any[] = [];
  let dataLoaded = false;

  try {
    const data = await getDayTrips({ published: true });
    dayTrips = data.map((t) => ({
      slug: t.slug || "",
      title: t.title || "",
      shortDescription: t.short_description || "",
      durationHours: t.duration_hours || 0,
      priceMAD: t.final_price_mad || 0,
      priceEUR: t.final_price_eur || 0,
      category: t.category || "",
      heroImage: t.hero_image_url || "",
      region: t.region || "",
    }));
    dataLoaded = true;
  } catch (error) {
    console.error("Error fetching day trips:", error);
  }

  return <DayTripsContent initialDayTrips={dayTrips} dataLoaded={dataLoaded} />;
}
