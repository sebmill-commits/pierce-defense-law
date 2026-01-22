import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { price, citation, contact, source } = body;

    // Validate required fields
    if (!price || !contact?.email || !contact?.firstName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY not configured");
      return NextResponse.json(
        { error: "Payment system not configured. Please contact us directly." },
        { status: 500 }
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // Determine the base URL and success/cancel paths based on source
    const isSeattleSite = source === "SEATTLE_DEFENSE_WEBSITE";
    const basePath = "/fight-my-ticket";
    const baseUrl = isSeattleSite
      ? (process.env.SEATTLE_BASE_URL || "https://defense.rivercrestlaw.com")
      : (process.env.NEXT_PUBLIC_BASE_URL || "https://piercedefense.com");

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Traffic Ticket Defense",
              description: `${citation.courtName} - ${citation.violationType || "Traffic Infraction"}`,
            },
            unit_amount: Math.round(price * 100), // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: contact.email,
      metadata: {
        source: source || "PIERCE_DEFENSE_WEBSITE",
        firstName: contact.firstName,
        lastName: contact.lastName,
        phone: contact.phone || "",
        courtName: citation.courtName,
        citationNumber: citation.citationNumber || "",
        citationDate: citation.citationDate || "",
        violationType: citation.violationType || "",
        hearingDate: citation.hearingDate || "",
      },
      success_url: `${baseUrl}${basePath}?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}${basePath}?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
