"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import {
  ShieldCheck,
  Users,
  Package,
  Layers,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  ArrowRight,
  Trash2,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any | null>(null);
  const [donations, setDonations] = useState<any[]>([]);
  const [impactRecords, setImpactRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState("");

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, donRes, impRes] = await Promise.all([
        fetch("/api/stats").then((r) => r.json()),
        fetch("/api/donations").then((r) => r.json()),
        fetch("/api/impact").then((r) => r.json()),
      ]);
      setStats(statsRes);
      setDonations(donRes.donations || []);
      setImpactRecords(impRes.impactRecords || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleVerifyImpact = async (id: string) => {
    try {
      const res = await fetch(`/api/impact/${id}/verify`, { method: "PATCH" });
      if (res.ok) {
        setActionMsg("Impact record verified successfully!");
        setTimeout(() => setActionMsg(""), 3000);
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSeed = async (reset = false) => {
    try {
      setActionMsg(reset ? "Purging and reseeding..." : "Seeding Tech Mela demo data...");
      const res = await fetch(`/api/seed?reset=${reset}`, { method: "POST" });
      if (res.ok) {
        setActionMsg("Demo scenario loaded successfully!");
        setTimeout(() => setActionMsg(""), 3000);
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-red-700 uppercase tracking-wider bg-red-50 px-3 py-1 rounded-full border border-red-200">
            System Administration
          </span>
          <h1 className="text-3xl font-extrabold text-gray-900 mt-1">
            Platform Verification Hub
          </h1>
          <p className="text-xs text-gray-500">
            Audit user records, inspect active donation pipelines, and certify NGO impact submissions
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleSeed(false)}
            className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold flex items-center space-x-1.5 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Seed Tech Mela Scenario</span>
          </button>

          <button
            onClick={() => handleSeed(true)}
            className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold flex items-center space-x-1.5 transition"
          >
            <RefreshCw className="w-3.5 h-3.5 text-red-600" />
            <span>Reset / Clean DB</span>
          </button>
        </div>
      </div>

      {actionMsg && (
        <div className="p-3.5 rounded-xl bg-brand-50 text-brand-800 text-xs font-semibold flex items-center space-x-2 border border-brand-200">
          <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
          <span>{actionMsg}</span>
        </div>
      )}

      {/* Admin Metrics */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
            <span className="text-[11px] text-gray-500 font-semibold uppercase">Total Donors</span>
            <p className="text-2xl font-black text-gray-900 mt-1">{stats.totalDonors}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
            <span className="text-[11px] text-gray-500 font-semibold uppercase">Partner NGOs</span>
            <p className="text-2xl font-black text-purple-700 mt-1">{stats.totalNgos}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
            <span className="text-[11px] text-gray-500 font-semibold uppercase">Total Donations</span>
            <p className="text-2xl font-black text-brand-600 mt-1">{stats.totalDonations}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
            <span className="text-[11px] text-gray-500 font-semibold uppercase">Verified Impacts</span>
            <p className="text-2xl font-black text-blue-600 mt-1">{stats.verifiedImpacts}</p>
          </div>
        </div>
      )}

      {/* Section: Pending & Verified Impact Records */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Audit Proof of Impact Submissions</h2>
            <p className="text-xs text-gray-500">
              Certify evidence submitted by recipient NGOs to validate community impact
            </p>
          </div>
          <span className="text-xs text-gray-400 font-medium">{impactRecords.length} Records</span>
        </div>

        {impactRecords.length === 0 ? (
          <div className="py-8 text-center text-xs text-gray-400">
            No impact submissions recorded yet.
          </div>
        ) : (
          <div className="space-y-3">
            {impactRecords.map((rec) => (
              <div
                key={rec._id}
                className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-gray-700 bg-white px-2 py-0.5 rounded border border-gray-200">
                      {rec.donationId}
                    </span>
                    <span className="font-bold text-gray-900">{rec.ngoName}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        rec.verified ? "bg-brand-100 text-brand-800" : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {rec.verified ? "Verified" : "Pending Verification"}
                    </span>
                  </div>
                  <p className="text-gray-600">
                    <strong>{rec.itemsDistributed} items distributed</strong> aiding{" "}
                    <strong>{rec.beneficiaries} beneficiaries</strong>.
                  </p>
                  <p className="text-gray-500 italic">"{rec.description}"</p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {!rec.verified && (
                    <button
                      onClick={() => handleVerifyImpact(rec._id)}
                      className="px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold transition"
                    >
                      Certify & Verify
                    </button>
                  )}
                  <Link
                    href={`/track/${rec.donationId}`}
                    className="px-3.5 py-1.5 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 transition"
                  >
                    View Donation
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section: All Registered Donations */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">All System Donations</h2>
          <span className="text-xs text-gray-400">{donations.length} Registered</span>
        </div>

        {donations.length === 0 ? (
          <div className="py-8 text-center text-xs text-gray-400">No donations registered yet.</div>
        ) : (
          <div className="space-y-3">
            {donations.map((don) => (
              <div
                key={don._id}
                className="p-3.5 rounded-xl border border-gray-100 bg-white flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-gray-700">{don.donationId}</span>
                    <span className="font-bold text-gray-900">{don.itemName}</span>
                    <span className="text-gray-500">({don.quantity} units)</span>
                  </div>
                  <div className="text-[11px] text-gray-400 mt-0.5">
                    Donor: {don.donorName || "Anonymous"} • Origin: {don.location}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded text-[11px]">
                    {don.status}
                  </span>
                  <Link
                    href={`/track/${don.donationId}`}
                    className="text-brand-600 hover:underline font-semibold"
                  >
                    Track
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

