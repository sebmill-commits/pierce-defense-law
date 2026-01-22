import { NextRequest, NextResponse } from "next/server";

// Upload citation image to Google Drive via Apps Script
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageData, fileName, clientName, courtName, citationNumber } = body;

    // Validate required fields
    if (!imageData) {
      return NextResponse.json(
        { error: "No image data provided" },
        { status: 400 }
      );
    }

    const CITATION_UPLOAD_URL = process.env.CITATION_UPLOAD_WEBHOOK_URL;

    if (!CITATION_UPLOAD_URL) {
      console.error("CITATION_UPLOAD_WEBHOOK_URL not configured");
      return NextResponse.json(
        { error: "Citation upload not configured" },
        { status: 500 }
      );
    }

    // Send to Google Apps Script
    const response = await fetch(CITATION_UPLOAD_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageData, // base64 encoded image
        fileName: fileName || `citation_${Date.now()}.jpg`,
        clientName: clientName || "Unknown",
        courtName: courtName || "Unknown",
        citationNumber: citationNumber || "",
        source: "PIERCE_DEFENSE_WEBSITE",
        uploadedAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Apps Script upload failed:", errorText);
      return NextResponse.json(
        { error: "Failed to upload citation" },
        { status: 500 }
      );
    }

    const result = await response.json();
    console.log("Citation uploaded successfully:", result);

    return NextResponse.json({
      success: true,
      fileId: result.fileId,
      message: "Citation uploaded successfully",
    });
  } catch (error) {
    console.error("Citation upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload citation" },
      { status: 500 }
    );
  }
}
