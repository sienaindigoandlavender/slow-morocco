import { notFound } from "next/navigation";
import { getPlaceBySlug, getPlaceImages, getJourneys, getStories, getDestinations } from "@/lib/supabase";
import PlaceDetailContent from "./PlaceDetailContent";

export const revalidate = 3600;

interface Place {
  slug: string;
  title: string;
  destination: string;
  category: string;
  address: string;
  openingHours: string;
  fees: string;
  notes: string;
  heroImage: string;
  heroCaption: string;
  excerpt: string;
  body: string;
  sources: string;
  tags: string;
}

interface PlaceImage {
  url: string;
  caption: string;
  order: number;
}

async function getPlaceData(slug: string) {
  const place = await getPlaceBySlug(slug);
  if (!place) return null;

  const images = await getPlaceImages(slug);

  const formattedPlace: Place = {
    slug: place.slug || "",
    title: place.title || "",
    destination: place.destination || "",
    category: place.category || "",
    address: place.address || "",
    openingHours: place.opening_hours || "",
    fees: place.fees || "",
    notes: place.notes || "",
    heroImage: place.hero_image || "",
    heroCaption: place.hero_caption || "",
    excerpt: place.excerpt || "",
    body: place.body || "",
    sources: place.sources || "",
    tags: place.tags || "",
  };

  const formattedImages: PlaceImage[] = images.map((img) => ({
    url: img.image_url || "",
    caption: img.caption || "",
    order: img.image_order,
  }));

  return { place: formattedPlace, images: formattedImages };
}

async function getRelatedContent(place: Place) {
  const destination = place.destination?.toLowerCase();
  const placeTags = (place.tags || "").toLowerCase();

  let relatedJourneys: any[] = [];
  let relatedStories: any[] = [];

  try {
    const allJourneys = await getJourneys({ published: true });
    if (destination) {
      relatedJourneys = allJourneys
        .filter((j) => {
          const destinations = j.destinations?.toLowerCase() || "";
          const isEpic = j.journey_type === "epic";
          return destinations.includes(destination) && !isEpic;
        })
        .map((j) => ({
          slug: j.slug || "",
          title: j.title || "",
          heroImage: j.hero_image_url || "",
          description: j.short_description || "",
          durationDays: j.duration_days || 0,
        }));
    }
  } catch {}

  try {
    const allStories = await getStories({ published: true });
    const matchedStories = allStories.filter((s) => {
      const storyTags = (s.tags || "").toLowerCase();
      const storyRegion = (s.region || "").toLowerCase();
      if (destination && (storyTags.includes(destination) || storyRegion.includes(destination))) return true;
      const placeTagList = placeTags.split(",").map((t: string) => t.trim()).filter(Boolean);
      for (const tag of placeTagList) {
        if (storyTags.includes(tag)) return true;
      }
      return false;
    }).map((s) => ({
      slug: s.slug,
      title: s.title,
      category: s.category,
      heroImage: s.hero_image,
    }));

    relatedStories = matchedStories.length > 0
      ? matchedStories.slice(0, 6)
      : allStories.slice(0, 6).map((s) => ({
          slug: s.slug,
          title: s.title,
          category: s.category,
          heroImage: s.hero_image,
        }));
  } catch {}

  return { relatedJourneys, relatedStories };
}

export default async function PlaceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getPlaceData(slug);

  if (!data) {
    notFound();
  }

  const { relatedJourneys, relatedStories } = await getRelatedContent(data.place);

  return (
    <PlaceDetailContent
      place={data.place}
      images={data.images}
      relatedJourneys={relatedJourneys}
      relatedStories={relatedStories}
    />
  );
}
