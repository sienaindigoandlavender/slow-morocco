import { getGentleJourneys, getWebsiteTeam, getGentleSettings, convertDriveUrl } from "@/lib/supabase";
import GentleContent from "./GentleContent";

export const revalidate = 3600;

// Fallback data in case Supabase fetch fails
const fallbackExperiences = [
  {
    id: "gentle-1",
    title: "Marrakech & The Sea",
    slug: "marrakech-and-the-sea",
    duration: 7,
    tagline: "Gardens, galleries, and the Atlantic breeze",
    description: "Gardens at golden hour. Long lunches with ocean views. Two beautiful bases, one unhurried drive between them.",
    heroImage: "https://res.cloudinary.com/drstfu5yr/image/upload/v1767309989/marrakech-and-the-sea_i5aacd.png",
    price: 2400,
    cities: "Marrakech, Essaouira",
    highlights: [] as string[],
    accessibilityNotes: [] as string[],
  },
  {
    id: "gentle-2",
    title: "Atlantic Coast",
    slug: "atlantic-coast",
    duration: 8,
    tagline: "Casablanca to Essaouira by the sea",
    description: "Follow the coastline from Casablanca to Essaouira. Art deco cities, Portuguese forts, fishing harbours at sunset.",
    heroImage: "https://res.cloudinary.com/drstfu5yr/image/upload/v1767310155/essaouira_meymce.png",
    price: 2900,
    cities: "Casablanca, Rabat, El Jadida, Essaouira",
    highlights: [] as string[],
    accessibilityNotes: [] as string[],
  },
  {
    id: "gentle-3",
    title: "Imperial Cities",
    slug: "imperial-ease",
    duration: 9,
    tagline: "Four imperial cities, all accessible",
    description: "Marrakech, Rabat, Meknes, and Fes — Morocco's royal cities connected by comfortable drives on modern highways.",
    heroImage: "https://res.cloudinary.com/drstfu5yr/image/upload/v1767310357/rabat_ofyxwj.png",
    price: 3200,
    cities: "Marrakech, Rabat, Meknes, Fes",
    highlights: [] as string[],
    accessibilityNotes: [] as string[],
  },
  {
    id: "gentle-4",
    title: "Desert Light",
    slug: "desert-edge",
    duration: 7,
    tagline: "Kasbahs without the dunes",
    description: "Rose-gold kasbahs and palm groves at the edge of the Sahara. The drama of the desert, without the discomfort.",
    heroImage: "https://res.cloudinary.com/drstfu5yr/image/upload/v1767310439/kasbah_bfd8t4.png",
    price: 2200,
    cities: "Marrakech, Skoura, Ouarzazate",
    highlights: [] as string[],
    accessibilityNotes: [] as string[],
  },
];

const fallbackTeam = [
  {
    id: "team-1",
    name: "Mohammed",
    role: "Co-Founder",
    quote: "The mountains taught me patience. I'll share that with you.",
    bio: "Born in the Atlas. Built Slow Morocco from the ground up.",
    image: "/team/Mohammed.jpg",
  },
  {
    id: "team-2",
    name: "Hassan",
    role: "Guide",
    quote: "The best part of my job is watching someone fall in love with my country.",
    bio: "Born in the Sahara, trained in hospitality. Patient, attentive, speaks four languages.",
    image: "/team/Hassan.jpg",
  },
  {
    id: "team-3",
    name: "Youssef",
    role: "Guide",
    quote: "Every road tells a story. I know them all.",
    bio: "Knows every route, every shortcut, every safe stopping point. Your comfort is his priority.",
    image: "/team/Youssef.jpg",
  },
];

const fallbackSettings = {
  heroTitle: "Built for you. Not adapted.",
  heroSubtitle: "Other companies retrofit their tours when you ask. We started with a blank page and designed these journeys around how you actually travel.",
  heroTagline: "A Slow Morocco Collection",
  founderNoteTitle: "Why I built this",
  founderNoteBody: "I've run tours in Morocco for fifteen years. I've watched travellers be told \"yes, we can accommodate you\" — then be treated as an afterthought. Squeezed into standard itineraries. Made to feel like a problem to be solved.\n\nThat's not accommodation. That's tolerance.\n\nSo I built something different. These journeys were designed from scratch for travellers who need a different pace. You're the primary guest here, not the exception.",
  whatsappUrl: "https://wa.me/212618070450?text=Hello%2C%20I%27d%20like%20to%20talk%20about%20travelling%20to%20Morocco",
  whatsappNumber: "+212 6 18 07 04 50",
  contactEmail: "hello@slowmorocco.com",
  requirements: [
    { title: "Travel insurance", description: "Travel insurance that covers medical evacuation. Non-negotiable." },
    { title: "Doctor's clearance", description: "A doctor's note confirming you're fit for this type of travel. We provide the form." },
    { title: "Honest conversation", description: "Honest conversation about what you need. The more we know, the better we can deliver." },
  ],
  promises: [
    { title: "Medical care within reach", description: "Medical care within reach — every route stays within one hour of a clinic." },
    { title: "A dedicated team", description: "A dedicated team — driver-guide throughout, plus a helper if you want one." },
    { title: "Complete honesty", description: "Complete honesty — we'll tell you what's possible and what isn't. No surprises." },
  ],
};

export default async function GentleLandingPage() {
  let experiences = fallbackExperiences;
  let team = fallbackTeam;
  let settings = fallbackSettings;

  try {
    const [journeysData, teamData, settingsData] = await Promise.all([
      getGentleJourneys({ published: true }),
      getWebsiteTeam({ published: true, showOnGentle: true }),
      getGentleSettings(),
    ]);

    // Format journeys from Supabase
    if (journeysData?.length > 0) {
      experiences = journeysData.map((j) => ({
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
    }

    // Format team
    if (teamData?.length > 0) {
      team = teamData.map((t) => ({
        id: t.team_id || "",
        name: t.name || "",
        role: t.role || "",
        quote: t.quote || "",
        bio: t.bio || "",
        image: convertDriveUrl(t.image_url || ""),
      }));
    }

    // Build settings
    if (settingsData) {
      const whatsappNumber = (settingsData.whatsapp_number || "+212618070450").replace(/\D/g, "");
      const whatsappMessage = encodeURIComponent(settingsData.whatsapp_message || "Hello, I'd like to talk about travelling to Morocco");

      settings = {
        heroTitle: settingsData.hero_title || fallbackSettings.heroTitle,
        heroSubtitle: settingsData.hero_subtitle || fallbackSettings.heroSubtitle,
        heroTagline: settingsData.hero_tagline || fallbackSettings.heroTagline,
        founderNoteTitle: settingsData.founder_note_title || fallbackSettings.founderNoteTitle,
        founderNoteBody: settingsData.founder_note_body || fallbackSettings.founderNoteBody,
        whatsappUrl: `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`,
        whatsappNumber: settingsData.whatsapp_number || "+212 6 18 07 04 50",
        contactEmail: settingsData.contact_email || "hello@slowmorocco.com",
        requirements: [
          { title: "Travel insurance", description: settingsData.requirement_insurance || "" },
          { title: "Doctor's clearance", description: settingsData.requirement_doctor || "" },
          { title: "Honest conversation", description: settingsData.requirement_honesty || "" },
        ].filter((r) => r.description),
        promises: [
          { title: "Medical care within reach", description: settingsData.promise_medical || "" },
          { title: "A dedicated team", description: settingsData.promise_team || "" },
          { title: "Complete honesty", description: settingsData.promise_honesty || "" },
        ].filter((p) => p.description),
      };

      // If no requirements/promises from DB, use fallbacks
      if (settings.requirements.length === 0) settings.requirements = fallbackSettings.requirements;
      if (settings.promises.length === 0) settings.promises = fallbackSettings.promises;
    }
  } catch (err) {
    console.error("Failed to load gentle journeys from Supabase:", err);
    // Falls through to use fallback data
  }

  return (
    <GentleContent
      initialExperiences={experiences}
      initialTeam={team}
      initialSettings={settings}
    />
  );
}
