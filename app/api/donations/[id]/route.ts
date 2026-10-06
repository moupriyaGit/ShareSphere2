import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Donation from "@/models/Donation";
import Allocation from "@/models/Allocation";
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

    const donation = await Donation.findOne(query)
      .populate("donorId", "name email location")
      .populate("assignedNgoId", "name email location");

    if (!donation) {
      return NextResponse.json({ error: "Donation not found" }, { status: 404 });
    }

    // Also fetch any allocations made for this donation
    const allocations = await Allocation.find({ donationId: donation.donationId });

    return NextResponse.json({ donation, allocations });
  } catch (error: any) {
    console.error("Fetch donation error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch donation" }, { status: 500 });
  }
}

