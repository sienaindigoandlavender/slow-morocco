import { NextResponse } from "next/server";
import { getStories, createStories, type Story } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// Hardcoded seed stories (same as original)
const SEED_STORIES = [
  {
    slug: "moroccan-tea-ceremony",
    title: "The Art of Moroccan Tea",
    subtitle: "More than a drink — a daily ritual of hospitality",
    category: "Culture",
    sourceType: "original",
    excerpt: "In Morocco, tea is not simply poured. It is performed.",
    readTime: 5,
    published: true,
    sort_order: 1,
    featured: false,
  },
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { stories: customStories } = body || {};

    const storiesToSeed = customStories || SEED_STORIES;

    // Get existing stories to avoid duplicates
    const existingStories = await getStories();
    const existingSlugs = new Set(existingStories.map((s) => s.slug));

    const newStories = storiesToSeed.filter(
      (s: any) => s.slug && !existingSlugs.has(s.slug)
    );

    if (newStories.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No new stories to seed (all slugs already exist)",
        added: 0,
        skipped: storiesToSeed.length,
      });
    }

    // Map to Supabase format
    const supabaseStories: Partial<Story>[] = newStories.map((s: any) => ({
      slug: s.slug,
      title: s.title || "",
      subtitle: s.subtitle || null,
      category: s.category || null,
      source_type: s.sourceType || s.source_type || null,
      hero_image: s.heroImage || s.hero_image || null,
      hero_caption: s.heroCaption || s.hero_caption || null,
      excerpt: s.excerpt || null,
      body: s.body || null,
      read_time: s.readTime || s.read_time || null,
      year: s.year || null,
      text_by: s.textBy || s.text_by || null,
      images_by: s.imagesBy || s.images_by || null,
      sources: s.sources || null,
      the_facts: s.the_facts || null,
      tags: s.tags || null,
      region: s.region || null,
      published: s.published === true || s.published === "true",
      sort_order: s.sort_order || s.order || null,
      featured: s.featured === true || s.featured === "true",
      mj_prompt: s.midjourney_prompt || s.mj_prompt || null,
    }));

    const created = await createStories(supabaseStories);

    return NextResponse.json({
      success: true,
      message: `Seeded ${created.length} stories`,
      added: created.length,
      skipped: storiesToSeed.length - newStories.length,
      slugs: created.map((s) => s.slug),
    });
  } catch (error: any) {
    console.error("Error seeding stories:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
