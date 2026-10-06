"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Users,
  Package,
  CheckCircle2,
  Building,
  Heart,
  BarChart3,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function PublicImpactPage() {
  const [stats, setStats] = useState<any | null>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/stats").then((r) => r.json()),
      fetch("/api/impact?verified=true").then((r) => r.json()),
    ])
      .then(([statsData, impactData]) => {
        setStats(statsData);
        setRecords(impactData.impactRecords || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Page Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="text-xs font-bold text-brand-700 uppercase tracking-widest bg-brand-50 px-3.5 py-1 rounded-full border border-brand-200">
          Audited Outcomes
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
          Verified Community Impact
        </h1>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          Every number here represents an actual physical consignment delivered to verified grassroots
          organizations. All statistics are aggregated in real time from our MongoDB database.
        </p>
      </div>

      {/* Aggregate Metrics Grid */}
      <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-10 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-brand-600" />
            <span>Platform Aggregate Metrics</span>
          </h2>
          <span className="text-xs text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
            Live MongoDB Aggregation
          </span>
        </div>

        {stats ? (
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
                Delivered
              </span>
              <p className="text-2xl sm:text-3xl font-black text-purple-700 mt-1">
                {stats.deliveredDonations}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
              <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">
                Verified Reports
              </span>
              <p className="text-2xl sm:text-3xl font-black text-amber-700 mt-1">
                {stats.verifiedImpacts}
              </p>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-gray-400">Loading platform metrics...</div>
        )}
      </div>

      {/* Verified Stories from MongoDB */}
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Audited Distribution Records</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Photographic proof and direct community stories submitted by verified NGOs
            </p>
          </div>
          <span className="text-xs text-gray-500">{records.length} Verified Stories</span>
        </div>

        {records.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-4">
            <Users className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="text-base font-bold text-gray-900">No Impact Stories Yet</h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              As deliveries conclude and NGOs submit their proof of distribution, audited stories will
              populate here.
            </p>
            <Link
              href="/donate"
              className="inline-block px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold"
            >
              Start by Donating
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {records.map((rec) => (
              <div
                key={rec._id}
                className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs hover:border-brand-300 transition space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                      {rec.donationId}
                    </span>
                    <span className="text-xs font-semibold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200 flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
                      <span>Verified Outcome</span>
                    </span>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-gray-500 flex items-center space-x-1">
                      <Building className="w-3.5 h-3.5 text-brand-600" />
                      <span>{rec.ngoName}</span>
                    </div>
                    <h3 className="text-base font-extrabold text-gray-900 mt-1">
                      {rec.itemsDistributed} Items → {rec.beneficiaries} Families Aided
                    </h3>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
                    "{rec.description}"
                  </p>

                  {rec.proofImageUrl && (
                    <div className="pt-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={rec.proofImageUrl}
                        alt="Audit Proof"
                        className="w-full h-44 object-cover rounded-xl border border-gray-200"
                      />
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-gray-100 text-[11px] text-gray-400 flex items-center justify-between">
                  <span>Audited on {new Date(rec.createdAt).toLocaleDateString()}</span>
                  <Link
                    href={`/track/${rec.donationId}`}
                    className="font-semibold text-brand-600 hover:underline flex items-center space-x-1"
                  >
                    <span>View Chain</span>
                    <ArrowRight className="w-3 h-3" />
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

