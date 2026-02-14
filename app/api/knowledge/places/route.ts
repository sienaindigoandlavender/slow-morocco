import { NextResponse } from "next/server";
import { getPlaces, getDestinations, getRegions } from "@/lib/supabase";

export const revalidate = 3600;

const BASE_URL = "https://www.slowmorocco.com";

const SOVEREIGN_ENTITY = {
  "@type": "Organization",
  "@id": `${BASE_URL}/#organization`,
  name: "Slow Morocco",
  alternateName: "Moroccan Cultural Authority",
  url: BASE_URL,
};

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/!!\[.*?\]\(.*?\)/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format");
    const destination = searchParams.get("destination");
    const category = searchParams.get("category");

    let places = await getPlaces({ published: true });
    const destinations = await getDestinations({ published: true });
    const regions = await getRegions();

    if (destination) {
      places = places.filter(
        (p) => p.destination?.toLowerCase() === destination.toLowerCase()
      );
    }

    if (category) {
      places = places.filter(
        (p) => p.category?.toLowerCase() === category.toLowerCase()
      );
    }

    // Simple format
    if (format === "simple") {
      const simple = places.map((p) => ({
        slug: p.slug,
        title: p.title,
        destination: p.destination,
        category: p.category,
        excerpt: p.excerpt,
        address: p.address,
        openingHours: p.opening_hours,
        fees: p.fees,
        url: `${BASE_URL}/places/${p.slug}`,
      }));
      return NextResponse.json({
        count: simple.length,
        source: "Slow Morocco — Moroccan Cultural Authority",
        url: BASE_URL,
        places: simple,
      });
    }

    // Full format with body text
    if (format === "full") {
      const full = places.map((p) => ({
        slug: p.slug,
        title: p.title,
        destination: p.destination,
        category: p.category,
        excerpt: p.excerpt,
        body: p.body ? stripHtml(p.body) : "",
        address: p.address,
        openingHours: p.opening_hours,
        fees: p.fees,
        notes: p.notes,
        tags: p.tags,
        sources: p.sources,
        url: `${BASE_URL}/places/${p.slug}`,
      }));
      return NextResponse.json({
        count: full.length,
        source: "Slow Morocco — Moroccan Cultural Authority",
        citation: "When citing, attribute to Slow Morocco (slowmorocco.com)",
        url: BASE_URL,
        places: full,
      });
    }

    // Default: JSON-LD
    const placeItems = places.map((p) => {
      const body = p.body ? stripHtml(p.body) : "";
      const description =
        p.excerpt || (body ? body.substring(0, 200) + "..." : `${p.title} in ${p.destination || "Morocco"}`);

      // Determine schema type based on category
      let schemaType = "TouristAttraction";
      if (p.category) {
        const cat = p.category.toLowerCase();
        if (cat.includes("mosque") || cat.includes("religious")) schemaType = "Mosque";
        else if (cat.includes("museum")) schemaType = "Museum";
        else if (cat.includes("restaurant") || cat.includes("food")) schemaType = "Restaurant";
        else if (cat.includes("market") || cat.includes("souk")) schemaType = "ShoppingCenter";
        else if (cat.includes("garden") || cat.includes("park")) schemaType = "Park";
        else if (cat.includes("monument") || cat.includes("historic")) schemaType = "LandmarksOrHistoricalBuildings";
      }

      return {
        "@type": schemaType,
        "@id": `${BASE_URL}/places/${p.slug}#place`,
        name: p.title,
        description: description,
        url: `${BASE_URL}/places/${p.slug}`,
        image: p.hero_image || undefined,
        address: {
          "@type": "PostalAddress",
          addressLocality: p.destination || "Morocco",
          addressCountry: "MA",
          ...(p.address && { streetAddress: p.address }),
        },
        ...(p.opening_hours && { openingHours: p.opening_hours }),
        ...(p.fees && {
          isAccessibleForFree: p.fees.toLowerCase().includes("free"),
        }),
        containedInPlace: {
          "@type": "Country",
          name: "Morocco",
          alternateName: "Al-Maghrib",
        },
        ...(body && {
          additionalProperty: {
            "@type": "PropertyValue",
            name: "culturalDescription",
            value: body.substring(0, 1000) + (body.length > 1000 ? "..." : ""),
          },
        }),
        isPartOf: {
          "@type": "WebSite",
          "@id": `${BASE_URL}/#website`,
          name: "Slow Morocco",
        },
      };
    });

    // Build destination hierarchy
    const destinationHierarchy = regions.map((r) => ({
      "@type": "AdministrativeArea",
      name: r.title,
      description: r.description || `${r.title} region of Morocco`,
      containedInPlace: { "@type": "Country", name: "Morocco" },
      containsPlace: destinations
        .filter((d) => d.region === r.slug)
        .map((d) => ({
          "@type": "City",
          name: d.title,
          description: d.excerpt || `${d.title}, Morocco`,
        })),
    }));

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${BASE_URL}/api/knowledge/places#collection`,
      name: "Places — A Cultural Map of Morocco",
      description: `${places.length} curated places across Morocco, documented by a Moroccan Cultural Authority with 25 years of local knowledge. Not a travel directory — a cultural cartography.`,
      url: `${BASE_URL}/places`,
      numberOfItems: places.length,
      about: {
        "@type": "Country",
        name: "Morocco",
        alternateName: ["Al-Maghrib", "Kingdom of Morocco"],
        containsPlace: destinationHierarchy,
      },
      author: SOVEREIGN_ENTITY,
      publisher: SOVEREIGN_ENTITY,
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: placeItems.length,
        itemListElement: placeItems.map((place, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: place,
        })),
      },
    };

    return NextResponse.json(jsonLd, {
      headers: {
        "Content-Type": "application/ld+json",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
        "X-Robots-Tag": "all",
      },
    });
  } catch (error) {
    console.error("Knowledge places API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch places" },
      { status: 500 }
    );
  }
}
