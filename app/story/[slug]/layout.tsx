import { Metadata } from "next";
import { getStoryBySlug, convertDriveUrl } from "@/lib/supabase";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);

  if (!story) {
    return {
      title: "Story Not Found",
      description: "The requested story could not be found.",
    };
  }

  const title = story.title;
  const description = story.excerpt?.slice(0, 160) || 
    story.subtitle ||
    `Read ${story.title} - a story from Slow Morocco about travel, culture, and discovery in Morocco.`;
  const heroImage = story.hero_image ? convertDriveUrl(story.hero_image) : null;

  return {
    title: title,
    description: description,
    keywords: [
      "morocco travel",
      "morocco stories",
      "morocco culture",
      story.category?.toLowerCase(),
    ].filter((k): k is string => Boolean(k)),
    openGraph: {
      title: `${title} | Slow Morocco`,
      description: description,
      url: `https://www.slowmorocco.com/story/${slug}`,
      type: "article",
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
      ...(story.created_at && {
        publishedTime: story.created_at,
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Slow Morocco`,
      description: description,
      images: heroImage ? [heroImage] : undefined,
    },
    alternates: {
      canonical: `https://www.slowmorocco.com/story/${slug}`,
    },
  };
}

export default function StoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
