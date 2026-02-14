import { NextResponse } from "next/server";
import { getStories, createStories, type Story } from "@/lib/supabase";

export const dynamic = "force-dynamic";

interface StoryData {
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
  published?: string;
  order?: string;
  featured?: string;
  midjourney_prompt?: string;
}

export async function POST(request: Request) {
  try {
    const { stories }: { stories: StoryData[] } = await request.json();

    if (!stories || !Array.isArray(stories) || stories.length === 0) {
      return NextResponse.json({ error: "stories array is required" }, { status: 400 });
    }

    // Get existing stories to check for duplicate slugs
    const existingStories = await getStories();
    const existingSlugs = new Set(existingStories.map((s) => s.slug));

    // Filter out stories with duplicate slugs
    const newStories = stories.filter((story) => {
      if (!story.slug || !story.title) {
        console.warn("Skipping story without slug or title");
        return false;
      }
      if (existingSlugs.has(story.slug)) {
        console.warn(`Skipping duplicate slug: ${story.slug}`);
        return false;
      }
      return true;
    });

    if (newStories.length === 0) {
      return NextResponse.json(
        { error: "No valid new stories to add (all slugs may already exist)" },
        { status: 400 }
      );
    }

    // Convert to Supabase format
    const supabaseStories: Partial<Story>[] = newStories.map((s) => ({
      slug: s.slug,
      title: s.title,
      subtitle: s.subtitle || null,
      category: s.category || null,
      source_type: s.sourceType || null,
      hero_image: s.heroImage || null,
      hero_caption: s.heroCaption || null,
      excerpt: s.excerpt || null,
      body: s.body || null,
      read_time: s.readTime ? parseInt(s.readTime) : null,
      year: s.year ? parseInt(s.year) : null,
      text_by: s.textBy || null,
      images_by: s.imagesBy || null,
      sources: s.sources || null,
      the_facts: s.the_facts || null,
      tags: s.tags || null,
      region: s.region || null,
      published: s.published === "true" || s.published === "TRUE",
      sort_order: s.order ? parseInt(s.order) : null,
      featured: s.featured === "true" || s.featured === "TRUE",
      mj_prompt: s.midjourney_prompt || null,
    }));

    const created = await createStories(supabaseStories);

    return NextResponse.json({
      success: true,
      message: `Added ${created.length} stories`,
      slugs: created.map((s) => s.slug),
    });
  } catch (error) {
    console.error("Error adding stories:", error);
    return NextResponse.json({ error: "Failed to add stories" }, { status: 500 });
  }
}
