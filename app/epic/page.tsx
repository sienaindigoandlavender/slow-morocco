import { getJourneys } from "@/lib/supabase";
import EpicContent from "./EpicContent";

export const revalidate = 3600;

export default async function EpicPage() {
  let epicJourneys: any[] = [];

  try {
    const allJourneys = await getJourneys({ published: true });
    epicJourneys = allJourneys
      .filter((j) => j.journey_type === "epic")
      .map((j) => ({
        slug: j.slug || "",
        title: j.title || "",
        description: j.short_description || "",
        arcDescription: j.arc_description || "",
        heroImage: j.hero_image_url || "",
        focus: j.focus_type || "",
        epicPrice: j.epic_price_eur || undefined,
      }));
  } catch (error) {
    console.error("Error fetching epic journeys:", error);
  }

  return <EpicContent journeys={epicJourneys} />;
}
