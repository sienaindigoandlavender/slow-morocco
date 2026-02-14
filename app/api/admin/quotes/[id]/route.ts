import { NextResponse } from "next/server";

// QUOTES NOT MIGRATED TO SUPABASE - stub routes

export async function GET() {
  return NextResponse.json(
    { success: false, error: "Quotes not migrated to Supabase" },
    { status: 404 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { success: false, error: "Quotes not migrated to Supabase" },
    { status: 404 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { success: false, error: "Quotes not migrated to Supabase" },
    { status: 404 }
  );
}
