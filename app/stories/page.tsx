import { getStories } from "@/lib/supabase";
import StoriesContent from "./StoriesContent";

// Revalidate every hour
export const revalidate = 3600;

interface StoryItem {
  slug: string;
  title: string;
  subtitle?: string;
  mood?: string;
  heroImage?: string;
  excerpt?: string;
}

async function fetchStories(): Promise<StoryItem[]> {
  try {
    const storiesData = await getStories({ published: true });
    return storiesData.map((story) => ({
      slug: story.slug,
      title: story.title,
      subtitle: story.subtitle || undefined,
      mood: story.category || undefined,
      heroImage: story.hero_image || undefined,
      excerpt: story.excerpt || undefined,
    }));
  } catch (error) {
    console.error("Error fetching stories:", error);
    return [];
  }
}

export default async function StoriesPage() {
  const stories = await fetchStories();
  const dataLoaded = stories.length > 0;

  return <StoriesContent initialStories={stories} dataLoaded={dataLoaded} />;
}
