import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
      console.log("Stripe webhook received but not configured");
      return NextResponse.json({ received: true, mode: "demo" });
    }

    let event: Stripe.Event;
    const stripe = getStripe();

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature!,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: "Webhook signature verification failed" },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;

        // Extract metadata
        const {
          firstName,
          lastName,
          phone,
          courtName,
          citationNumber,
          citationDate,
          violationType,
          hearingDate,
        } = session.metadata || {};

        // Send data to Rivercrest via Google Apps Script webhook
        await submitToRivercrest({
          paymentId: session.id,
          email: session.customer_email,
          firstName,
          lastName,
          phone,
          courtName,
          citationNumber,
          citationDate,
          violationType,
          hearingDate,
          amount: session.amount_total ? session.amount_total / 100 : 0,
          paidAt: new Date().toISOString(),
        });

        // Send welcome email
        await sendWelcomeEmail({
          email: session.customer_email!,
          firstName: firstName!,
        });

        break;

      case "payment_intent.payment_failed":
        const failedPayment = event.data.object;
        console.error("Payment failed:", failedPayment.id);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

// Send intake data to Rivercrest Case Management
async function submitToRivercrest(data: {
  paymentId: string;
  email: string | null;
  firstName?: string;
  lastName?: string;
  phone?: string;
  courtName?: string;
  citationNumber?: string;
  citationDate?: string;
  violationType?: string;
  hearingDate?: string;
  amount: number;
  paidAt: string;
}) {
  const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_WEBHOOK_URL;

  if (!GOOGLE_SCRIPT_URL) {
    console.log("GOOGLE_SCRIPT_WEBHOOK_URL not configured - skipping");
    return;
  }

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "PIERCE_DEFENSE_WEBSITE",
        // Core client info
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        email: data.email || "",
        phone: data.phone || "",
        // Citation info
        courtName: data.courtName || "",
        citationNumber: data.citationNumber || "",
        citationDate: data.citationDate || "",
        violations: data.violationType || "",
        // Hearing info
        courtDate: data.hearingDate || "",
        // Payment info
        paymentId: data.paymentId,
        amountPaid: data.amount,
        paidAt: data.paidAt,
        // Metadata
        requestDate: new Date().toISOString(),
        caseStatus: "PAID",
      }),
    });

    if (!response.ok) {
      console.error("Rivercrest submission failed:", response.status);
    } else {
      console.log("Successfully submitted to Rivercrest");
    }
  } catch (error) {
    console.error("Rivercrest webhook error:", error);
  }
}

// Send welcome email via Resend
async function sendWelcomeEmail(data: { email: string; firstName: string }) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!RESEND_API_KEY) {
    console.log("RESEND_API_KEY not configured - skipping email");
    return;
  }

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Pierce Defense Law <noreply@piercecountydefense.com>",
        to: data.email,
        subject: "Welcome to Pierce Defense Law",
        html: `
          <h1>Thank you, ${data.firstName}!</h1>
          <p>Your payment has been received. I'll review your case and send you a retainer agreement shortly.</p>
          <p>If you have any questions, call me at (253) 238-7444.</p>
          <p>Best regards,<br>Sebastian Miller<br>Pierce Defense Law</p>
        `,
      }),
    });
    console.log("Welcome email sent to:", data.email);
  } catch (error) {
    console.error("Email send error:", error);
  }
}
