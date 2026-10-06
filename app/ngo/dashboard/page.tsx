"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import {
  Building2,
  Package,
  CheckCircle2,
  Clock,
  Users,
  ShieldCheck,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  FileCheck,
  AlertCircle,
  Truck,
  Layers,
} from "lucide-react";

export default function NgoDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [requirements, setRequirements] = useState<any[]>([]);
  const [incomingDonations, setIncomingDonations] = useState<any[]>([]);
  const [impactRecords, setImpactRecords] = useState<any[]>([]);
  const [trustFactors, setTrustFactors] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "ngo")) {
      // If not logged in as NGO, allow view or redirect
    }
  }, [authLoading, user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const ngoId = user?.userId;

      // 1. Fetch Requirements
      const reqRes = await fetch(`/api/requirements?ngoId=${ngoId}&status=ALL`);
      const reqData = await reqRes.json();
      setRequirements(reqData.requirements || []);

      // 2. Fetch Incoming / Assigned Donations
      const donRes = await fetch(`/api/donations?assignedNgoId=${ngoId}`);
      const donData = await donRes.json();
      setIncomingDonations(donData.donations || []);

      // 3. Fetch Impact Reports
      const impRes = await fetch(`/api/impact?ngoId=${ngoId}`);
      const impData = await impRes.json();
      setImpactRecords(impData.impactRecords || []);

      // 4. Fetch Trust Score Breakdown
      if (ngoId) {
        const trustRes = await fetch(`/api/ngos/${ngoId}/trust-score`);
        const trustData = await trustRes.json();
        setTrustFactors(trustData.factors || null);
      }
    } catch (err) {
      console.error("NGO dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.userId) {
      fetchData();
    }
  }, [user?.userId]);

  const activeRequirements = requirements.filter((r) => r.status === "OPEN").length;
  const receivedDonations = incomingDonations.filter((d) =>
    ["COLLECTED", "DELIVERED", "DISTRIBUTED"].includes(d.status)
  ).length;

  const totalBeneficiaries = impactRecords.reduce(
    (acc, curr) => acc + (curr.beneficiaries || 0),
    0
  );

  const trustScore = trustFactors?.computedTrustScore ?? user?.trustScore ?? 85;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-purple-700 uppercase tracking-wider bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            NGO Operational Command
          </span>
          <h1 className="text-3xl font-extrabold text-gray-900 mt-1">
            {user?.name || "Partner Organization"}
          </h1>
          <p className="text-xs text-gray-500">
            Location: {user?.location || "Regional Hub"} • Coordinated Consignments & Requirements
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            href="/ngo/requirements"
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Requirement</span>
          </Link>

          <Link
            href="/ngo/impact"
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-md transition"
          >
            <FileCheck className="w-4 h-4" />
            <span>Submit Impact Proof</span>
          </Link>
        </div>
      </div>

      {/* Trust Score Banner */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-md border border-brand-200">
              Rule-Based Algorithm
            </span>
            <span className="text-xs text-gray-400">Strictly Non-AI Verifiable Metric</span>
          </div>
          <h2 className="text-2xl font-black text-gray-900">
            NGO Trust Score: {trustScore} / 100
          </h2>
          <p className="text-xs text-gray-500">
            Calculated from baseline verification (50) + completed shipments (+5) + audited impact
            proofs (+10).
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          {trustFactors?.reasons?.map((r: string, i: number) => (
            <span
              key={i}
              className="hidden lg:inline-block bg-gray-50 text-gray-700 px-2.5 py-1 rounded-lg border border-gray-100"
            >
              ✓ {r}
            </span>
          ))}
        </div>
      </div>

      {/* 5 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold uppercase">
            <span>Active Needs</span>
            <Layers className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
            {activeRequirements}
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Open for donor matching</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold uppercase">
            <span>Incoming Consignments</span>
            <Truck className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 mt-2">
            {incomingDonations.length}
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Pledged by platform donors</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold uppercase">
            <span>Consignments Received</span>
            <CheckCircle2 className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-brand-600 mt-2">
            {receivedDonations}
          </div>
          <p className="text-[11px] text-gray-400 mt-1">In NGO warehouse/custody</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold uppercase">
            <span>Families Helped</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-600 mt-2">
            {totalBeneficiaries}
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Verified direct impact</p>
        </div>
      </div>

      {/* Sections: Requirements & Incoming Donations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Requirements Column */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-base font-bold text-gray-900">Your Requirements</h3>
            <Link
              href="/ngo/requirements"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700"
            >
              Manage All
            </Link>
          </div>

          {requirements.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-400">
              No requirements registered. Click "Create Requirement" to post community needs.
            </div>
          ) : (
            <div className="space-y-3">
              {requirements.slice(0, 5).map((req) => (
                <div
                  key={req._id}
                  className="p-3.5 rounded-xl border border-gray-100 hover:border-gray-200 bg-gray-50/50 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">{req.itemName}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        req.urgency === "CRITICAL"
                          ? "bg-red-100 text-red-800"
                          : req.urgency === "HIGH"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {req.urgency}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-500 text-[11px]">
                    <span>Category: {req.category}</span>
                    <span>
                      {req.quantityReceived} / {req.quantityNeeded} units received
                    </span>
                  </div>

                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-500 rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round((req.quantityReceived / req.quantityNeeded) * 100)
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Incoming & Matched Donations */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-base font-bold text-gray-900">Matched Consignments</h3>
            <span className="text-xs text-gray-400">{incomingDonations.length} Assigned</span>
          </div>

          {incomingDonations.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-400">
              No donations currently allocated to your organization. Donors will match based on your
              requirements.
            </div>
          ) : (
            <div className="space-y-3">
              {incomingDonations.map((don) => (
                <div
                  key={don._id}
                  className="p-3.5 rounded-xl border border-gray-100 hover:border-brand-200 bg-white shadow-xs space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-gray-900">{don.itemName}</div>
                    <span className="font-mono text-[11px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                      {don.status}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-500 text-[11px]">
                    <span>Qty: {don.quantity} units</span>
                    <span>Origin: {don.location}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <Link
                      href={`/track/${don.donationId}`}
                      className="text-xs font-semibold text-brand-600 hover:underline flex items-center space-x-1"
                    >
                      <span>Update Lifecycle Custody</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>

                    {["DELIVERED", "DISTRIBUTED"].includes(don.status) && (
                      <Link
                        href={`/ngo/impact?donationId=${don.donationId}`}
                        className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded hover:bg-purple-100"
                      >
                        Submit Impact
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

