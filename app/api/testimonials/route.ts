import { NextResponse } from "next/server";
import { getTestimonials } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const testimonials = await getTestimonials({ published: true });

    const formattedTestimonials = testimonials.map((t) => ({
      id: t.testimonial_id,
      quote: t.quote,
      author: t.author,
      journeyTitle: t.journey_title || "",
      order: t.sort_order,
    }));

    return NextResponse.json({ success: true, testimonials: formattedTestimonials });
  } catch (error: any) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json(
      { success: false, testimonials: [], error: error.message },
      { status: 500 }
    );
  }
}
