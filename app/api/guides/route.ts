import { NextResponse } from "next/server";
import { getGuides } from "@/lib/supabase";

export async function GET() {
  try {
    const guides = await getGuides();
    return NextResponse.json({ success: true, guides });
  } catch (error: any) {
    console.error("Error fetching guides:", error);
    return NextResponse.json(
      { success: false, guides: [], error: error.message },
      { status: 500 }
    );
  }
}
