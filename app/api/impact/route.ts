import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import ImpactRecord from "@/models/ImpactRecord";
import Donation from "@/models/Donation";
import User from "@/models/User";
import { getAuthenticatedUser } from "@/lib/auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const donationId = searchParams.get("donationId");
    const ngoId = searchParams.get("ngoId");
    const donorId = searchParams.get("donorId");
    const verified = searchParams.get("verified");

    const query: any = {};
    if (donationId) query.donationId = donationId;
    if (ngoId) query.ngoId = ngoId;
    if (donorId) query.donorId = donorId;
    if (verified !== null && verified !== undefined && verified !== "") {
      query.verified = verified === "true";
    }

    const impactRecords = await ImpactRecord.find(query)
      .sort({ createdAt: -1 })
      .populate("ngoId", "name email location trustScore")
      .populate("donorId", "name email");

    return NextResponse.json({ impactRecords });
  } catch (error: any) {
    console.error("Fetch impact records error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch impact records" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const authUser = await getAuthenticatedUser(request);
    await connectToDatabase();
    const body = await request.json();

    const {
      donationId,
      itemsReceived,
      itemsDistributed,
      beneficiaries,
      description,
      proofImageUrl,
    } = body;

    if (!donationId || !itemsReceived || !beneficiaries || !description) {
      return NextResponse.json(
        { error: "donationId, itemsReceived, beneficiaries, and description are required" },
        { status: 400 }
      );
    }

    const donation = await Donation.findOne({ donationId });
    if (!donation) {
      return NextResponse.json({ error: "Donation not found" }, { status: 404 });
    }

    const ngoId = authUser?.userId || body.ngoId;
    if (!ngoId) {
      return NextResponse.json(
        { error: "NGO identity is required. Please log in as an NGO." },
        { status: 401 }
      );
    }

    const ngoUser = await User.findById(ngoId);
    const ngoName = ngoUser?.name || "Verified NGO Partner";

    const record = await ImpactRecord.create({
      donationId,
      ngoId: new mongoose.Types.ObjectId(ngoId),
      ngoName,
      donorId: donation.donorId,
      itemsReceived: parseInt(itemsReceived, 10),
      itemsDistributed: itemsDistributed ? parseInt(itemsDistributed, 10) : parseInt(itemsReceived, 10),
      beneficiaries: parseInt(beneficiaries, 10),
      description: description.trim(),
      proofImageUrl: proofImageUrl?.trim() || "",
      verified: true, // Default to verified or verifiable
      verifiedAt: new Date(),
    });

    // Reward NGO trust score for providing verified impact record
    await User.findByIdAndUpdate(ngoId, {
      $inc: { trustScore: 10 },
    });
    await User.updateOne({ _id: ngoId, trustScore: { $gt: 100 } }, { $set: { trustScore: 100 } });

    return NextResponse.json({ message: "Impact record submitted successfully", record }, { status: 201 });
  } catch (error: any) {
    console.error("Create impact record error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit impact record" },
      { status: 500 }
    );
  }
}

