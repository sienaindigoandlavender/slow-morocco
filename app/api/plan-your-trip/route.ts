import { NextResponse } from "next/server";
import { generateClientId, createQuote } from "@/lib/supabase";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      journey,
      month,
      year,
      travelers,
      days,
      language,
      budget,
      requests,
      firstName,
      lastName,
      email,
      phone,
      countryCode,
      country,
      hearAboutUs,
    } = body;

    // Generate client ID
    const clientId = await generateClientId();

    // Calculate dates
    const createdDate = new Date().toISOString();
    const nights = parseInt(days) > 0 ? parseInt(days) - 1 : 0;

    const monthIndex = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ].indexOf(month);
    const startDate = monthIndex >= 0 ? `${year}-${String(monthIndex + 1).padStart(2, "0")}-15` : "";

    // Create quote in Supabase
    const quote = await createQuote({
      client_id: clientId,
      first_name: firstName,
      last_name: lastName,
      email,
      whatsapp_country_code: (countryCode || "").replace("+", ""),
      whatsapp_number: phone,
      journey_interest: journey,
      start_date: startDate,
      end_date: "",
      days: days,
      nights: nights.toString(),
      language,
      hospitality_level: "",
      dream_experience: "",
      requests: requests || "",
      hear_about_us: hearAboutUs || "",
      number_travelers: travelers,
      budget,
      start_city: "",
      end_city: "",
      journey_type: "",
      status: "NEW",
      itinerary_doc_link: "",
      proposal_url: "",
      created_date: createdDate,
      last_updated: createdDate,
      notes: "",
      country: country || "",
    });

    if (!quote) {
      return NextResponse.json(
        { success: false, error: "Failed to create quote" },
        { status: 500 }
      );
    }

    // Send email notifications
    if (resend && process.env.CONTACT_EMAIL) {
      try {
        const adminUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.slowmorocco.com"}/admin/quotes/${clientId}`;

        // Client acknowledgment
        await resend.emails.send({
          from: "Slow Morocco <hello@slowmorocco.com>",
          to: email,
          subject: `We've received your journey request`,
          html: `
            <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <h1 style="font-size: 24px; font-weight: normal; margin-bottom: 30px;">Dear ${firstName},</h1>
              <p style="line-height: 1.8; color: #333;">Thank you for your interest in exploring Morocco with us. We've received your journey request and are excited to start crafting your personalized itinerary.</p>
              <div style="background: #f9f7f4; padding: 24px; margin: 30px 0;">
                <p style="margin: 0 0 10px 0;"><strong>Journey Interest:</strong> ${journey}</p>
                <p style="margin: 0 0 10px 0;"><strong>Travel Dates:</strong> ${month} ${year}</p>
                <p style="margin: 0 0 10px 0;"><strong>Travelers:</strong> ${travelers}</p>
                <p style="margin: 0;"><strong>Duration:</strong> ${days} days</p>
              </div>
              <p style="line-height: 1.8; color: #333;">Our team will review your request and get back to you within 24-48 hours with a custom proposal designed around your interests.</p>
              <p style="line-height: 1.8; color: #333;">In the meantime, feel free to explore our <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://www.slowmorocco.com"}/journeys" style="color: #000;">journey collection</a> for inspiration.</p>
              <p style="line-height: 1.8; color: #333; margin-top: 40px;">Warm regards,<br>The Slow Morocco Team</p>
            </div>
          `,
        });

        // Admin notification
        await resend.emails.send({
          from: "Slow Morocco <noreply@slowmorocco.com>",
          to: process.env.CONTACT_EMAIL,
          subject: `New Journey Request: ${firstName} ${lastName} (${clientId})`,
          html: `
            <h2>New Journey Request</h2>
            <p><strong>Client ID:</strong> ${clientId}</p>
            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${countryCode} ${phone}</p>
            <p><strong>Country:</strong> ${country || "Not specified"}</p>
            <hr>
            <p><strong>Journey:</strong> ${journey}</p>
            <p><strong>Travel Dates:</strong> ${month} ${year}</p>
            <p><strong>Travelers:</strong> ${travelers}</p>
            <p><strong>Duration:</strong> ${days} days</p>
            <p><strong>Language:</strong> ${language}</p>
            <p><strong>Budget:</strong> ${budget}</p>
            <hr>
            <p><strong>Special Requests:</strong> ${requests || "None"}</p>
            <p><strong>Heard about us:</strong> ${hearAboutUs || "Not specified"}</p>
            <br>
            <p><a href="${adminUrl}" style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; display: inline-block;">Build Quote for ${firstName}</a></p>
          `,
        });
      } catch (emailError) {
        console.error("Email send error:", emailError);
      }
    }

    return NextResponse.json({
      success: true,
      clientId,
      message: "Journey request submitted successfully",
    });
  } catch (error: any) {
    console.error("Plan your trip error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
