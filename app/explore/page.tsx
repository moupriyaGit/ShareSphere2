"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import { calculateDistance } from "@/lib/distance";
import {
  Search,
  Filter,
  MapPin,
  Building,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Package,
  Layers,
  Sparkles,
} from "lucide-react";

interface RequirementItem {
  _id: string;
  requirementId: string;
  itemName: string;
  category: string;
  quantityNeeded: number;
  quantityReceived: number;
  urgency: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  location: string;
  latitude: number;
  longitude: number;
  description: string;
  ngoName: string;
  ngoId?: {
    _id: string;
    name: string;
    trustScore: number;
    latitude: number;
    longitude: number;
    location: string;
  };
}

const CATEGORIES = [
  "All Categories",
  "Clothes & Blankets",
  "Food & Ration",
  "Education & Books",
  "Medical & Hygiene",
  "Shelter & Furniture",
  "Other",
];

const URGENCIES = ["All Urgencies", "CRITICAL", "HIGH", "MEDIUM", "LOW"];
const DISTANCE_OPTIONS = [
  { label: "Any Distance", val: 9999 },
  { label: "Within 5 km", val: 5 },
  { label: "Within 10 km", val: 10 },
  { label: "Within 25 km", val: 25 },
  { label: "Within 50 km", val: 50 },
];

export default function ExplorePage() {
  const { user } = useAuth();
  const [requirements, setRequirements] = useState<RequirementItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedUrgency, setSelectedUrgency] = useState("All Urgencies");
  const [selectedDistance, setSelectedDistance] = useState(9999);
  const [searchQuery, setSearchQuery] = useState("");

  const donorLat = user?.latitude || 28.6315;
  const donorLon = user?.longitude || 77.2167;

  useEffect(() => {
    fetch("/api/requirements?status=OPEN")
      .then((res) => res.json())
      .then((data) => {
        setRequirements(data.requirements || []);
      })
      .catch((err) => console.error("Error fetching requirements:", err))
      .finally(() => setLoading(false));
  }, []);

  // Filter items
  const filteredRequirements = requirements.filter((item) => {
    // 1. Category
    if (selectedCategory !== "All Categories" && item.category !== selectedCategory) {
      return false;
    }

    // 2. Urgency
    if (selectedUrgency !== "All Urgencies" && item.urgency !== selectedUrgency) {
      return false;
    }

    // 3. Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.itemName.toLowerCase().includes(q);
      const matchNgo = item.ngoName.toLowerCase().includes(q);
      const matchLoc = item.location.toLowerCase().includes(q);
      if (!matchName && !matchNgo && !matchLoc) return false;
    }

    // 4. Distance filter using Haversine
    const itemLat = item.latitude || item.ngoId?.latitude;
    const itemLon = item.longitude || item.ngoId?.longitude;
    const distanceKm = calculateDistance(donorLat, donorLon, itemLat, itemLon);

    if (distanceKm > selectedDistance) {
      return false;
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-brand-700 uppercase tracking-wider bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
          Transparent Need Registry
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Explore NGO Requirements
        </h1>
        <p className="text-sm text-gray-500 max-w-2xl">
          Browse verified requirements from grassroots organizations. Filter by urgency, category,
          and Haversine distance from your location ({user?.location || "Delhi NCR"}).
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Query */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search items, NGOs, or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Urgency Filter */}
          <div>
            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              {URGENCIES.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>

          {/* Distance Filter */}
          <div>
            <select
              value={selectedDistance}
              onChange={(e) => setSelectedDistance(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              {DISTANCE_OPTIONS.map((opt) => (
                <option key={opt.val} value={opt.val}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
          <span>
            Showing <strong className="text-gray-900">{filteredRequirements.length}</strong> verified
            active requirements
          </span>
          <span className="flex items-center space-x-1">
            <MapPin className="w-3.5 h-3.5 text-brand-600" />
            <span>Calculating proximity from: {user?.location || "Delhi NCR (28.63°N, 77.21°E)"}</span>
          </span>
        </div>
      </div>

      {/* Requirements Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-56 bg-gray-100 rounded-2xl" />
          ))}
        </div>
      ) : filteredRequirements.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-4">
          <Package className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-lg font-bold text-gray-900">No Requirements Found</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            No active NGO requirements match your current search and distance filters. Try adjusting
            your filters or seed demo data.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("All Categories");
              setSelectedUrgency("All Urgencies");
              setSelectedDistance(9999);
              setSearchQuery("");
            }}
            className="text-xs font-semibold text-brand-600 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequirements.map((req) => {
            const ngoLat = req.latitude || req.ngoId?.latitude;
            const ngoLon = req.longitude || req.ngoId?.longitude;
            const distanceKm = calculateDistance(donorLat, donorLon, ngoLat, ngoLon);
            const trustScore = req.ngoId?.trustScore ?? 85;

            return (
              <div
                key={req._id}
                className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs hover:border-brand-300 hover:shadow-md transition space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        req.urgency === "CRITICAL"
                          ? "bg-red-100 text-red-800 border border-red-200"
                          : req.urgency === "HIGH"
                          ? "bg-orange-100 text-orange-800 border border-orange-200"
                          : req.urgency === "MEDIUM"
                          ? "bg-blue-100 text-blue-800 border border-blue-200"
                          : "bg-gray-100 text-gray-700 border border-gray-200"
                      }`}
                    >
                      {req.urgency}
                    </span>

                    <span className="text-xs font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-lg border border-brand-200 flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
                      <span>Trust: {trustScore}/100</span>
                    </span>
                  </div>

                  {/* Title & Category */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-brand-600">
                      {req.itemName}
                    </h3>
                    <div className="flex items-center space-x-2 text-xs text-gray-500 mt-0.5">
                      <span className="font-medium text-brand-700 bg-brand-50/80 px-2 py-0.5 rounded">
                        {req.category}
                      </span>
                      <span>•</span>
                      <span className="font-semibold text-gray-800">
                        {req.quantityNeeded - req.quantityReceived} needed
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  {req.description && (
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {req.description}
                    </p>
                  )}

                  {/* NGO & Distance Info */}
                  <div className="pt-2 border-t border-gray-100 space-y-1.5 text-xs text-gray-600">
                    <div className="flex items-center space-x-1.5 font-medium text-gray-900">
                      <Building className="w-3.5 h-3.5 text-brand-600" />
                      <span>{req.ngoName}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-gray-500">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="truncate max-w-[150px]">{req.location}</span>
                      </span>
                      <span className="font-semibold text-brand-800 bg-brand-50 px-1.5 py-0.5 rounded">
                        {distanceKm.toFixed(1)} km away
                      </span>
                    </div>
                  </div>
                </div>

                {/* Donate CTA */}
                <div className="pt-3">
                  <Link
                    href={`/donate?category=${encodeURIComponent(
                      req.category
                    )}&itemName=${encodeURIComponent(req.itemName)}&quantity=${encodeURIComponent(
                      req.quantityNeeded - req.quantityReceived
                    )}`}
                    className="w-full py-2.5 px-3 rounded-xl bg-gray-50 hover:bg-brand-600 text-gray-700 hover:text-white border border-gray-200 hover:border-brand-600 font-semibold text-xs transition flex items-center justify-center space-x-1.5 shadow-xs"
                  >
                    <span>Donate to this Need</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

