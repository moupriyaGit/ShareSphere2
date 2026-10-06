"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import MatchScoreBadge from "@/components/MatchScoreBadge";
import MultiNgoAllocationModal from "@/components/MultiNgoAllocationModal";
import { SmartMatchResult } from "@/lib/matching";
import {
  Heart,
  Package,
  Layers,
  MapPin,
  LocateFixed,
  Sliders,
  Sparkles,
  ArrowRight,
  AlertCircle,
  PieChart,
  CheckCircle2,
  QrCode,
  ShieldCheck,
} from "lucide-react";

const CATEGORIES = [
  "Clothes & Blankets",
  "Food & Ration",
  "Education & Books",
  "Medical & Hygiene",
  "Shelter & Furniture",
  "Other",
];

function DonateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [itemName, setItemName] = useState(searchParams.get("itemName") || "Winter Blankets");
  const [category, setCategory] = useState(searchParams.get("category") || "Clothes & Blankets");
  const [quantity, setQuantity] = useState(searchParams.get("quantity") || "100");
  const [description, setDescription] = useState(
    "High-grade thermal winter blankets suitable for night shelters and cold relief drives."
  );
  const [location, setLocation] = useState(user?.location || "Connaught Place, New Delhi");
  const [latitude, setLatitude] = useState(user?.latitude || 28.6315);
  const [longitude, setLongitude] = useState(user?.longitude || 77.2167);
  const [maxDistanceKm, setMaxDistanceKm] = useState("50");

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [createdDonation, setCreatedDonation] = useState<any | null>(null);

  // Matching results state
  const [matchingLoading, setMatchingLoading] = useState(false);
  const [matches, setMatches] = useState<SmartMatchResult[]>([]);
  const [allocationModalOpen, setAllocationModalOpen] = useState(false);

  // Auto-fill Tech Mela Demo preset
  const handleTechMelaPreset = () => {
    setItemName("Warm Winter Blankets");
    setCategory("Clothes & Blankets");
    setQuantity("100");
    setDescription(
      "100 high quality fleece blankets for distribution across North India winter relief camps."
    );
    setLocation("Connaught Place, New Delhi");
    setLatitude(28.6315);
    setLongitude(77.2167);
  };

  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(Math.round(pos.coords.latitude * 10000) / 10000);
          setLongitude(Math.round(pos.coords.longitude * 10000) / 10000);
          setLocation("Current Browser Location");
        },
        () => {
          setErrorMsg("Could not detect GPS location automatically.");
        }
      );
    }
  };

  const handleSubmitDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName || !category || !quantity) {
      setErrorMsg("Please fill in item name, category, and quantity");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg("");

      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemName,
          category,
          quantity: parseInt(quantity, 10),
          description,
          location,
          latitude: parseFloat(latitude.toString()),
          longitude: parseFloat(longitude.toString()),
          donorId: user?.userId,
          donorName: user?.name,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to register donation");
      }

      setCreatedDonation(data.donation);
      fetchMatches(data.donation.donationId);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create donation");
    } finally {
      setSubmitting(false);
    }
  };

  const fetchMatches = async (donationId: string) => {
    try {
      setMatchingLoading(true);
      const res = await fetch("/api/matching", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donationId,
          maxDistanceKm: parseFloat(maxDistanceKm) || 50,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMatches(data.matches || []);
      }
    } catch (err) {
      console.error("Match error:", err);
    } finally {
      setMatchingLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Title */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold border border-brand-200">
          <Heart className="w-3.5 h-3.5 text-brand-600" />
          <span>Algorithmic Donation Registration</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Create a New Donation
        </h1>
        <p className="text-sm text-gray-500 max-w-2xl">
          List your items. Our transparent 5-factor weighted algorithm will instantly evaluate NGO
          requirements within your radius, or distribute batches across multiple organizations.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 text-red-700 text-xs flex items-center space-x-2 border border-red-100">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* FORM SECTION */}
      {!createdDonation ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h2 className="text-lg font-bold text-gray-900">Donation Details</h2>
            {/* Tech Mela 1-Click Preset */}
            <button
              type="button"
              onClick={handleTechMelaPreset}
              className="text-xs font-semibold px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg border border-amber-200 flex items-center space-x-1.5 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Fill 100 Blankets (Tech Mela Scenario)</span>
            </button>
          </div>

          <form onSubmit={handleSubmitDonation} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Item Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Item Name
                </label>
                <input
                  type="text"
                  required
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="e.g. Winter Blankets, Ration Kits"
                  className="w-full px-4 py-2.5 text-sm bg-gray-50/70 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-gray-50/70 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Quantity */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Quantity Available
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="100"
                  className="w-full px-4 py-2.5 text-sm bg-gray-50/70 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
                />
              </div>

              {/* Max Distance Radius Filter */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Maximum Match Radius
                </label>
                <select
                  value={maxDistanceKm}
                  onChange={(e) => setMaxDistanceKm(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-gray-50/70 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
                >
                  <option value="5">Within 5 km</option>
                  <option value="10">Within 10 km</option>
                  <option value="25">Within 25 km</option>
                  <option value="50">Within 50 km</option>
                  <option value="100">Within 100 km</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Item Description & Condition
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe condition, packaging, or special handling..."
                className="w-full px-4 py-2.5 text-sm bg-gray-50/70 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
              />
            </div>

            {/* Pickup Location & Coordinates */}
            <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-800 flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-600" />
                  <span>Pickup Location (For Haversine Proximity)</span>
                </span>
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  className="text-[11px] font-semibold text-brand-700 hover:text-brand-800 flex items-center space-x-1"
                >
                  <LocateFixed className="w-3 h-3" />
                  <span>Detect My Location</span>
                </button>
              </div>

              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Pickup address, neighborhood or landmark"
                className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl"
              />

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-gray-500 font-semibold uppercase">Latitude</span>
                  <input
                    type="number"
                    step="any"
                    value={latitude}
                    onChange={(e) => setLatitude(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded-lg font-mono text-xs"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 font-semibold uppercase">Longitude</span>
                  <input
                    type="number"
                    step="any"
                    value={longitude}
                    onChange={(e) => setLongitude(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded-lg font-mono text-xs"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-6 rounded-xl text-white font-semibold bg-brand-600 hover:bg-brand-700 shadow-lg shadow-brand-600/25 hover:shadow-xl transition text-sm flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{submitting ? "Saving to Database..." : "Register Donation & Find Smart Matches"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        /* AFTER SUBMISSION: DISPLAY DONATION CONFIRMATION & MATCH RESULTS */
        <div className="space-y-8">
          {/* Confirmed Donation Summary Banner */}
          <div className="bg-brand-50 border border-brand-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-brand-600 text-white text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Saved to MongoDB: {createdDonation.donationId}</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {createdDonation.quantity} × {createdDonation.itemName}
              </h2>
              <p className="text-xs text-gray-600">
                Category: <strong>{createdDonation.category}</strong> • Pickup:{" "}
                <strong>{createdDonation.location}</strong>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setAllocationModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md flex items-center space-x-1.5 transition"
              >
                <PieChart className="w-4 h-4" />
                <span>Run Smart Multi-NGO Allocation</span>
              </button>

              <Link
                href={`/track/${createdDonation.donationId}`}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 font-semibold text-xs shadow-xs flex items-center space-x-1.5 transition"
              >
                <QrCode className="w-4 h-4 text-brand-600" />
                <span>View QR Code & Tracking</span>
              </Link>
            </div>
          </div>

          {/* MATCH RESULTS SECTION */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-3">
              <div>
                <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                  <span>Smart Matches Ranked by Algorithm</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-100 text-brand-800">
                    {matches.length} Matches Found
                  </span>
                </h3>
                <p className="text-xs text-gray-500">
                  Formula: 0.30×Category + 0.25×Urgency + 0.20×Distance + 0.15×Quantity + 0.10×Trust
                </p>
              </div>

              <button
                onClick={() => fetchMatches(createdDonation.donationId)}
                className="text-xs font-medium text-brand-600 hover:underline"
              >
                Recalculate
              </button>
            </div>

            {matchingLoading ? (
              <div className="py-12 text-center space-y-3 bg-white rounded-3xl border border-gray-200 p-8">
                <div className="w-10 h-10 border-3 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm font-semibold text-gray-700">
                  Finding the best matches...
                </p>
                <p className="text-xs text-gray-500">
                  Executing multi-criteria weighted scoring across registered NGO requirements
                </p>
              </div>
            ) : matches.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-3">
                <Package className="w-10 h-10 text-gray-300 mx-auto" />
                <h4 className="text-base font-bold text-gray-900">No Direct Matches in Radius</h4>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  No active requirements found within {maxDistanceKm} km. You can expand the radius or
                  seed demo data to test the matching algorithm.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matches.map((match, idx) => (
                  <div key={match.requirement.requirementId} className="flex flex-col justify-between">
                    <MatchScoreBadge
                      score={match.matchScore}
                      breakdown={match.breakdown}
                      ngoName={match.ngo.name}
                      rank={idx + 1}
                    />

                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => setAllocationModalOpen(true)}
                        className="w-full py-2.5 px-3 rounded-xl bg-brand-50 hover:bg-brand-600 text-brand-700 hover:text-white border border-brand-200 hover:border-brand-600 font-semibold text-xs transition flex items-center justify-center space-x-1.5 shadow-xs"
                      >
                        <span>Select for Smart Allocation</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Multi-NGO Allocation Modal */}
      {createdDonation && (
        <MultiNgoAllocationModal
          donationId={createdDonation.donationId}
          itemName={createdDonation.itemName}
          totalQuantity={createdDonation.quantity}
          isOpen={allocationModalOpen}
          onClose={() => setAllocationModalOpen(false)}
          onSuccess={() => {
            router.push(`/track/${createdDonation.donationId}`);
          }}
        />
      )}
    </div>
  );
}

export default function DonatePage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-sm text-gray-500">Loading donation module...</div>
      }
    >
      <DonateContent />
    </Suspense>
  );
}

