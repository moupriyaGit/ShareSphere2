import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { hashPassword, generateToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { name, email, password, role, location, latitude, longitude } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const assignedRole = ["donor", "ngo", "admin"].includes(role) ? role : "donor";

    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: assignedRole,
      location: location || "Metropolitan Region",
      latitude: typeof latitude === "number" ? latitude : 28.6139,
      longitude: typeof longitude === "number" ? longitude : 77.209,
      trustScore: assignedRole === "ngo" ? 50 : 0,
    });

    const tokenPayload = {
      userId: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      location: newUser.location,
      latitude: newUser.latitude,
      longitude: newUser.longitude,
    };

    const token = generateToken(tokenPayload);

    const response = NextResponse.json(
      {
        message: "Registration successful",
        user: tokenPayload,
        token,
      },
      { status: 201 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to register user" },
      { status: 500 }
    );
  }
}

