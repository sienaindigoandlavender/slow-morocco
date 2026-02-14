import { NextResponse } from "next/server";
import { getRoutes, convertDriveUrl } from "@/lib/supabase";

export async function GET() {
  try {
    const routes = await getRoutes();

    const contentBlocks = routes.map((row, index) => ({
      id: row.id || `content-${index}`,
      cityName: row.to_city || row.from_city || "",
      dayTitle: row.day_title || "",
      description: row.route_description || "",
      imageUrl: convertDriveUrl(row.image_url || ""),
      heroImageUrl: convertDriveUrl(row.hero_image_url || ""),
      heroTitle: row.hero_title || "",
      heroBlurb: row.hero_blurb || "",
      fromCity: row.from_city || "",
      toCity: row.to_city || "",
      dayNumber: row.day_number || "",
      highlights: row.highlights || "",
      activities: row.activities || "",
      meals: row.meals || "",
      accommodationType: row.accommodation_type || "",
      region: row.region || "",
      subRegion: row.sub_region || "",
      durationHours: row.day_duration_hours || "",
      difficultyLevel: row.difficulty_level || "",
      practicalInfo: row.practical_information || "",
    }));

    const validBlocks = contentBlocks.filter(
      (block) =>
        block.cityName || block.dayTitle || block.description || block.toCity ||
        block.heroTitle || block.heroBlurb || block.heroImageUrl
    );

    return NextResponse.json({
      success: true,
      contentBlocks: validBlocks,
      debug: {
        totalRows: routes.length,
        validBlocks: validBlocks.length,
      },
    });
  } catch (error: any) {
    console.error("Content Library fetch error:", error);
    return NextResponse.json(
      { success: false, error: error.message, contentBlocks: [] },
      { status: 500 }
    );
  }
}
