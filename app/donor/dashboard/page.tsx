"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import {
  Heart,
  Package,
  CheckCircle2,
  Clock,
  Users,
  QrCode,
  ArrowRight,
  PlusCircle,
  ExternalLink,
  ShieldCheck,
  Building,
  Image as ImageIcon,
} from "lucide-react";

export default function DonorDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [donations, setDonations] = useState<any[]>([]);
  const [impactRecords, setImpactRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"donations" | "qr" | "impact">("donations");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch donor's donations
      const donRes = await fetch(`/api/donations?donorId=${user?.userId}`);
      const donData = await donRes.json();
      setDonations(donData.donations || []);

      // Fetch donor's impacts
      const impRes = await fetch(`/api/impact?donorId=${user?.userId}`);
      const impData = await impRes.json();
      setImpactRecords(impData.impactRecords || []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.userId) {
      fetchData();
    }
  }, [user?.userId]);

  // Calculations
  const totalDonations = donations.length;
  const activeDonations = donations.filter((d) => d.status !== "DISTRIBUTED").length;
  const deliveredDonations = donations.filter(
    (d) => d.status === "DELIVERED" || d.status === "DISTRIBUTED"
  ).length;

  const totalBeneficiaries = impactRecords.reduce(
    (acc, curr) => acc + (curr.beneficiaries || 0),
    0
  );

  const totalItemsDonated = donations.reduce((acc, curr) => acc + (curr.quantity || 0), 0);

  // Group unique NGOs involved in impact
  const uniqueNgoCount = new Set(impactRecords.map((r) => r.ngoId?._id || r.ngoName)).size;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-brand-700 uppercase tracking-wider bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            Donor Operations Hub
          </span>
          <h1 className="text-3xl font-extrabold text-gray-900 mt-1">
            Welcome back, {user?.name || "Donor"}
          </h1>
          <p className="text-xs text-gray-500">
            Track your pledges, monitor custody lifecycles, and view verified community outcomes
          </p>
        </div>

        <Link
          href="/donate"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Donation</span>
        </Link>
      </div>

      {/* Dynamic Impact Highlight Banner */}
      {impactRecords.length > 0 && (
        <div className="bg-gradient-to-r from-brand-900 via-gray-900 to-gray-900 text-white rounded-3xl p-6 sm:p-8 shadow-md space-y-3">
          <div className="flex items-center space-x-2 text-brand-400 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Audited Platform Outcome</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            Your {totalItemsDonated} donated items were distributed through{" "}
            {uniqueNgoCount || 1} partner NGO(s) and directly helped {totalBeneficiaries} beneficiaries.
          </h2>
          <p className="text-xs text-gray-300">
            All records verified with photographic proof and direct community receipt audits.
          </p>
        </div>
      )}

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold uppercase">
            <span>Total Donations</span>
            <Package className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
            {totalDonations}
          </div>
          <p className="text-[11px] text-gray-400 mt-1">{totalItemsDonated} total items pledged</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold uppercase">
            <span>In Custody / Active</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 mt-2">
            {activeDonations}
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Under dispatch or distribution</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold uppercase">
            <span>Delivered / Done</span>
            <CheckCircle2 className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-brand-600 mt-2">
            {deliveredDonations}
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Successfully arrived at NGO</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold uppercase">
            <span>Beneficiaries</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-600 mt-2">
            {totalBeneficiaries}
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Verified individuals helped</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab("donations")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === "donations"
              ? "bg-brand-600 text-white shadow-xs"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          My Donations ({donations.length})
        </button>

        <button
          onClick={() => setActiveTab("qr")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === "qr"
              ? "bg-brand-600 text-white shadow-xs"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          QR Tracking
        </button>

        <button
          onClick={() => setActiveTab("impact")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === "impact"
              ? "bg-brand-600 text-white shadow-xs"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          My Impact ({impactRecords.length})
        </button>
      </div>

      {/* Tab 1: My Donations */}
      {activeTab === "donations" && (
        <div className="space-y-4">
          {donations.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-3">
              <Package className="w-12 h-12 text-gray-300 mx-auto" />
              <h3 className="text-base font-bold text-gray-900">No Donations Yet</h3>
              <p className="text-xs text-gray-500">
                You haven't registered any donations. Start by making your first pledge.
              </p>
              <Link
                href="/donate"
                className="inline-block px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold"
              >
                Donate Now
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {donations.map((don) => (
                <div
                  key={don._id}
                  className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs hover:border-brand-300 transition flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                        {don.donationId}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          don.status === "DISTRIBUTED"
                            ? "bg-emerald-100 text-emerald-800"
                            : don.status === "DELIVERED"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {don.status}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-gray-900">{don.itemName}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {don.category} • {don.quantity} units ({don.remainingQuantity} remaining)
                      </p>
                    </div>

                    <p className="text-xs text-gray-600 line-clamp-2">{don.description}</p>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <Link
                      href={`/track/${don.donationId}`}
                      className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center space-x-1"
                    >
                      <span>Track Lifecycle & QR</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    {don.remainingQuantity > 0 && (
                      <Link
                        href={`/donate?category=${encodeURIComponent(
                          don.category
                        )}&itemName=${encodeURIComponent(don.itemName)}`}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        Matches
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: QR Tracking */}
      {activeTab === "qr" && (
        <div className="space-y-4">
          <p className="text-xs text-gray-500">
            Every donation has a safe cryptographic QR code. Present it to the NGO pickup representative
            for physical custody scanning.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {donations.map((don) => (
              <div
                key={don._id}
                className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs text-center space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-gray-700">{don.donationId}</span>
                  <span className="text-brand-700 font-semibold">{don.status}</span>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center">
                  <QrCode className="w-24 h-24 text-gray-800" />
                </div>

                <div className="text-xs text-gray-700 font-bold">{don.itemName}</div>

                <Link
                  href={`/track/${don.donationId}`}
                  className="block w-full py-2 bg-brand-50 hover:bg-brand-100 text-brand-700 font-semibold text-xs rounded-xl transition"
                >
                  Open Full Tracking Scanner
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: My Impact */}
      {activeTab === "impact" && (
        <div className="space-y-4">
          {impactRecords.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-3">
              <Users className="w-12 h-12 text-gray-300 mx-auto" />
              <h3 className="text-base font-bold text-gray-900">No Impact Records Yet</h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                Once recipient NGOs deliver your items to beneficiaries and submit verification proof,
                your audited impact reports will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {impactRecords.map((rec) => (
                <div
                  key={rec._id}
                  className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200 flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
                      <span>{rec.verified ? "Audited & Verified" : "Pending Audit"}</span>
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(rec.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div>
                    <div className="text-xs text-gray-500">
                      Partner NGO: <strong className="text-gray-900">{rec.ngoName}</strong>
                    </div>
                    <div className="text-xl font-black text-gray-900 mt-1">
                      {rec.itemsDistributed} Items Distributed → {rec.beneficiaries} Families Helped
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
                    "{rec.description}"
                  </p>

                  {rec.proofImageUrl && (
                    <div className="pt-2">
                      <span className="text-[11px] text-gray-400 font-semibold block mb-1">
                        Attached Verification Proof:
                      </span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={rec.proofImageUrl}
                        alt="Impact Proof"
                        className="w-full h-40 object-cover rounded-xl border border-gray-100"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

