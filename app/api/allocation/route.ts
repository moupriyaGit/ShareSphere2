import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Requirement from "@/models/Requirement";
import Donation from "@/models/Donation";
import Allocation from "@/models/Allocation";
import { calculateFinalMatchScore } from "@/lib/matching";
import { calculateMultiNgoAllocation, CandidateRequirement } from "@/lib/allocation";
import mongoose from "mongoose";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { donationId, confirm, selectedRequirementIds } = body;

    if (!donationId) {
      return NextResponse.json(
        { error: "donationId is required for multi-NGO allocation" },
        { status: 400 }
      );
    }

    let query: any = { donationId };
    if (mongoose.Types.ObjectId.isValid(donationId)) {
      query = { $or: [{ _id: donationId }, { donationId }] };
    }

    const donation = await Donation.findOne(query);
    if (!donation) {
      return NextResponse.json({ error: "Donation not found" }, { status: 404 });
    }

    const donationPoolQuantity = donation.remainingQuantity;
    if (donationPoolQuantity <= 0) {
      return NextResponse.json(
        { error: "This donation has already been fully allocated (0 remaining quantity)." },
        { status: 400 }
      );
    }

    // Query open requirements matching category / item or all open requirements
    const reqQuery: any = {
      status: "OPEN",
    };
    if (selectedRequirementIds && Array.isArray(selectedRequirementIds) && selectedRequirementIds.length > 0) {
      reqQuery.requirementId = { $in: selectedRequirementIds };
    }

    const requirements = await Requirement.find(reqQuery).populate(
      "ngoId",
      "name email location trustScore latitude longitude"
    );

    const candidates: CandidateRequirement[] = [];

    for (const req of requirements) {
      const ngoUser = req.ngoId as any;
      if (!ngoUser) continue;

      const breakdown = calculateFinalMatchScore(
        {
          itemName: donation.itemName,
          category: donation.category,
          quantity: donationPoolQuantity,
          latitude: donation.latitude,
          longitude: donation.longitude,
        },
        {
          requirementId: req.requirementId,
          itemName: req.itemName,
          category: req.category,
          quantityNeeded: req.quantityNeeded,
          quantityReceived: req.quantityReceived,
          urgency: req.urgency,
          latitude: req.latitude,
          longitude: req.longitude,
          location: req.location,
        },
        {
          name: ngoUser.name || req.ngoName,
          trustScore: ngoUser.trustScore ?? 50,
          latitude: ngoUser.latitude,
          longitude: ngoUser.longitude,
          location: ngoUser.location,
        }
      );

      candidates.push({
        requirementId: req.requirementId,
        requirementObjId: req._id.toString(),
        ngoId: ngoUser._id.toString(),
        ngoName: ngoUser.name || req.ngoName,
        itemName: req.itemName,
        category: req.category,
        quantityNeeded: req.quantityNeeded,
        quantityReceived: req.quantityReceived,
        urgency: req.urgency,
        distanceKm: breakdown.distanceKm,
        matchScore: breakdown.finalMatchScore,
      });
    }

    const plan = calculateMultiNgoAllocation(donationPoolQuantity, candidates);

    // If confirm is requested, persist allocations and update requirements & donation in MongoDB
    if (confirm) {
      const createdAllocations = [];

      for (const item of plan.allocations) {
        if (item.allocatedQuantity <= 0) continue;

        const alloc = await Allocation.create({
          donationId: donation.donationId,
          requirementId: item.requirementId,
          ngoId: new mongoose.Types.ObjectId(item.ngoId),
          ngoName: item.ngoName,
          allocatedQuantity: item.allocatedQuantity,
          matchScore: item.matchScore,
          allocationReason: item.allocationReason,
        });

        createdAllocations.push(alloc);

        // Update requirement received quantity
        const reqDoc = await Requirement.findOne({ requirementId: item.requirementId });
        if (reqDoc) {
          reqDoc.quantityReceived += item.allocatedQuantity;
          if (reqDoc.quantityReceived >= reqDoc.quantityNeeded) {
            reqDoc.status = "FULFILLED";
          }
          await reqDoc.save();
        }
      }

      // Update donation remaining quantity
      donation.remainingQuantity = plan.remainingQuantity;
      if (plan.allocations.length > 0) {
        // Set assigned NGO to the primary top-allocated NGO
        donation.assignedNgoId = new mongoose.Types.ObjectId(plan.allocations[0].ngoId);
        donation.statusHistory.push({
          status: donation.status,
          timestamp: new Date(),
          notes: `Allocated across ${plan.allocations.length} NGO(s): ${plan.summary}`,
        });
      }
      await donation.save();

      return NextResponse.json({
        success: true,
        committed: true,
        plan,
        createdAllocations,
        donation,
      });
    }

    // Return preview calculation
    return NextResponse.json({
      success: true,
      committed: false,
      plan,
      donation: {
        donationId: donation.donationId,
        itemName: donation.itemName,
        category: donation.category,
        quantity: donation.quantity,
        remainingQuantity: donation.remainingQuantity,
      },
    });
  } catch (error: any) {
    console.error("Allocation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to calculate allocation" },
      { status: 500 }
    );
  }
}

