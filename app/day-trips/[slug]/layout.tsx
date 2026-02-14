import { Metadata } from "next";
import { getDayTripBySlug, convertDriveUrl } from "@/lib/supabase";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const trip = await getDayTripBySlug(slug);

  if (!trip) {
    return {
      title: "Day Trip Not Found",
      description: "The requested day trip could not be found.",
    };
  }

  const title = trip.title;
  const description = trip.short_description?.slice(0, 160) || 
    `${trip.title} - a private day trip from ${trip.departure_city || 'Marrakech'} with Slow Morocco.`;
  const heroImage = trip.hero_image_url ? convertDriveUrl(trip.hero_image_url) : null;

  return {
    title: title,
    description: description,
    keywords: [
      "morocco day trip",
      trip.departure_city?.toLowerCase(),
      "private day trip morocco",
      "marrakech excursion",
    ].filter((k): k is string => Boolean(k)),
    openGraph: {
      title: `${title} | Slow Morocco`,
      description: description,
      url: `https://www.slowmorocco.com/day-trips/${slug}`,
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
      canonical: `https://www.slowmorocco.com/day-trips/${slug}`,
    },
  };
}

export default function DayTripLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
