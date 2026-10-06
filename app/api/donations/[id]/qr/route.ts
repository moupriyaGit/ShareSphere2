import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { connectToDatabase } from "@/lib/mongodb";
import Donation from "@/models/Donation";
import mongoose from "mongoose";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const { id } = params;

    let query: any = { donationId: id };
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { $or: [{ _id: id }, { donationId: id }] };
    }

    const donation = await Donation.findOne(query);
    if (!donation) {
      return NextResponse.json({ error: "Donation not found" }, { status: 404 });
    }

    const host = request.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const trackingUrl = `${protocol}://${host}/track/${donation.donationId}`;

    // Generate safe QR code containing strictly the tracking URL
    const qrDataUrl = await QRCode.toDataURL(trackingUrl, {
      errorCorrectionLevel: "M",
      margin: 2,
      width: 320,
      color: {
        dark: "#14532d", // Brand forest green
        light: "#ffffff",
      },
    });

    return NextResponse.json({
      donationId: donation.donationId,
      trackingUrl,
      qrDataUrl,
    });
  } catch (error: any) {
    console.error("QR Code generation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate QR code" },
      { status: 500 }
    );
  }
}

