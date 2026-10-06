import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Donation from "@/models/Donation";
import { getAuthenticatedUser } from "@/lib/auth";

function generateDonationId(): string {
  const randomPart = Math.floor(100000 + Math.random() * 900000);
  return `DON-${randomPart}`;
}

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const donorId = searchParams.get("donorId");
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const assignedNgoId = searchParams.get("assignedNgoId");

    const query: any = {};
    if (donorId) query.donorId = donorId;
    if (status) query.status = status;
    if (category) query.category = category;
    if (assignedNgoId) query.assignedNgoId = assignedNgoId;

    const donations = await Donation.find(query)
      .sort({ createdAt: -1 })
      .populate("donorId", "name email location");

    return NextResponse.json({ donations });
  } catch (error: any) {
    console.error("Fetch donations error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch donations" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authUser = await getAuthenticatedUser(request);
    await connectToDatabase();
    const body = await request.json();

    const { itemName, category, quantity, description, location, latitude, longitude } = body;

    if (!itemName || !category || !quantity) {
      return NextResponse.json(
        { error: "Item name, category, and quantity are required" },
        { status: 400 }
      );
    }

    const donorId = authUser?.userId || body.donorId;
    if (!donorId) {
      return NextResponse.json(
        { error: "Donor identity is required. Please log in." },
        { status: 401 }
      );
    }

    const donationId = generateDonationId();
    const parsedQty = parseInt(quantity, 10);

    const donation = await Donation.create({
      donationId,
      donorId,
      donorName: authUser?.name || body.donorName || "Anonymous Donor",
      itemName: itemName.trim(),
      category: category.trim(),
      quantity: parsedQty,
      remainingQuantity: parsedQty,
      description: description?.trim() || "",
      location: location?.trim() || authUser?.location || "Delhi NCR",
      latitude: typeof latitude === "number" ? latitude : authUser?.latitude || 28.6139,
      longitude: typeof longitude === "number" ? longitude : authUser?.longitude || 77.209,
      status: "DONATED",
      statusHistory: [
        {
          status: "DONATED",
          timestamp: new Date(),
          notes: "Donation registered on ShareSphere platform",
        },
      ],
    });

    return NextResponse.json({ message: "Donation registered", donation }, { status: 201 });
  } catch (error: any) {
    console.error("Create donation error:", error);
    return NextResponse.json({ error: error.message || "Failed to create donation" }, { status: 500 });
  }
}

