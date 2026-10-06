import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Donation from "@/models/Donation";
import Requirement from "@/models/Requirement";
import ImpactRecord from "@/models/ImpactRecord";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectToDatabase();

    // 1. Total donations registered
    const totalDonations = await Donation.countDocuments();

    // 2. Total items donated (sum of donation quantities)
    const donatedItemsAgg = await Donation.aggregate([
      { $group: { _id: null, total: { $sum: "$quantity" } } },
    ]);
    const totalItemsDonated = donatedItemsAgg[0]?.total || 0;

    // 3. Delivered and distributed donations count
    const deliveredDonations = await Donation.countDocuments({
      status: { $in: ["DELIVERED", "DISTRIBUTED"] },
    });

    // 4. Total items distributed from ImpactRecords
    const impactAgg = await ImpactRecord.aggregate([
      {
        $group: {
          _id: null,
          totalDistributed: { $sum: "$itemsDistributed" },
          totalBeneficiaries: { $sum: "$beneficiaries" },
          verifiedCount: {
            $sum: { $cond: ["$verified", 1, 0] },
          },
        },
      },
    ]);

    const totalItemsDistributed = impactAgg[0]?.totalDistributed || 0;
    const totalBeneficiaries = impactAgg[0]?.totalBeneficiaries || 0;
    const verifiedImpacts = impactAgg[0]?.verifiedCount || 0;

    // 5. Total active NGOs & Donors
    const totalNgos = await User.countDocuments({ role: "ngo" });
    const totalDonors = await User.countDocuments({ role: "donor" });
    const openRequirements = await Requirement.countDocuments({ status: "OPEN" });

    return NextResponse.json({
      totalDonations,
      totalItemsDonated,
      totalItemsDistributed,
      totalBeneficiaries,
      deliveredDonations,
      verifiedImpacts,
      totalNgos,
      totalDonors,
      openRequirements,
    });
  } catch (error: any) {
    console.error("Fetch statistics error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to calculate platform statistics" },
      { status: 500 }
    );
  }
}

