import { NextResponse } from "next/server";
import { getRoutes } from "@/lib/supabase";

export async function GET() {
  try {
    const content = await getRoutes();
    return NextResponse.json({ success: true, content });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
