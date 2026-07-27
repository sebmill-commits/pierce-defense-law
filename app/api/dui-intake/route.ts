import { NextRequest, NextResponse } from "next/server";
import { submitToRivercrest } from "@/lib/rivercrest";

// DUI Intake submission endpoint
// Sends data to Rivercrest DUI spreadsheet via Google Apps Script webhook

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { arrest, contact, source } = body;

    // Validate required fields
    if (!contact?.email || !contact?.firstName || !contact?.lastName) {
      return NextResponse.json(
        { error: "Missing required contact information" },
        { status: 400 }
      );
    }

    if (!contact?.phone) {
      return NextResponse.json(
        { error: "Phone number required for DUI consultations" },
        { status: 400 }
      );
    }

    // Determine source - Seattle Defense or Pierce Defense
    const intakeSource = source || "PIERCE_DEFENSE_DUI";

    // Prepare data for Rivercrest DUI spreadsheet
    const intakeData = {
      source: intakeSource,
      // Contact info
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phone: contact.phone,
      // Arrest info
      arrestDate: arrest?.arrestDate || "",
      arrestLocation: arrest?.arrestLocation || "",
      // DUI specifics
      bacLevel: arrest?.bacLevel || "",
      refusal: arrest?.refusal || "Unknown",
      priorDuis: arrest?.priorDuis || "0",
      // License
      licenseStatus: arrest?.licenseStatus || "Unknown",
      // Court
      courtName: arrest?.courtName || "",
      // Notes
      notes: arrest?.notes || "",
      // No payment for free consultation
      paymentId: "",
      amountPaid: 0,
    };

    console.log("New DUI intake submission:", intakeData);

    // A DUI consultation request that doesn't reach the Dashboard is a lost
    // client - fail loudly rather than confirming a request we didn't record.
    const { clientId } = await submitToRivercrest(intakeData);

    return NextResponse.json({
      success: true,
      message: "DUI consultation request submitted",
      caseId: clientId || `DUI-${Date.now()}`,
    });
  } catch (error) {
    console.error("DUI intake submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit DUI intake" },
      { status: 500 }
    );
  }
}
