"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Heart,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  QrCode,
  Sparkles,
  PieChart,
  Sliders,
  Award,
  Layers,
  ChevronRight,
  Building,
  Users,
  Package,
} from "lucide-react";

interface PlatformStats {
  totalDonations: number;
  totalItemsDonated: number;
  totalItemsDistributed: number;
  totalBeneficiaries: number;
  deliveredDonations: number;
  verifiedImpacts: number;
  totalNgos: number;
  totalDonors: number;
  openRequirements: number;
}

export default function LandingPage() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
      })
      .catch((err) => console.error("Stats load error:", err))
      .finally(() => setLoadingStats(false));
  }, []);

  return (
    <div className="space-y-20 pb-20">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 bg-gradient-to-b from-brand-50/50 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-100/80 border border-brand-200 text-brand-800 text-xs sm:text-sm font-medium shadow-xs">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
            <span>Algorithmic Donation Logistics — Zero AI / Zero Black Box Models</span>
          </div>

          {/* Tagline */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1]">
              Give what you can. <br />
              <span className="text-brand-600">Reach who needs it.</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto font-normal leading-relaxed">
              Donors often want to donate useful items but don't know which NGOs currently need them.
              ShareSphere connects donations with verified requirements and distributes them with
              mathematical precision.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/donate"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-white font-semibold bg-brand-600 hover:bg-brand-700 shadow-lg shadow-brand-600/25 hover:shadow-xl hover:shadow-brand-600/35 transition-all text-base flex items-center justify-center space-x-2"
            >
              <span>Donate Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/explore"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-gray-800 font-semibold bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 shadow-sm transition-all text-base flex items-center justify-center space-x-2"
            >
              <span>Explore Needs</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </Link>
          </div>

          {/* Trust Guarantees */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-gray-500 font-medium">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-brand-600" />
              <span>Transparent 5-Factor Scoring</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-brand-600" />
              <span>Haversine Geographic Routing</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-brand-600" />
              <span>Cryptographic QR Lifecycle</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-brand-600" />
              <span>Verifiable Impact Auditing</span>
            </div>
          </div>
        </div>
      </section>

      {/* HOW SHARESPHERE WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold text-brand-700 uppercase tracking-widest bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            Lifecycle Workflow
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            How ShareSphere Works
          </h2>
          <p className="text-sm sm:text-base text-gray-500 max-w-xl mx-auto">
            From your doorstep to verified community impact through a transparent 5-stage algorithm.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-3 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 font-bold flex items-center justify-center text-sm border border-brand-200">
              01
            </div>
            <h3 className="text-base font-bold text-gray-900">1. Donate</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              List available items, quantities, and pickup coordinates in seconds.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-3 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 font-bold flex items-center justify-center text-sm border border-brand-200">
              02
            </div>
            <h3 className="text-base font-bold text-gray-900">2. Smart Match</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Weighted algorithm matches requirements across category, urgency, distance, and trust.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-3 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 font-bold flex items-center justify-center text-sm border border-brand-200">
              03
            </div>
            <h3 className="text-base font-bold text-gray-900">3. Smart Allocation</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Large batches are mathematically distributed across multiple NGOs without waste.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-3 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 font-bold flex items-center justify-center text-sm border border-brand-200">
              04
            </div>
            <h3 className="text-base font-bold text-gray-900">4. QR Track</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Unique QR code tracks custody transitions strictly step-by-step to recipient shelter.
            </p>
          </div>

          {/* Step 5 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-3 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 font-bold flex items-center justify-center text-sm border border-brand-200">
              05
            </div>
            <h3 className="text-base font-bold text-gray-900">5. Proof of Impact</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              NGOs report distributed items and verified beneficiaries with photographic audit proof.
            </p>
          </div>
        </div>
      </section>

      {/* THE FIVE CORE INNOVATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-brand-700 uppercase tracking-widest bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            Engineering & Algorithmic Excellence
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            The Five Core Innovations
          </h2>
          <p className="text-sm sm:text-base text-gray-500 max-w-xl mx-auto">
            Honest, transparent algorithmic systems designed for real social impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Innovation 1 */}
          <div className="bg-white rounded-3xl border border-gray-200/80 p-7 shadow-xs hover:border-brand-300 transition space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center">
              <Sliders className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider">
                Innovation #1
              </span>
              <h3 className="text-lg font-bold text-gray-900">
                Weighted Smart Matching
              </h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Calculates match scores strictly via a verified mathematical formula:
              <br />
              <code className="text-[11px] font-mono bg-gray-50 p-1 rounded text-brand-900 block mt-1.5 border border-gray-100">
                0.30×Cat + 0.25×Urg + 0.20×Dist + 0.15×Qty + 0.10×Trust
              </code>
            </p>
            <div className="pt-2 text-xs text-gray-500 font-medium">
              Every score breakdown is 100% explainable with deterministic reasons.
            </div>
          </div>

          {/* Innovation 2 */}
          <div className="bg-white rounded-3xl border border-gray-200/80 p-7 shadow-xs hover:border-brand-300 transition space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center">
              <PieChart className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider">
                Innovation #2
              </span>
              <h3 className="text-lg font-bold text-gray-900">
                Multi-NGO Smart Allocation
              </h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              When a donor contributes a large batch (e.g., 100 blankets), the allocation engine distributes
              across multiple NGOs prioritized by critical urgency, match score, and remaining capacity.
            </p>
            <div className="pt-2 text-xs text-gray-500 font-medium">
              Zero excess allocation. Every item fulfills a vetted community requirement.
            </div>
          </div>

          {/* Innovation 3 */}
          <div className="bg-white rounded-3xl border border-gray-200/80 p-7 shadow-xs hover:border-brand-300 transition space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider">
                Innovation #3
              </span>
              <h3 className="text-lg font-bold text-gray-900">
                Haversine Location Routing
              </h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Implements the spherical Haversine formula on Earth's geographic coordinates to calculate
              kilometer distance without external API dependencies or mapping bloat.
            </p>
            <div className="pt-2 text-xs text-gray-500 font-medium">
              Custom distance radius thresholds: 5 km, 10 km, 25 km, 50 km.
            </div>
          </div>

          {/* Innovation 4 */}
          <div className="bg-white rounded-3xl border border-gray-200/80 p-7 shadow-xs hover:border-brand-300 transition space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center">
              <QrCode className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider">
                Innovation #4
              </span>
              <h3 className="text-lg font-bold text-gray-900">
                QR Custody Tracking
              </h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Every donation receives a tamper-resistant QR code pointing to safe tracking URLs.
              Strict state machine enforces order: Donated → Accepted → Scheduled → Collected → Delivered → Distributed.
            </p>
            <div className="pt-2 text-xs text-gray-500 font-medium">
              Illegal status skipping (e.g. Donated directly to Distributed) is programmatically rejected.
            </div>
          </div>

          {/* Innovation 5 */}
          <div className="bg-white rounded-3xl border border-gray-200/80 p-7 shadow-xs hover:border-brand-300 transition space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider">
                Innovation #5
              </span>
              <h3 className="text-lg font-bold text-gray-900">
                Verified Proof of Impact
              </h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Closing the loop: recipient NGOs log exact items distributed, beneficiaries aided,
              and photo verification reports. Donors see tangible lives transformed.
            </p>
            <div className="pt-2 text-xs text-gray-500 font-medium">
              Verified reports automatically increase the NGO's verifiable platform trust score.
            </div>
          </div>

          {/* Bonus Innovation: Trust Score */}
          <div className="bg-gradient-to-br from-brand-900 to-gray-900 text-white rounded-3xl p-7 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 text-brand-300 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-brand-400 uppercase tracking-wider">
                Rule-Based Transparency
              </span>
              <h3 className="text-lg font-bold text-white">
                Verifiable NGO Trust Score
              </h3>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              Base score = 50. Grows dynamically from completed deliveries (+5), verified impact proofs (+10),
              and received consignments (+5), bounded between 0 and 100.
            </p>
            <div className="pt-2 text-xs text-brand-300 font-medium">
              Display format: "NGO Trust Score: 87/100" (Strictly rule-based).
            </div>
          </div>
        </div>
      </section>

      {/* LIVE IMPACT STATISTICS FROM MONGODB */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-gray-200/80 p-8 sm:p-12 shadow-sm space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-100 pb-6">
            <div>
              <span className="text-xs font-bold text-brand-700 uppercase tracking-wider bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
                Real-Time Audited Metrics
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
                Live Community Impact
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Zero synthetic data. All figures aggregated live directly from active MongoDB collections.
              </p>
            </div>
            <Link
              href="/impact"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center space-x-1"
            >
              <span>View Verified Stories & Reports</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loadingStats ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-100 rounded-2xl" />
              ))}
            </div>
          ) : stats ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  Total Donations
                </span>
                <p className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
                  {stats.totalDonations}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-brand-50/60 border border-brand-100">
                <span className="text-[11px] font-semibold text-brand-700 uppercase tracking-wider">
                  Items Donated
                </span>
                <p className="text-2xl sm:text-3xl font-black text-brand-600 mt-1">
                  {stats.totalItemsDonated}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">
                  Items Distributed
                </span>
                <p className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1">
                  {stats.totalItemsDistributed}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
                <span className="text-[11px] font-semibold text-blue-800 uppercase tracking-wider">
                  Beneficiaries
                </span>
                <p className="text-2xl sm:text-3xl font-black text-blue-700 mt-1">
                  {stats.totalBeneficiaries}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100">
                <span className="text-[11px] font-semibold text-purple-800 uppercase tracking-wider">
                  Delivered Batches
                </span>
                <p className="text-2xl sm:text-3xl font-black text-purple-700 mt-1">
                  {stats.deliveredDonations}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
                <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">
                  Verified Impacts
                </span>
                <p className="text-2xl sm:text-3xl font-black text-amber-700 mt-1">
                  {stats.verifiedImpacts}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500 text-sm">
              Unable to load statistics. Please initialize the database with seed data.
            </div>
          )}
        </div>
      </section>

      {/* TECH MELA DEMONSTRATION CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-900 via-gray-900 to-gray-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span>Tech Mela Demonstration Ready</span>
            </div>
            <h3 className="text-2xl font-bold text-white">
              Ready to witness algorithmic donation distribution?
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Simulate the complete lifecycle: 3 NGOs requiring 40, 30, and 50 blankets, a 100-blanket donation,
              transparent mathematical matching, multi-NGO smart allocation, and verified proof of impact.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link
              href="/donate"
              className="px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm text-center shadow-md transition"
            >
              Test Donation Matching
            </Link>
            <Link
              href="/explore"
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm text-center border border-white/20 transition"
            >
              Explore Live Requirements
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

