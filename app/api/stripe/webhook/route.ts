import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

// Per-site branding for client-facing email. The from-address domain must be
// verified in Resend regardless of which site the intake came from.
const BRANDS = {
  SEATTLE_DEFENSE_WEBSITE: {
    name: "Rivercrest Law",
    email: "sebastian@rivercrestlaw.com",
    phone: "(206) 414-1964",
    baseUrl: process.env.SEATTLE_BASE_URL || "https://defense.rivercrestlaw.com",
  },
  PIERCE_DEFENSE_WEBSITE: {
    name: "Pierce Defense Law",
    email: "sebastian@piercedefense.com",
    phone: "(253) 238-7444",
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "https://piercedefense.com",
  },
} as const;

function brandForSource(source?: string) {
  return source === "SEATTLE_DEFENSE_WEBSITE"
    ? BRANDS.SEATTLE_DEFENSE_WEBSITE
    : BRANDS.PIERCE_DEFENSE_WEBSITE;
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
          source,
          firstName,
          lastName,
          phone,
          courtName,
          citationNumber,
          citationDate,
          violationType,
          hearingDate,
        } = session.metadata || {};

        const email =
          session.customer_email || session.customer_details?.email || null;

        // Send data to Rivercrest via Google Apps Script webhook.
        // Returns the assigned PDL case number when the sheet accepts the row.
        const caseNumber = await submitToRivercrest({
          source,
          paymentId: session.id,
          email,
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

        // Send welcome email with receipt details + representation agreement
        if (email) {
          await sendRetainerEmail({
            source,
            email,
            firstName: firstName || "",
            lastName: lastName || "",
            courtName: courtName || "",
            citationNumber: citationNumber || "",
            violationType: violationType || "",
            caseNumber,
            amount: session.amount_total ? session.amount_total / 100 : 0,
            paymentId: session.id,
          });
        } else {
          console.error("No client email on session", session.id);
        }

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

// Send intake data to Rivercrest Case Management.
// Returns the PDL- case number assigned by the sheet, or null.
async function submitToRivercrest(data: {
  source?: string;
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
}): Promise<string | null> {
  const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_WEBHOOK_URL;

  if (!GOOGLE_SCRIPT_URL) {
    console.log("GOOGLE_SCRIPT_WEBHOOK_URL not configured - skipping");
    return null;
  }

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: process.env.WEBHOOK_SHARED_SECRET || "",
        // Seattle signups were being tagged as Pierce; pass the real source
        source: data.source || "PIERCE_DEFENSE_WEBSITE",
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
      return null;
    }

    const result = await response.json().catch(() => null);
    console.log("Successfully submitted to Rivercrest:", result?.clientId);
    return result?.clientId || null;
  } catch (error) {
    console.error("Rivercrest webhook error:", error);
    return null;
  }
}

// Send welcome/receipt email with representation agreement via Resend
async function sendRetainerEmail(data: {
  source?: string;
  email: string;
  firstName: string;
  lastName: string;
  courtName: string;
  citationNumber: string;
  violationType: string;
  caseNumber: string | null;
  amount: number;
  paymentId: string;
}) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!RESEND_API_KEY) {
    console.error(
      "RESEND_API_KEY not configured - client welcome email NOT sent for",
      data.paymentId
    );
    return;
  }

  const brand = brandForSource(data.source);
  const fromAddress = process.env.RESEND_FROM || "noreply@piercedefense.com";
  const clientName = `${data.firstName} ${data.lastName}`.trim();
  // The reference the client should put in email subject lines: prefer the
  // case number assigned by the case management system, else the citation #.
  const caseRef = data.caseNumber || data.citationNumber || "";
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/Los_Angeles",
  });

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${brand.name} <${fromAddress}>`,
        to: data.email,
        cc: "sebastian@piercedefense.com",
        bcc: "support@rivercrestlaw.info",
        reply_to: brand.email,
        subject: `Payment received — your traffic infraction case${caseRef ? ` (${caseRef})` : ""}`,
        attachments: [
          {
            path: `${brand.baseUrl}/documents/representation-agreement.pdf`,
            filename: "Representation_Agreement.pdf",
          },
        ],
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
    .action { background: #fff8e1; padding: 15px; border-left: 4px solid #b8860b; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="header">
    <h1>${brand.name.toUpperCase()}</h1>
    <p>Rivercrest Law PLLC | Sebastian Miller, Attorney at Law | WSBA #50261</p>
  </div>

  <p><strong>Date:</strong> ${today}</p>
  <p><strong>To:</strong> ${clientName}</p>
  <p><strong>Re:</strong> Payment Receipt &amp; Legal Representation</p>

  <div class="section">
    <div class="section-title">RECEIPT &amp; CASE INFORMATION</div>
    <div class="case-info">
      <p><strong>Client:</strong> ${clientName}</p>
      ${caseRef ? `<p><strong>Your Case Number:</strong> ${caseRef}</p>` : ""}
      <p><strong>Court:</strong> ${data.courtName || "To Be Determined"}</p>
      ${data.citationNumber ? `<p><strong>Citation #:</strong> ${data.citationNumber}</p>` : ""}
      ${data.violationType ? `<p><strong>Alleged Violation:</strong> ${data.violationType}</p>` : ""}
      <p><strong>Fee Paid:</strong> $${data.amount.toFixed(2)}</p>
      <p><strong>Payment Confirmation #:</strong> ${data.paymentId}</p>
    </div>
  </div>

  <div class="highlight">
    <strong>Thank you for retaining ${brand.name}.</strong> Your payment has been received. This email is your receipt. The attached Representation Agreement sets out the terms of the engagement — please save both for your records.
  </div>

  <div class="section terms">
    <div class="section-title">SCOPE &amp; KEY TERMS (summary — see attached agreement)</div>
    <ol>
      <li><strong>Traffic Infractions Only:</strong> This representation covers your civil traffic infraction matter only. It does not include criminal matters of any kind, including criminal traffic offenses (such as DUI, reckless driving, or driving while license suspended). If your citation involves a criminal charge, contact us before relying on this engagement.</li>
      <li><strong>Tickets Submitted Past the Response Deadline:</strong> If your ticket was submitted to us after the court's response deadline had already passed, the firm will either (a) decline the case and refund your payment, or (b) offer to proceed for an additional fee to address the late response. We will contact you before any additional fee is charged.</li>
      <li><strong>Services Included:</strong> Case review, discovery requests, negotiations with the prosecutor, and court appearances through final disposition of the infraction.</li>
      <li><strong>Flat Fee:</strong> The fee paid covers attorney services for this matter. Court-imposed fines, fees, or penalties remain your responsibility if the case is not dismissed.</li>
      <li><strong>No Guarantee:</strong> The firm will provide competent representation but cannot guarantee any particular outcome.</li>
    </ol>
  </div>

  <div class="action">
    <strong>If you receive new insurance or vehicle registration information</strong> (for example, proof of insurance for an insurance-related citation, or updated registration), email it to <a href="mailto:${brand.email}">${brand.email}</a> and put <strong>your case number${caseRef ? ` (${caseRef})` : ""}</strong> in the subject line. This helps us match your documents to your case immediately.
  </div>

  <div class="section">
    <div class="section-title">NEXT STEPS</div>
    <ol>
      <li>I will file a Notice of Appearance with the court</li>
      <li>I will request discovery (evidence) from the prosecutor</li>
      <li>You will receive an email when your hearing date is confirmed</li>
      <li>You do NOT need to appear in court — I will appear on your behalf</li>
    </ol>
  </div>

  <div class="signature">
    <p>By making payment, you acknowledge receipt of this agreement and consent to representation under these terms.</p>
    <p style="margin-top: 20px;">
      <strong>Sebastian Miller</strong><br>
      ${brand.name} (Rivercrest Law PLLC)<br>
      WSBA #50261<br>
      ${brand.phone}<br>
      ${brand.email}
    </p>
  </div>

  <div class="footer">
    <p>${brand.name} | Washington State</p>
    <p>This email serves as your receipt. The attached Representation Agreement governs the engagement. Please save both for your records.</p>
  </div>
</body>
</html>
        `,
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error(
        "Resend send failed:",
        response.status,
        errBody,
        "payment:",
        data.paymentId
      );
      return;
    }

    console.log("Welcome email sent to:", data.email, "cc: sebastian@piercedefense.com");
  } catch (error) {
    console.error("Email send error:", error);
  }
}
