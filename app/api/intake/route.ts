import { NextRequest, NextResponse } from "next/server";

// Intake submission endpoint
// Sends data to Rivercrest Case Management via Google Apps Script webhook

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { citation, contact, paymentId, price, source } = body;

    // Validate required fields
    if (!contact?.email || !contact?.firstName || !contact?.lastName) {
      return NextResponse.json(
        { error: "Missing required contact information" },
        { status: 400 }
      );
    }

    if (!citation?.courtName) {
      return NextResponse.json(
        { error: "Missing court information" },
        { status: 400 }
      );
    }

    // Determine source - Seattle Defense or Pierce Defense
    const intakeSource = source || "PIERCE_DEFENSE_WEBSITE";

    // Prepare data matching Rivercrest Dashboard columns
    const intakeData = {
      source: intakeSource,
      // Core client info
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phone: contact.phone || "",
      // Citation info
      courtName: citation.courtName,
      citationNumber: citation.citationNumber || "",
      citationDate: citation.citationDate || "",
      violations: citation.violationType || "",
      // Hearing info
      courtDate: citation.hearingDate || "",
      // Payment info
      paymentId: paymentId || "",
      amountPaid: price || "",
      // Metadata
      requestDate: new Date().toISOString(),
      caseStatus: "NEW_INTAKE",
    };

    console.log("New intake submission:", intakeData);

    // Send to Rivercrest Google Apps Script webhook
    const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_WEBHOOK_URL;

    if (GOOGLE_SCRIPT_URL) {
      try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(intakeData),
        });

        if (!response.ok) {
          console.error("Google Sheets submission failed:", response.status);
          // Don't fail the whole request - log and continue
        } else {
          console.log("Successfully submitted to Rivercrest");
        }
      } catch (webhookError) {
        console.error("Webhook error:", webhookError);
        // Don't fail the whole request - payment was successful
      }
    } else {
      console.log("GOOGLE_SCRIPT_WEBHOOK_URL not configured - skipping webhook");
    }

    return NextResponse.json({
      success: true,
      message: "Intake submitted successfully",
      caseId: `PDL-${Date.now()}`,
    });
  } catch (error) {
    console.error("Intake submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit intake" },
      { status: 500 }
    );
  }
}
