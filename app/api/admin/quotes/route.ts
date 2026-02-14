import { NextResponse } from "next/server";

// QUOTES NOT MIGRATED TO SUPABASE - stub route

export async function GET() {
  return NextResponse.json({ success: true, quotes: [] });
}

export async function POST() {
  return NextResponse.json(
    { success: false, error: "Quotes not migrated to Supabase" },
    { status: 404 }
  );
}
