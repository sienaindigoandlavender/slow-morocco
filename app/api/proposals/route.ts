import { NextResponse } from "next/server";
import { getProposalById } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const proposalId = url.searchParams.get("id");

    if (!proposalId) {
      return NextResponse.json(
        { success: false, error: "Proposal ID required" },
        { status: 400 }
      );
    }

    const proposal = await getProposalById(proposalId);

    if (!proposal) {
      return NextResponse.json(
        { success: false, error: "Proposal not found" },
        { status: 404 }
      );
    }

    // Parse JSON fields
    let routePoints = [];
    let daysList = [];

    try {
      routePoints =
        typeof proposal.route_points === "string"
          ? JSON.parse(proposal.route_points)
          : proposal.route_points || [];
    } catch (e) {
      console.warn("Failed to parse routePoints:", e);
    }

    try {
      daysList =
        typeof proposal.days_list === "string"
          ? JSON.parse(proposal.days_list)
          : proposal.days_list || [];
    } catch (e) {
      console.warn("Failed to parse daysList:", e);
    }

    const transformedProposal = {
      id: proposal.proposal_id,
      journeyTitle: proposal.hero_title || "Your Morocco Journey",
      arcDescription: proposal.hero_blurb || "",
      clientName: proposal.client_name || "",
      heroImage: proposal.hero_image_url || "",
      price: proposal.formatted_price || proposal.total_price || "",
      numGuests: proposal.num_guests || 2,
      startDate: proposal.start_date || "",
      endDate: proposal.end_date || "",
      routePoints: routePoints,
      days: daysList.map((day: any) => ({
        dayNumber: day.dayNumber || 1,
        date: day.date || "",
        title: day.toCity || day.title || `Day ${day.dayNumber}`,
        fromCity: day.fromCity || "",
        toCity: day.toCity || "",
        description: day.description || "",
        imageUrl: day.imageUrl || "",
        durationHours: day.durationHours || "",
        activities: day.activities || "",
        difficultyLevel: day.difficultyLevel || "",
        meals: day.meals || "",
        accommodationName: day.accommodationName || "",
      })),
    };

    return NextResponse.json({ success: true, proposal: transformedProposal });
  } catch (error: any) {
    console.error("Error fetching proposal:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
