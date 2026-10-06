"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import {
  Heart,
  User,
  Building2,
  Shield,
  MapPin,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  LocateFixed,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [role, setRole] = useState<"donor" | "ngo" | "admin">("donor");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("Delhi NCR");
  const [latitude, setLatitude] = useState<number>(28.6139);
  const [longitude, setLongitude] = useState<number>(77.209);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(Math.round(pos.coords.latitude * 10000) / 10000);
          setLongitude(Math.round(pos.coords.longitude * 10000) / 10000);
          setLocation("Current Browser Location");
        },
        () => {
          setErrorMsg("Could not detect location automatically. Using coordinates.");
        }
      );
    }
  };

  const handlePresetLocation = (city: string, lat: number, lon: number) => {
    setLocation(city);
    setLatitude(lat);
    setLongitude(lon);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setErrorMsg("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          location,
          latitude,
          longitude,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      login(data.user);

      if (data.user.role === "donor") {
        router.push("/donor/dashboard");
      } else if (data.user.role === "ngo") {
        router.push("/ngo/dashboard");
      } else if (data.user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to register account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center text-white mx-auto shadow-md shadow-brand-600/30">
            <Heart className="w-6 h-6 fill-white/20 stroke-white stroke-[2.2]" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Create an Account
          </h2>
          <p className="text-xs text-gray-500">
            Join ShareSphere to donate or manage verified NGO requirements
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 text-red-700 text-xs flex items-center space-x-2 border border-red-100">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Select Your Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRole("donor")}
                className={`py-3 px-2 rounded-xl border text-center transition flex flex-col items-center space-y-1 ${
                  role === "donor"
                    ? "border-brand-500 bg-brand-50 text-brand-800 font-bold"
                    : "border-gray-200 bg-gray-50/50 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <User className="w-4 h-4" />
                <span className="text-xs">Donor</span>
              </button>

              <button
                type="button"
                onClick={() => setRole("ngo")}
                className={`py-3 px-2 rounded-xl border text-center transition flex flex-col items-center space-y-1 ${
                  role === "ngo"
                    ? "border-brand-500 bg-brand-50 text-brand-800 font-bold"
                    : "border-gray-200 bg-gray-50/50 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span className="text-xs">NGO Partner</span>
              </button>

              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`py-3 px-2 rounded-xl border text-center transition flex flex-col items-center space-y-1 ${
                  role === "admin"
                    ? "border-brand-500 bg-brand-50 text-brand-800 font-bold"
                    : "border-gray-200 bg-gray-50/50 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Shield className="w-4 h-4" />
                <span className="text-xs">Admin</span>
              </button>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              {role === "ngo" ? "Organization / NGO Name" : "Full Name"}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={role === "ngo" ? "e.g. Care Foundation India" : "e.g. Rajesh Sharma"}
              className="w-full px-4 py-2.5 text-sm bg-gray-50/70 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@organization.org"
              className="w-full px-4 py-2.5 text-sm bg-gray-50/70 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 text-sm bg-gray-50/70 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
            />
          </div>

          {/* Location & Coordinates for Haversine matching */}
          <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-brand-600" />
                <span>Geographic Location (Haversine Routing)</span>
              </span>
              <button
                type="button"
                onClick={handleDetectLocation}
                className="text-[11px] font-semibold text-brand-700 hover:text-brand-800 flex items-center space-x-1"
              >
                <LocateFixed className="w-3 h-3" />
                <span>Detect GPS</span>
              </button>
            </div>

            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Address / City"
              className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg"
            />

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[10px] text-gray-500 uppercase font-semibold">
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(e) => setLatitude(parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1 bg-white border border-gray-200 rounded text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 uppercase font-semibold">
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={(e) => setLongitude(parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1 bg-white border border-gray-200 rounded text-xs font-mono"
                />
              </div>
            </div>

            {/* Quick city presets */}
            <div className="flex items-center space-x-1 text-[10px] text-gray-500 pt-1">
              <span className="font-semibold">Quick Presets:</span>
              <button
                type="button"
                onClick={() => handlePresetLocation("Connaught Place, Delhi", 28.6315, 77.2167)}
                className="hover:text-brand-600 underline"
              >
                Central Delhi
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => handlePresetLocation("Lajpat Nagar, South Delhi", 28.57, 77.24)}
                className="hover:text-brand-600 underline"
              >
                South Delhi
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => handlePresetLocation("Noida Sector 18", 28.5708, 77.3271)}
                className="hover:text-brand-600 underline"
              >
                Noida
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-white font-semibold bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-600/20 hover:shadow-lg transition text-sm flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{loading ? "Creating Account..." : "Register on ShareSphere"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-gray-500">
          Already registered?{" "}
          <Link href="/login" className="font-semibold text-brand-600 hover:underline">
            Sign in to existing account
          </Link>
        </div>
      </div>
    </div>
  );
}

