import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "sharesphere_super_secret_jwt_key_2026_algorithmic_platform";

export interface AuthUserPayload {
  userId: string;
  name: string;
  email: string;
  role: "donor" | "ngo" | "admin";
  location?: string;
  latitude?: number;
  longitude?: number;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(payload: AuthUserPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): AuthUserPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthUserPayload;
  } catch {
    return null;
  }
}

/**
 * Extracts and verifies the authenticated user from cookies or Authorization header.
 */
export async function getAuthenticatedUser(request?: NextRequest | Request): Promise<AuthUserPayload | null> {
  let token: string | undefined;

  // 1. Check cookies
  try {
    const cookieStore = cookies();
    token = cookieStore.get("token")?.value;
  } catch {
    // cookies() might not be available in standard Request
  }

  // 2. Check Authorization Header if cookie not found
  if (!token && request) {
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
  }

  if (!token) return null;

  return verifyToken(token);
}

