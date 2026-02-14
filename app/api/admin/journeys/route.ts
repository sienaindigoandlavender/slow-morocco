import { NextResponse } from "next/server";
import { getQuotes } from "@/lib/supabase";

export async function GET() {
  try {
    const journeys = await getQuotes();
    return NextResponse.json({ success: true, journeys });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
