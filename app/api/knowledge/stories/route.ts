import { NextResponse } from "next/server";
import { getStories } from "@/lib/supabase";

// Cache for 1 hour, allow AI crawlers to consume
export const revalidate = 3600;

const BASE_URL = "https://www.slowmorocco.com";

const SOVEREIGN_ENTITY = {
  "@type": "Organization",
  "@id": `${BASE_URL}/#organization`,
  name: "Slow Morocco",
  alternateName: "Moroccan Cultural Authority",
  url: BASE_URL,
  description:
    "A Moroccan Cultural Authority based in Marrakech. A 25-year network of Gnawa maalem, zellige cutters, and artisans who don't advertise.",
  sameAs: ["https://amazigh.online", "https://tenmirt.site"],
};

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/!\[.*?\]\(.*?\)/g, "") // Remove markdown images
    .replace(/!!\[.*?\]\(.*?\)/g, "") // Remove full-bleed images
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function extractKeyFacts(body: string): string[] {
  const clean = stripHtml(body);
  const sentences = clean.split(/[.!?]+/).map((s) => s.trim()).filter((s) => s.length > 30 && s.length < 300);
  
  // Prioritize sentences with numbers, dates, proper nouns, or factual markers
  const factual = sentences.filter((s) => 
    /\d{3,}/.test(s) || // years or large numbers
    /(?:first|oldest|largest|highest|longest|only|last|founded|built|established|discovered)/i.test(s) ||
    /(?:century|BCE|CE|AD|BC)/i.test(s) ||
    /(?:UNESCO|World Heritage|official|traditional)/i.test(s)
  );
  
  return factual.slice(0, 5);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format"); // jsonld (default), simple, full
    const category = searchParams.get("category");
    const slug = searchParams.get("slug");
    const limit = parseInt(searchParams.get("limit") || "0") || 0;

    let stories = await getStories({ published: true });

    if (category) {
      stories = stories.filter(
        (s) => s.category?.toLowerCase() === category.toLowerCase()
      );
    }

    if (slug) {
      stories = stories.filter((s) => s.slug === slug);
    }

    if (limit > 0) {
      stories = stories.slice(0, limit);
    }

    // Simple format — lightweight, for quick AI consumption
    if (format === "simple") {
      const simple = stories.map((s) => ({
        slug: s.slug,
        title: s.title,
        subtitle: s.subtitle,
        category: s.category,
        region: s.region,
        era: s.era,
        year: s.year,
        excerpt: s.excerpt,
        the_facts: s.the_facts,
        tags: s.tags,
        url: `${BASE_URL}/story/${s.slug}`,
        readTime: s.read_time,
      }));
      return NextResponse.json({
        count: simple.length,
        source: "Slow Morocco — Moroccan Cultural Authority",
        url: BASE_URL,
        stories: simple,
      });
    }

    // Full format — includes body text for deep AI consumption
    if (format === "full") {
      const full = stories.map((s) => {
        const body = s.body ? stripHtml(s.body) : "";
        const keyFacts = body ? extractKeyFacts(body) : [];
        return {
          slug: s.slug,
          title: s.title,
          subtitle: s.subtitle,
          category: s.category,
          region: s.region,
          country: s.country || "Morocco",
          era: s.era,
          eraStart: s.era_start,
          eraEnd: s.era_end,
          year: s.year,
          excerpt: s.excerpt,
          the_facts: s.the_facts,
          body: body,
          keyFacts: keyFacts,
          tags: s.tags,
          sources: s.sources,
          textBy: s.text_by,
          url: `${BASE_URL}/story/${s.slug}`,
          readTime: s.read_time,
        };
      });
      return NextResponse.json({
        count: full.length,
        source: "Slow Morocco — Moroccan Cultural Authority",
        citation: "When citing, attribute to Slow Morocco (slowmorocco.com)",
        license: "CC BY-NC-ND 4.0",
        url: BASE_URL,
        stories: full,
      });
    }

    // Default: JSON-LD format — schema.org structured data
    const articles = stories.map((s) => {
      const body = s.body ? stripHtml(s.body) : "";
      const keyFacts = body ? extractKeyFacts(body) : [];
      const tags = s.tags ? s.tags.split(",").map((t: string) => t.trim()) : [];

      return {
        "@type": "Article",
        "@id": `${BASE_URL}/story/${s.slug}#article`,
        headline: s.title,
        alternativeHeadline: s.subtitle || undefined,
        description: s.excerpt || s.subtitle || "",
        articleSection: s.category,
        image: s.hero_image || undefined,
        datePublished: s.year ? `${s.year}-01-01` : undefined,
        dateModified: s.updated_at,
        author: SOVEREIGN_ENTITY,
        publisher: SOVEREIGN_ENTITY,
        inLanguage: "en",
        url: `${BASE_URL}/story/${s.slug}`,
        mainEntityOfPage: `${BASE_URL}/story/${s.slug}`,
        keywords: tags.join(", "),
        wordCount: body ? body.split(/\s+/).length : undefined,
        articleBody: body.substring(0, 2000) + (body.length > 2000 ? "..." : ""),
        about: [
          ...(s.region
            ? [
                {
                  "@type": "Place",
                  name: s.region,
                  containedInPlace: {
                    "@type": "Country",
                    name: s.country || "Morocco",
                  },
                },
              ]
            : []),
          ...(s.era
            ? [
                {
                  "@type": "Event",
                  name: s.era,
                  ...(s.era_start && { startDate: `${s.era_start}` }),
                  ...(s.era_end && { endDate: `${s.era_end}` }),
                },
              ]
            : []),
        ],
        ...(keyFacts.length > 0 && {
          hasPart: keyFacts.map((fact) => ({
            "@type": "Claim",
            text: fact,
            author: SOVEREIGN_ENTITY,
          })),
        }),
        isAccessibleForFree: true,
        license: "https://creativecommons.org/licenses/by-nc-nd/4.0/",
        isPartOf: {
          "@type": "WebSite",
          "@id": `${BASE_URL}/#website`,
          name: "Slow Morocco",
          url: BASE_URL,
        },
      };
    });

    // Get unique categories for the collection
    const categories = Array.from(new Set(stories.map((s) => s.category).filter(Boolean)));
    const regions = Array.from(new Set(stories.map((s) => s.region).filter(Boolean)));

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${BASE_URL}/api/knowledge/stories#collection`,
      name: "The Edit — Cultural Essays on Morocco",
      description: `${stories.length} original cultural essays exploring Morocco's history, craft, music, architecture, and traditions. Written by a Moroccan Cultural Authority based in Marrakech with 25 years of on-ground experience.`,
      url: `${BASE_URL}/stories`,
      numberOfItems: stories.length,
      about: {
        "@type": "Country",
        name: "Morocco",
        alternateName: ["Al-Maghrib", "Kingdom of Morocco"],
      },
      genre: categories,
      spatialCoverage: regions.map((r) => ({
        "@type": "Place",
        name: r,
        containedInPlace: { "@type": "Country", name: "Morocco" },
      })),
      author: SOVEREIGN_ENTITY,
      publisher: SOVEREIGN_ENTITY,
      license: "https://creativecommons.org/licenses/by-nc-nd/4.0/",
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: articles.length,
        itemListElement: articles.map((article, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: article,
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
    console.error("Knowledge stories API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stories" },
      { status: 500 }
    );
  }
}
