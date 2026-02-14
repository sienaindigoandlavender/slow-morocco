import { getJourneys } from "@/lib/supabase";
import PlanYourTripForm from "@/components/PlanYourTripForm";
import PageBanner from "@/components/PageBanner";

export const revalidate = 3600;

export default async function PlanYourTripPage() {
  let journeys: { slug: string; title: string }[] = [];

  try {
    const allJourneys = await getJourneys({ published: true });
    journeys = allJourneys.map((j) => ({
      slug: j.slug || "",
      title: j.title || "",
    }));
  } catch (err) {
    console.error("Failed to load journeys for plan-your-trip:", err);
  }

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Immersive Hero Banner */}
      <PageBanner
        slug="plan-your-trip"
        fallback={{
          title: "Plan your journey",
          subtitle: "No obligation, no sales pitch—just a conversation about what you're hoping to find. Every journey begins with a question.",
          label: "Begin the Conversation",
        }}
      />

      {/* Form Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 lg:px-16 max-w-2xl">
          <PlanYourTripForm 
            journeys={journeys}
            siteId="slow-morocco"
            darkMode={false}
          />
        </div>
      </section>
    </div>
  );
}
