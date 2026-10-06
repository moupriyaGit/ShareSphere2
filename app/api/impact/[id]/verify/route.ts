import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import ImpactRecord from "@/models/ImpactRecord";
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

    let query: any = {};
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { _id: id };
    } else {
      query = { donationId: id };
    }

    const record = await ImpactRecord.findOne(query);
    if (!record) {
      return NextResponse.json({ error: "Impact record not found" }, { status: 404 });
    }

    record.verified = true;
    record.verifiedAt = new Date();
    if (authUser) {
      record.verifiedBy = new mongoose.Types.ObjectId(authUser.userId);
    }
    await record.save();

    // Reward NGO trust score
    await User.findByIdAndUpdate(record.ngoId, { $inc: { trustScore: 10 } });
    await User.updateOne({ _id: record.ngoId, trustScore: { $gt: 100 } }, { $set: { trustScore: 100 } });

    return NextResponse.json({ message: "Impact record verified", record });
  } catch (error: any) {
    console.error("Verify impact record error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to verify impact record" },
      { status: 500 }
    );
  }
}

