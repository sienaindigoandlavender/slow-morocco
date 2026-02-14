import { NextResponse } from "next/server";
import { getGentleJourneys, getWebsiteTeam, getGentleSettings, convertDriveUrl } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const [journeys, team, settings] = await Promise.all([
      getGentleJourneys({ published: true }),
      getWebsiteTeam({ published: true, showOnGentle: true }),
      getGentleSettings(),
    ]);

    // Format journeys
    const formattedJourneys = journeys.map((j) => ({
      id: j.journey_id || "",
      title: j.title || "",
      slug: j.slug || "",
      heroImage: convertDriveUrl(j.hero_image_url || ""),
      tagline: j.tagline || "",
      description: j.description || "",
      duration: j.duration_days || 0,
      price: j.price_eur || 0,
      cities: j.route_cities || "",
      highlights: (j.highlights || "").split("|").filter(Boolean),
      accessibilityNotes: (j.accessibility_notes || "").split("|").filter(Boolean),
    }));

    // Format team
    const formattedTeam = team.map((t) => ({
      id: t.team_id || "",
      name: t.name || "",
      role: t.role || "",
      quote: t.quote || "",
      bio: t.bio || "",
      image: convertDriveUrl(t.image_url || ""),
    }));

    // Build WhatsApp URL
    const whatsappNumber = (settings.whatsapp_number || "+212618070450").replace(/\D/g, "");
    const whatsappMessage = encodeURIComponent(settings.whatsapp_message || "Hello, I'd like to talk about travelling to Morocco");
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

    return NextResponse.json({
      success: true,
      journeys: formattedJourneys,
      team: formattedTeam,
      settings: {
        heroTitle: settings.hero_title || "Built for you. Not adapted.",
        heroSubtitle: settings.hero_subtitle || "",
        heroTagline: settings.hero_tagline || "A Slow Morocco Collection",
        founderNoteTitle: settings.founder_note_title || "Why I built this",
        founderNoteBody: settings.founder_note_body || "",
        whatsappUrl,
        whatsappNumber: settings.whatsapp_number || "+212618070450",
        contactEmail: settings.contact_email || "hello@slowmorocco.com",
        requirements: [
          { title: "Travel insurance", description: settings.requirement_insurance || "" },
          { title: "Doctor's clearance", description: settings.requirement_doctor || "" },
          { title: "Honest conversation", description: settings.requirement_honesty || "" },
        ].filter((r) => r.description),
        promises: [
          { title: "Medical care within reach", description: settings.promise_medical || "" },
          { title: "A dedicated team", description: settings.promise_team || "" },
          { title: "Complete honesty", description: settings.promise_honesty || "" },
        ].filter((p) => p.description),
      },
    });
  } catch (error: any) {
    console.error("Gentle journeys fetch error:", error);
    return NextResponse.json(
      { success: false, journeys: [], team: [], settings: {}, error: error.message },
      { status: 500 }
    );
  }
}
