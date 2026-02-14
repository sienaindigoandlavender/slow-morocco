import { Metadata } from "next";
import { getJourneyBySlug, convertDriveUrl } from "@/lib/supabase";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const journey = await getJourneyBySlug(slug);

  if (!journey) {
    return {
      title: "Journey Not Found",
      description: "The requested journey could not be found.",
    };
  }

  const title = journey.title;
  const description = journey.short_description?.slice(0, 160) || 
    `Discover ${journey.title} - a ${journey.duration_days ? journey.duration_days + "-day" : "multi-day"} private journey through Morocco with Slow Morocco.`;
  const heroImage = journey.hero_image_url ? convertDriveUrl(journey.hero_image_url) : null;
  const isEpic = journey.journey_type?.toLowerCase() === "epic";

  return {
    title: title,
    description: description,
    keywords: [
      "morocco tour",
      "private morocco journey",
      journey.start_city?.toLowerCase(),
      ...(journey.destinations?.split(",").map((d: string) => d.trim().toLowerCase()) || []),
      isEpic ? "epic morocco journey" : "morocco itinerary",
    ].filter((k): k is string => Boolean(k)),
    openGraph: {
      title: `${title} | Slow Morocco`,
      description: description,
      url: `https://www.slowmorocco.com/journeys/${slug}`,
      type: "website",
      images: heroImage
        ? [
            {
              url: heroImage,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Slow Morocco`,
      description: description,
      images: heroImage ? [heroImage] : undefined,
    },
    alternates: {
      canonical: `https://www.slowmorocco.com/journeys/${slug}`,
    },
  };
}

export default function JourneyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
