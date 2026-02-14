import { Suspense } from "react";
import { getRegions, getDestinations, getPlaces } from "@/lib/supabase";
import PlacesContent from "./PlacesContent";

// Revalidate every hour
export const revalidate = 3600;

interface RegionItem {
  slug: string;
  title: string;
  subtitle: string;
  heroImage: string;
}

interface DestinationItem {
  slug: string;
  title: string;
  subtitle: string;
  region: string;
  heroImage: string;
  excerpt: string;
}

interface PlaceItem {
  slug: string;
  title: string;
  destination: string;
  category: string;
  heroImage: string;
  excerpt: string;
}

async function fetchPlacesData() {
  try {
    const [regionsData, destinationsData, placesData] = await Promise.all([
      getRegions(),
      getDestinations({ published: true }),
      getPlaces({ published: true }),
    ]);

    const regions: RegionItem[] = regionsData.map((r) => ({
      slug: r.slug,
      title: r.title,
      subtitle: r.subtitle || "",
      heroImage: r.hero_image || "",
    }));

    const destinations: DestinationItem[] = destinationsData.map((d) => ({
      slug: d.slug,
      title: d.title,
      subtitle: d.subtitle || "",
      region: d.region || "",
      heroImage: d.hero_image || "",
      excerpt: d.excerpt || "",
    }));

    const places: PlaceItem[] = placesData.map((p) => ({
      slug: p.slug,
      title: p.title,
      destination: p.destination || "",
      category: p.category || "",
      heroImage: p.hero_image || "",
      excerpt: p.excerpt || "",
    }));

    return { regions, destinations, places, dataLoaded: places.length > 0 };
  } catch (error) {
    console.error("Error fetching places data:", error);
    return { regions: [], destinations: [], places: [], dataLoaded: false };
  }
}

export default async function PlacesPage() {
  const { regions, destinations, places, dataLoaded } = await fetchPlacesData();

  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <PlacesContent
        initialRegions={regions}
        initialDestinations={destinations}
        initialPlaces={places}
        dataLoaded={dataLoaded}
      />
    </Suspense>
  );
}
