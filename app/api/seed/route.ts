import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import Requirement from "@/models/Requirement";
import Donation from "@/models/Donation";
import Allocation from "@/models/Allocation";
import ImpactRecord from "@/models/ImpactRecord";
import { hashPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const reset = searchParams.get("reset") === "true";

    if (reset) {
      await User.deleteMany({});
      await Requirement.deleteMany({});
      await Donation.deleteMany({});
      await Allocation.deleteMany({});
      await ImpactRecord.deleteMany({});
    }

    const defaultPassword = await hashPassword("password123");

    // 1. Create Demo Admin
    const adminUser = await User.findOneAndUpdate(
      { email: "admin@sharesphere.org" },
      {
        name: "ShareSphere System Admin",
        email: "admin@sharesphere.org",
        password: defaultPassword,
        role: "admin",
        location: "Central Hub, New Delhi",
        latitude: 28.6139,
        longitude: 77.209,
        trustScore: 100,
      },
      { upsert: true, new: true }
    );

    // 2. Create Demo Donor (e.g. at Connaught Place, New Delhi)
    const donorUser = await User.findOneAndUpdate(
      { email: "donor@sharesphere.org" },
      {
        name: "Rajesh Sharma",
        email: "donor@sharesphere.org",
        password: defaultPassword,
        role: "donor",
        location: "Connaught Place, New Delhi",
        latitude: 28.6315,
        longitude: 77.2167,
        trustScore: 0,
      },
      { upsert: true, new: true }
    );

    // 3. Create Demo NGO A (Hope Foundation, ~7.2 km away in Lajpat Nagar)
    const ngoA = await User.findOneAndUpdate(
      { email: "hope@ngo.org" },
      {
        name: "Hope Shelter Foundation",
        email: "hope@ngo.org",
        password: defaultPassword,
        role: "ngo",
        location: "Lajpat Nagar, South Delhi",
        latitude: 28.5700,
        longitude: 77.2400,
        trustScore: 90,
      },
      { upsert: true, new: true }
    );

    // 4. Create Demo NGO B (Care India Relief, ~12.5 km away in Rohini)
    const ngoB = await User.findOneAndUpdate(
      { email: "care@ngo.org" },
      {
        name: "Care India Relief",
        email: "care@ngo.org",
        password: defaultPassword,
        role: "ngo",
        location: "Rohini Sector 7, North West Delhi",
        latitude: 28.7150,
        longitude: 77.1190,
        trustScore: 85,
      },
      { upsert: true, new: true }
    );

    // 5. Create Demo NGO C (Seva Social Trust, ~18.2 km away in Noida Sector 18)
    const ngoC = await User.findOneAndUpdate(
      { email: "seva@ngo.org" },
      {
        name: "Seva Community Trust",
        email: "seva@ngo.org",
        password: defaultPassword,
        role: "ngo",
        location: "Sector 18, Noida",
        latitude: 28.5708,
        longitude: 77.3271,
        trustScore: 80,
      },
      { upsert: true, new: true }
    );

    // Clean existing requirements for these demo NGOs if re-seeding
    await Requirement.deleteMany({
      ngoId: { $in: [ngoA._id, ngoB._id, ngoC._id] },
    });

    // Tech Mela Demo Requirements:
    // NGO A: 40 Blankets — CRITICAL
    const reqA = await Requirement.create({
      requirementId: "REQ-401102",
      ngoId: ngoA._id,
      ngoName: ngoA.name,
      itemName: "Winter Blankets",
      category: "Clothes & Blankets",
      quantityNeeded: 40,
      quantityReceived: 0,
      description: "Severe cold wave relief for homeless night shelters in South Delhi.",
      location: ngoA.location,
      latitude: ngoA.latitude,
      longitude: ngoA.longitude,
      urgency: "CRITICAL",
      status: "OPEN",
    });

    // NGO B: 30 Blankets — HIGH
    const reqB = await Requirement.create({
      requirementId: "REQ-302204",
      ngoId: ngoB._id,
      ngoName: ngoB.name,
      itemName: "Warm Blankets",
      category: "Clothes & Blankets",
      quantityNeeded: 30,
      quantityReceived: 0,
      description: "Warm bedding needed for destitute elderly residents in Rohini care home.",
      location: ngoB.location,
      latitude: ngoB.latitude,
      longitude: ngoB.longitude,
      urgency: "HIGH",
      status: "OPEN",
    });

    // NGO C: 50 Blankets — MEDIUM
    const reqC = await Requirement.create({
      requirementId: "REQ-503306",
      ngoId: ngoC._id,
      ngoName: ngoC.name,
      itemName: "Thermal Fleece Blankets",
      category: "Clothes & Blankets",
      quantityNeeded: 50,
      quantityReceived: 0,
      description: "Winter preparedness drive for migrant worker settlement clusters.",
      location: ngoC.location,
      latitude: ngoC.latitude,
      longitude: ngoC.longitude,
      urgency: "MEDIUM",
      status: "OPEN",
    });

    // Also add food and education requirements for realistic explore needs browsing
    await Requirement.create([
      {
        requirementId: "REQ-109921",
        ngoId: ngoA._id,
        ngoName: ngoA.name,
        itemName: "Rice & Wheat Grain Packs",
        category: "Food & Ration",
        quantityNeeded: 60,
        quantityReceived: 0,
        description: "Dry ration grocery bags for daily-wage families affected by local construction bans.",
        location: ngoA.location,
        latitude: ngoA.latitude,
        longitude: ngoA.longitude,
        urgency: "HIGH",
        status: "OPEN",
      },
      {
        requirementId: "REQ-208843",
        ngoId: ngoB._id,
        ngoName: ngoB.name,
        itemName: "Notebooks & School Kits",
        category: "Education & Books",
        quantityNeeded: 100,
        quantityReceived: 0,
        description: "Stationery and notebooks for slum learning center students entering new term.",
        location: ngoB.location,
        latitude: ngoB.latitude,
        longitude: ngoB.longitude,
        urgency: "MEDIUM",
        status: "OPEN",
      },
    ]);

    return NextResponse.json({
      message: "Seed data initialized successfully for Tech Mela Demonstration",
      accounts: {
        donor: { email: "donor@sharesphere.org", password: "password123" },
        ngoA: { name: ngoA.name, email: "hope@ngo.org", password: "password123" },
        ngoB: { name: ngoB.name, email: "care@ngo.org", password: "password123" },
        ngoC: { name: ngoC.name, email: "seva@ngo.org", password: "password123" },
        admin: { email: "admin@sharesphere.org", password: "password123" },
      },
      requirements: [
        { ngo: ngoA.name, item: reqA.itemName, qty: reqA.quantityNeeded, urgency: reqA.urgency },
        { ngo: ngoB.name, item: reqB.itemName, qty: reqB.quantityNeeded, urgency: reqB.urgency },
        { ngo: ngoC.name, item: reqC.itemName, qty: reqC.quantityNeeded, urgency: reqC.urgency },
      ],
    });
  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to initialize seed data" },
      { status: 500 }
    );
  }
}

