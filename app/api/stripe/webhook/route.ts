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

        // Send retainer agreement email
        await sendRetainerEmail({
          email: session.customer_email!,
          firstName: firstName || "",
          lastName: lastName || "",
          courtName: courtName || "",
          citationNumber: citationNumber || "",
          violationType: violationType || "",
          amount: session.amount_total ? session.amount_total / 100 : 0,
          paymentId: session.id,
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

// Send retainer agreement email via Resend
async function sendRetainerEmail(data: {
  email: string;
  firstName: string;
  lastName: string;
  courtName: string;
  citationNumber: string;
  violationType: string;
  amount: number;
  paymentId: string;
}) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!RESEND_API_KEY) {
    console.log("RESEND_API_KEY not configured - skipping email");
    return;
  }

  const clientName = `${data.firstName} ${data.lastName}`;
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Pierce Defense Law <noreply@piercedefenselaw.com>",
        to: data.email,
        bcc: "support@rivercrestlaw.info",
        subject: `Retainer Agreement - ${data.courtName || "Traffic Infraction"} Defense`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Georgia, serif; line-height: 1.6; color: #333; max-width: 700px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; border-bottom: 2px solid #1e3a5f; padding-bottom: 20px; margin-bottom: 30px; }
    .header h1 { color: #1e3a5f; margin: 0; font-size: 24px; }
    .header p { color: #666; margin: 5px 0 0 0; }
    .section { margin-bottom: 25px; }
    .section-title { color: #1e3a5f; font-weight: bold; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 10px; }
    .case-info { background: #f5f5f5; padding: 15px; border-radius: 5px; }
    .case-info p { margin: 5px 0; }
    .terms { font-size: 14px; }
    .terms ol { padding-left: 20px; }
    .terms li { margin-bottom: 10px; }
    .signature { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #1e3a5f; font-size: 12px; color: #666; text-align: center; }
    .highlight { background: #e8f4e8; padding: 15px; border-left: 4px solid #2d6a2d; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="header">
    <h1>PIERCE DEFENSE LAW</h1>
    <p>Sebastian Miller, Attorney at Law | WSBA #50261</p>
  </div>

  <p><strong>Date:</strong> ${today}</p>
  <p><strong>To:</strong> ${clientName}</p>
  <p><strong>Re:</strong> Legal Representation Agreement</p>

  <div class="section">
    <div class="section-title">CASE INFORMATION</div>
    <div class="case-info">
      <p><strong>Client:</strong> ${clientName}</p>
      <p><strong>Court:</strong> ${data.courtName || "To Be Determined"}</p>
      ${data.citationNumber ? `<p><strong>Citation #:</strong> ${data.citationNumber}</p>` : ""}
      ${data.violationType ? `<p><strong>Charge:</strong> ${data.violationType}</p>` : ""}
      <p><strong>Fee Paid:</strong> $${data.amount.toFixed(2)}</p>
      <p><strong>Confirmation #:</strong> ${data.paymentId}</p>
    </div>
  </div>

  <div class="highlight">
    <strong>Thank you for retaining Pierce Defense Law.</strong> Your payment has been received and I am now your attorney of record for this matter. I will handle all court appearances and communications with the prosecutor on your behalf.
  </div>

  <div class="section terms">
    <div class="section-title">SCOPE OF REPRESENTATION</div>
    <ol>
      <li><strong>Services Included:</strong> Attorney will represent Client in the above-referenced traffic infraction matter, including case review, discovery requests, negotiations with the prosecutor, and all court appearances through final disposition.</li>
      <li><strong>Flat Fee:</strong> The fee paid covers all attorney services for this matter. No additional fees will be charged unless the case involves circumstances not disclosed at intake or requires appeal.</li>
      <li><strong>Court Costs:</strong> Client remains responsible for any court-imposed fines, fees, or penalties if the case does not result in dismissal.</li>
      <li><strong>Communication:</strong> Attorney will provide updates via email. Client agrees to respond promptly to requests for information.</li>
      <li><strong>No Guarantee:</strong> Attorney will provide competent representation but cannot guarantee any particular outcome.</li>
    </ol>
  </div>

  <div class="section">
    <div class="section-title">NEXT STEPS</div>
    <ol>
      <li>I will file a Notice of Appearance with the court within 2-3 business days</li>
      <li>I will request discovery (evidence) from the prosecutor</li>
      <li>You will receive an email when your hearing date is confirmed</li>
      <li>You do NOT need to appear in court - I will appear on your behalf</li>
    </ol>
  </div>

  <div class="signature">
    <p>By making payment, you acknowledge receipt of this agreement and consent to representation under these terms.</p>
    <p style="margin-top: 20px;">
      <strong>Sebastian Miller</strong><br>
      Pierce Defense Law<br>
      WSBA #50261<br>
      (253) 238-7444<br>
      support@rivercrestlaw.info
    </p>
  </div>

  <div class="footer">
    <p>Pierce Defense Law | Tacoma, WA</p>
    <p>This email serves as your receipt and retainer agreement. Please save it for your records.</p>
  </div>
</body>
</html>
        `,
      }),
    });
    console.log("Retainer email sent to:", data.email);
  } catch (error) {
    console.error("Email send error:", error);
  }
}
