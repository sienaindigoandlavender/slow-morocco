import { getJourneys, getStories, getWebsiteSettings, getTestimonials } from "@/lib/supabase";
import HomeContent from "./HomeContent";

export const revalidate = 3600;

export default async function HomePage() {
  let journeys: any[] = [];
  let epicJourneys: any[] = [];
  let stories: any[] = [];
  let testimonials: any[] = [];
  let settings: Record<string, string> = {};

  try {
    const [journeysData, storiesData, settingsData, testimonialsData] = await Promise.all([
      getJourneys({ published: true }),
      getStories({ published: true }),
      getWebsiteSettings(),
      getTestimonials({ published: true }),
    ]);

    // Format journeys
    const allJourneys = journeysData.map((j) => ({
      slug: j.slug || "",
      title: j.title || "",
      duration: j.duration_days ? `${j.duration_days}-Day` : "",
      durationDays: j.duration_days || 0,
      description: j.short_description || "",
      heroImage: j.hero_image_url || "",
      price: j.price_eur || 0,
      destinations: j.destinations || "",
      journeyType: j.journey_type || "regular",
      epicPrice: j.epic_price_eur || undefined,
    }));

    journeys = allJourneys.filter((j) => j.journeyType !== "epic").slice(0, 4);
    epicJourneys = allJourneys.filter((j) => j.journeyType === "epic").slice(0, 5);

    // Format stories
    stories = storiesData
      .filter((s) => s.hero_image)
      .slice(0, 3)
      .map((s) => ({
        slug: s.slug,
        title: s.title,
        subtitle: s.subtitle,
        excerpt: s.excerpt,
        heroImage: s.hero_image,
        mood: s.category,
      }));

    // Format settings
    settingsData.forEach((row) => {
      if (row.key) settings[row.key] = row.value || "";
    });

    // Format testimonials
    testimonials = testimonialsData.map((t) => ({
      id: t.testimonial_id,
      quote: t.quote,
      author: t.author,
      journeyTitle: t.journey_title || "",
    }));
  } catch (error) {
    console.error("Homepage data fetch error:", error);
  }

  return (
    <HomeContent
      journeys={journeys}
      epicJourneys={epicJourneys}
      stories={stories}
      testimonials={testimonials}
      settings={settings}
    />
  );
}
