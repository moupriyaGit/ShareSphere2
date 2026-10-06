import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import Donation from "@/models/Donation";
import ImpactRecord from "@/models/ImpactRecord";
import { calculateNgoTrustScore } from "@/lib/trustScore";
import mongoose from "mongoose";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid NGO ID format" }, { status: 400 });
    }

    const ngoUser = await User.findById(id);
    if (!ngoUser || ngoUser.role !== "ngo") {
      return NextResponse.json({ error: "NGO partner not found" }, { status: 404 });
    }

    // Tally real platform verification records
    const completedDonationsCount = await Donation.countDocuments({
      assignedNgoId: ngoUser._id,
      status: "DISTRIBUTED",
    });

    const receivedDonationsCount = await Donation.countDocuments({
      assignedNgoId: ngoUser._id,
      status: { $in: ["DELIVERED", "COLLECTED", "DISTRIBUTED"] },
    });

    const verifiedImpactCount = await ImpactRecord.countDocuments({
      ngoId: ngoUser._id,
      verified: true,
    });

    const trustData = calculateNgoTrustScore(
      completedDonationsCount,
      verifiedImpactCount,
      receivedDonationsCount
    );

    // Keep user's trustScore in sync with dynamic verification
    if (ngoUser.trustScore !== trustData.computedTrustScore) {
      ngoUser.trustScore = trustData.computedTrustScore;
      await ngoUser.save();
    }

    return NextResponse.json({
      ngoId: ngoUser._id.toString(),
      ngoName: ngoUser.name,
      location: ngoUser.location,
      trustScore: trustData.computedTrustScore,
      factors: trustData,
    });
  } catch (error: any) {
    console.error("Fetch NGO trust score error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to calculate NGO trust score" },
      { status: 500 }
    );
  }
}

