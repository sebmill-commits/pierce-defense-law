import { NextRequest, NextResponse } from "next/server";

// This will be used when Stripe is configured
// import Stripe from 'stripe';
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { price, citation, contact } = body;

    // Validate required fields
    if (!price || !contact?.email || !contact?.firstName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      // Return demo mode response
      return NextResponse.json({
        paymentId: `demo_${Date.now()}`,
        mode: "demo",
        message: "Stripe not configured. Running in demo mode.",
      });
    }

    // Production Stripe integration would go here:
    /*
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Traffic Ticket Defense',
              description: `${citation.courtName} - ${citation.violationType || 'Traffic Infraction'}`,
            },
            unit_amount: price * 100, // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: contact.email,
      metadata: {
        firstName: contact.firstName,
        lastName: contact.lastName,
        phone: contact.phone,
        courtName: citation.courtName,
        citationNumber: citation.citationNumber || '',
        violationType: citation.violationType || '',
        hearingDate: citation.hearingDate || '',
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/fight-my-ticket?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/fight-my-ticket?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
    */

    // For now, return demo response
    return NextResponse.json({
      paymentId: `demo_${Date.now()}`,
      mode: "demo",
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
