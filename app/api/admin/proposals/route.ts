import { NextResponse } from "next/server";
import { getProposals, createProposal } from "@/lib/supabase";

export async function GET() {
  try {
    const proposals = await getProposals();
    return NextResponse.json({ success: true, proposals });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const proposalId = `PRP-${Date.now()}`;

    const proposal = await createProposal({
      proposal_id: proposalId,
      client_id: data.clientId || "",
      client_name: data.clientName || "",
      country: data.country || "",
      hero_image_url: data.heroImageUrl || "",
      hero_title: data.heroTitle || "",
      hero_blurb: data.heroBlurb || "",
      start_date: data.startDate || "",
      end_date: data.endDate || "",
      days: data.days || "",
      nights: data.nights || "",
      num_guests: data.numGuests || "",
      total_price: data.totalPrice || "",
      formatted_price: data.formattedPrice || "",
      route_points: JSON.stringify(data.routePoints || []),
      days_list: JSON.stringify(data.daysList || []),
    });

    if (!proposal) {
      return NextResponse.json(
        { success: false, error: "Failed to create proposal" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      proposalId,
      message: "Proposal created successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
