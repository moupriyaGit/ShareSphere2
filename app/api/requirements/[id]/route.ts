import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Requirement from "@/models/Requirement";
import mongoose from "mongoose";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const { id } = params;

    let query: any = { requirementId: id };
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { $or: [{ _id: id }, { requirementId: id }] };
    }

    const requirement = await Requirement.findOne(query).populate(
      "ngoId",
      "name email location trustScore"
    );

    if (!requirement) {
      return NextResponse.json({ error: "Requirement not found" }, { status: 404 });
    }

    return NextResponse.json({ requirement });
  } catch (error: any) {
    console.error("Fetch requirement error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch requirement" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const { id } = params;

    let query: any = { requirementId: id };
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { $or: [{ _id: id }, { requirementId: id }] };
    }

    const requirement = await Requirement.findOneAndDelete(query);
    if (!requirement) {
      return NextResponse.json({ error: "Requirement not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Requirement deleted successfully" });
  } catch (error: any) {
    console.error("Delete requirement error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete requirement" }, { status: 500 });
  }
}

