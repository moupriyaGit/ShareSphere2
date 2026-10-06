import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Requirement from "@/models/Requirement";
import Donation from "@/models/Donation";
import User from "@/models/User";
import { calculateFinalMatchScore, SmartMatchResult } from "@/lib/matching";
import mongoose from "mongoose";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    let donationData: {
      itemName: string;
      category: string;
      quantity: number;
      latitude?: number;
      longitude?: number;
    };

    let maxDistanceKm = body.maxDistanceKm ? parseFloat(body.maxDistanceKm) : null;

    if (body.donationId) {
      let query: any = { donationId: body.donationId };
      if (mongoose.Types.ObjectId.isValid(body.donationId)) {
        query = { $or: [{ _id: body.donationId }, { donationId: body.donationId }] };
      }
      const existingDonation = await Donation.findOne(query);
      if (!existingDonation) {
        return NextResponse.json({ error: "Donation not found" }, { status: 404 });
      }
      donationData = {
        itemName: existingDonation.itemName,
        category: existingDonation.category,
        quantity: existingDonation.remainingQuantity || existingDonation.quantity,
        latitude: existingDonation.latitude,
        longitude: existingDonation.longitude,
      };
    } else {
      if (!body.itemName || !body.category || !body.quantity) {
        return NextResponse.json(
          { error: "Item name, category, and quantity are required for matching" },
          { status: 400 }
        );
      }
      donationData = {
        itemName: body.itemName,
        category: body.category,
        quantity: parseInt(body.quantity, 10),
        latitude: body.latitude !== undefined ? parseFloat(body.latitude) : 28.6139,
        longitude: body.longitude !== undefined ? parseFloat(body.longitude) : 77.209,
      };
    }

    // Retrieve open requirements
    const openRequirements = await Requirement.find({
      status: "OPEN",
    }).populate("ngoId", "name email location trustScore latitude longitude");

    const results: SmartMatchResult[] = [];

    for (const req of openRequirements) {
      const ngoUser = req.ngoId as any;
      if (!ngoUser) continue;

      const ngoData = {
        _id: ngoUser._id ? ngoUser._id.toString() : "",
        name: ngoUser.name || req.ngoName,
        trustScore: ngoUser.trustScore ?? 50,
        latitude: req.latitude ?? ngoUser.latitude,
        longitude: req.longitude ?? ngoUser.longitude,
        location: req.location || ngoUser.location,
      };

      const reqData = {
        _id: req._id.toString(),
        requirementId: req.requirementId,
        itemName: req.itemName,
        category: req.category,
        quantityNeeded: req.quantityNeeded,
        quantityReceived: req.quantityReceived,
        urgency: req.urgency,
        latitude: req.latitude,
        longitude: req.longitude,
        location: req.location,
      };

      const breakdown = calculateFinalMatchScore(donationData, reqData, ngoData);

      // Filter by max distance if requested
      if (maxDistanceKm && breakdown.distanceKm > maxDistanceKm) {
        continue;
      }

      results.push({
        requirement: reqData,
        ngo: ngoData,
        breakdown,
        matchScore: breakdown.finalMatchScore,
      });
    }

    // Rank strictly by final calculated match score descending
    results.sort((a, b) => b.matchScore - a.matchScore);

    return NextResponse.json({
      success: true,
      donation: donationData,
      totalMatches: results.length,
      matches: results,
      formulaExplanation: {
        weights: "30% Category + 25% Urgency + 20% Distance + 15% Quantity + 10% Trust",
        description: "Transparent mathematical weighted multi-criteria decision algorithm.",
      },
    });
  } catch (error: any) {
    console.error("Matching error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to calculate matches" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const donationId = searchParams.get("donationId");
    const itemName = searchParams.get("itemName") || "";
    const category = searchParams.get("category") || "";
    const quantity = searchParams.get("quantity") || "1";
    const maxDistanceKm = searchParams.get("maxDistanceKm");

    const payload: any = {};
    if (donationId) payload.donationId = donationId;
    else {
      payload.itemName = itemName;
      payload.category = category;
      payload.quantity = quantity;
    }
    if (maxDistanceKm) payload.maxDistanceKm = maxDistanceKm;

    const fakeReq = new Request("http://localhost/api/matching", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return POST(fakeReq);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

