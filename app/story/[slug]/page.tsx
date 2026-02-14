import { notFound } from "next/navigation";
import { getStoryBySlug, getStories } from "@/lib/supabase";
import StoryDetailContent from "./StoryDetailContent";

export const revalidate = 3600;

interface Story {
  slug: string;
  title: string;
  subtitle?: string;
  category?: string;
  sourceType?: string;
  heroImage?: string;
  heroCaption?: string;
  excerpt?: string;
  body?: string;
  readTime?: string;
  year?: string;
  textBy?: string;
  imagesBy?: string;
  sources?: string;
  the_facts?: string;
  tags?: string;
  region?: string;
  country?: string;
  era?: string;
  theme?: string;
}

async function getStoryData(slug: string) {
  const storyData = await getStoryBySlug(slug);
  if (!storyData) return null;

  const story: Story = {
    slug: storyData.slug,
    title: storyData.title,
    subtitle: storyData.subtitle ?? undefined,
    category: storyData.category ?? undefined,
    sourceType: storyData.source_type ?? undefined,
    heroImage: storyData.hero_image ?? undefined,
    heroCaption: storyData.hero_caption ?? undefined,
    excerpt: storyData.excerpt ?? undefined,
    body: storyData.body ? storyData.body.replace(/<br>/g, '\n') : undefined,
    readTime: storyData.read_time ? String(storyData.read_time) : undefined,
    year: storyData.year ? String(storyData.year) : undefined,
    textBy: storyData.text_by ?? undefined,
    imagesBy: storyData.images_by ?? undefined,
    sources: storyData.sources ?? undefined,
    tags: storyData.tags ?? undefined,
    the_facts: storyData.the_facts ?? undefined,
    region: storyData.region ?? undefined,
    country: storyData.country ?? undefined,
    era: storyData.era ?? undefined,
    theme: storyData.theme ?? undefined,
  };

  return story;
}

async function getRelatedStories(currentStory: Story, currentSlug: string) {
  try {
    const allStories = await getStories({ published: true });
    const stories = allStories.map((s) => ({
      slug: s.slug,
      title: s.title,
      subtitle: s.subtitle || undefined,
      category: s.category || undefined,
      sourceType: undefined,
      heroImage: s.hero_image || undefined,
      heroCaption: undefined,
      excerpt: s.excerpt || undefined,
      body: undefined,
      readTime: undefined,
      year: undefined,
      textBy: undefined,
      imagesBy: undefined,
      sources: undefined,
      the_facts: undefined,
      tags: s.tags || undefined,
      region: s.region || undefined,
    } satisfies Story));

    const related = stories.filter((s) => {
      if (s.slug === currentSlug) return false;
      if (s.category && currentStory.category && s.category === currentStory.category) return true;
      if (s.tags && currentStory.tags) {
        const sTags = s.tags.toLowerCase().split(",").map((t) => t.trim());
        const storyTags = currentStory.tags.toLowerCase().split(",").map((t) => t.trim());
        if (sTags.some((t) => storyTags.includes(t))) return true;
      }
      if (s.region && currentStory.region && s.region === currentStory.region) return true;
      return false;
    });

    return related.slice(0, 3);
  } catch {
    return [];
  }
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = await getStoryData(slug);

  if (!story) {
    notFound();
  }

  const relatedStories = await getRelatedStories(story, slug);

  return (
    <StoryDetailContent
      story={story}
      images={[]}
      relatedStories={relatedStories}
      slug={slug}
    />
  );
}
