import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Requirement from "@/models/Requirement";
import User from "@/models/User";
import { getAuthenticatedUser } from "@/lib/auth";

function generateRequirementId(): string {
  const randomPart = Math.floor(100000 + Math.random() * 900000);
  return `REQ-${randomPart}`;
}

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const ngoId = searchParams.get("ngoId");
    const category = searchParams.get("category");
    const urgency = searchParams.get("urgency");
    const status = searchParams.get("status") || "OPEN";

    const query: any = {};
    if (ngoId) query.ngoId = ngoId;
    if (category) query.category = category;
    if (urgency) query.urgency = urgency;
    if (status && status !== "ALL") query.status = status;

    const requirements = await Requirement.find(query)
      .sort({ createdAt: -1 })
      .populate("ngoId", "name email location trustScore latitude longitude");

    return NextResponse.json({ requirements });
  } catch (error: any) {
    console.error("Fetch requirements error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch requirements" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const authUser = await getAuthenticatedUser(request);
    await connectToDatabase();
    const body = await request.json();

    const { itemName, category, quantityNeeded, description, location, latitude, longitude, urgency } = body;

    if (!itemName || !category || !quantityNeeded) {
      return NextResponse.json(
        { error: "Item name, category, and quantity needed are required" },
        { status: 400 }
      );
    }

    const ngoId = authUser?.userId || body.ngoId;
    if (!ngoId) {
      return NextResponse.json(
        { error: "NGO identity is required. Please log in as an NGO." },
        { status: 401 }
      );
    }

    const ngoUser = await User.findById(ngoId);
    const ngoName = ngoUser?.name || body.ngoName || "Partner NGO";

    const requirementId = generateRequirementId();
    const parsedQty = parseInt(quantityNeeded, 10);

    const requirement = await Requirement.create({
      requirementId,
      ngoId,
      ngoName,
      itemName: itemName.trim(),
      category: category.trim(),
      quantityNeeded: parsedQty,
      quantityReceived: 0,
      description: description?.trim() || "",
      location: location?.trim() || ngoUser?.location || "Delhi NCR",
      latitude: typeof latitude === "number" ? latitude : ngoUser?.latitude || 28.6139,
      longitude: typeof longitude === "number" ? longitude : ngoUser?.longitude || 77.209,
      urgency: ["LOW", "MEDIUM", "HIGH", "CRITICAL"].includes(urgency) ? urgency : "MEDIUM",
      status: "OPEN",
    });

    return NextResponse.json({ message: "Requirement registered", requirement }, { status: 201 });
  } catch (error: any) {
    console.error("Create requirement error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create requirement" },
      { status: 500 }
    );
  }
}

