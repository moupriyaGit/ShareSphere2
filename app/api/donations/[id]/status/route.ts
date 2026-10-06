import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Donation, { DONATION_STATUS_SEQUENCE, DonationStatus } from "@/models/Donation";
import User from "@/models/User";
import { getAuthenticatedUser } from "@/lib/auth";
import mongoose from "mongoose";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authUser = await getAuthenticatedUser(request);
    await connectToDatabase();
    const { id } = params;
    const body = await request.json();
    const { status: targetStatus, notes, assignedNgoId } = body;

    let query: any = { donationId: id };
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { $or: [{ _id: id }, { donationId: id }] };
    }

    const donation = await Donation.findOne(query);
    if (!donation) {
      return NextResponse.json({ error: "Donation not found" }, { status: 404 });
    }

    const currentStatus = donation.status as DonationStatus;
    const currentIndex = DONATION_STATUS_SEQUENCE.indexOf(currentStatus);
    const targetIndex = DONATION_STATUS_SEQUENCE.indexOf(targetStatus);

    if (targetIndex === -1) {
      return NextResponse.json(
        { error: `Invalid status: ${targetStatus}` },
        { status: 400 }
      );
    }

    // Strict state progression: only the immediate next state is permitted
    if (targetIndex !== currentIndex + 1) {
      return NextResponse.json(
        {
          error: `Invalid status transition: Cannot move directly from '${currentStatus}' to '${targetStatus}'. Next permissible state is '${DONATION_STATUS_SEQUENCE[currentIndex + 1]}'.`,
        },
        { status: 400 }
      );
    }

    // Update status and history
    donation.status = targetStatus;
    if (assignedNgoId && mongoose.Types.ObjectId.isValid(assignedNgoId)) {
      donation.assignedNgoId = new mongoose.Types.ObjectId(assignedNgoId);
    } else if (authUser?.role === "ngo" && !donation.assignedNgoId) {
      donation.assignedNgoId = new mongoose.Types.ObjectId(authUser.userId);
    }

    donation.statusHistory.push({
      status: targetStatus,
      timestamp: new Date(),
      updatedBy: authUser ? new mongoose.Types.ObjectId(authUser.userId) : undefined,
      notes: notes || `Status advanced to ${targetStatus}`,
    });

    await donation.save();

    // If donation status reached DELIVERED or DISTRIBUTED, reward NGO trust score
    if (targetStatus === "DISTRIBUTED" && donation.assignedNgoId) {
      await User.findByIdAndUpdate(donation.assignedNgoId, {
        $inc: { trustScore: 5 },
      });
      // Clamp trustScore to max 100
      await User.updateOne(
        { _id: donation.assignedNgoId, trustScore: { $gt: 100 } },
        { $set: { trustScore: 100 } }
      );
    }

    return NextResponse.json({
      message: `Status successfully updated to ${targetStatus}`,
      donation,
    });
  } catch (error: any) {
    console.error("Update donation status error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update donation status" },
      { status: 500 }
    );
  }
}

