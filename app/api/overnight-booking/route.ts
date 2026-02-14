import { NextResponse } from "next/server";
import { createOvernightBooking } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      experienceTitle,
      tripDate,
      guestName,
      guestEmail,
      guestPhone,
      pickupLocation,
      notes,
      subtotalEUR,
      handlingFeeEUR,
      totalEUR,
      transactionId,
    } = body;

    const bookingRef = `ON-${Date.now()}`;

    const booking = await createOvernightBooking({
      booking_ref: bookingRef,
      experience: experienceTitle,
      trip_date: tripDate,
      guest_name: guestName,
      email: guestEmail,
      phone: guestPhone || "",
      pickup: pickupLocation,
      notes: notes || "",
      subtotal_eur: subtotalEUR,
      handling_fee_eur: handlingFeeEUR,
      total_eur: totalEUR,
      transaction_id: transactionId,
      status: "confirmed",
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Failed to create booking" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      bookingRef,
      message: "Booking confirmed",
    });
  } catch (error: any) {
    console.error("Overnight booking error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
