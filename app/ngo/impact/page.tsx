"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Users,
  Image as ImageIcon,
  ArrowRight,
  Package,
} from "lucide-react";

function NgoImpactContent() {
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [donationId, setDonationId] = useState(searchParams.get("donationId") || "");
  const [itemsReceived, setItemsReceived] = useState("40");
  const [itemsDistributed, setItemsDistributed] = useState("40");
  const [beneficiaries, setBeneficiaries] = useState("35");
  const [description, setDescription] = useState(
    "Distributed directly to homeless families and elderly residents at the community night shelter."
  );
  const [proofImageUrl, setProofImageUrl] = useState(
    "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80"
  );

  const [impactRecords, setImpactRecords] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchRecords = async () => {
    try {
      const res = await fetch(`/api/impact?ngoId=${user?.userId}`);
      const data = await res.json();
      setImpactRecords(data.impactRecords || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user?.userId) {
      fetchRecords();
    }
  }, [user?.userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donationId || !itemsReceived || !beneficiaries || !description) {
      setErrorMsg("Please fill in all required impact report fields");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg("");
      setSuccessMsg("");

      const res = await fetch("/api/impact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donationId: donationId.trim(),
          itemsReceived: parseInt(itemsReceived, 10),
          itemsDistributed: parseInt(itemsDistributed, 10),
          beneficiaries: parseInt(beneficiaries, 10),
          description,
          proofImageUrl,
          ngoId: user?.userId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit impact record");
      }

      setSuccessMsg("Proof of Impact submitted successfully! NGO trust score updated (+10).");
      fetchRecords();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit impact report");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div>
        <span className="text-xs font-bold text-purple-700 uppercase tracking-wider bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
          Audited Impact Submission
        </span>
        <h1 className="text-3xl font-extrabold text-gray-900 mt-1">Submit Proof of Impact</h1>
        <p className="text-xs text-gray-500">
          Complete the transparent verification lifecycle. Submitting verified reports rewards your
          trust rating.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Submission Form */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-5 lg:col-span-1 h-fit">
          <h2 className="text-base font-bold text-gray-900 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-brand-600" />
            <span>Verification Record</span>
          </h2>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center space-x-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-brand-50 text-brand-800 text-xs flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 uppercase mb-1">
                Donation ID
              </label>
              <input
                type="text"
                required
                value={donationId}
                onChange={(e) => setDonationId(e.target.value)}
                placeholder="e.g. DON-849201"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-mono text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-gray-700 uppercase mb-1">
                  Items Received
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={itemsReceived}
                  onChange={(e) => setItemsReceived(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 uppercase mb-1">
                  Distributed
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={itemsDistributed}
                  onChange={(e) => setItemsDistributed(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 uppercase mb-1">
                Beneficiaries Helped (Families / People)
              </label>
              <input
                type="number"
                min="1"
                required
                value={beneficiaries}
                onChange={(e) => setBeneficiaries(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-mono text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 uppercase mb-1">
                Distribution Story / Beneficiary Context
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe how the goods reached the recipients and the direct impact..."
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 uppercase mb-1">
                Proof Image URL (Optional Audit Photo)
              </label>
              <input
                type="url"
                value={proofImageUrl}
                onChange={(e) => setProofImageUrl(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-mono text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-xs transition disabled:opacity-50"
            >
              {submitting ? "Submitting Proof..." : "Submit Proof of Impact"}
            </button>
          </form>
        </div>

        {/* Existing Impact Records */}
        <div className="lg:col-span-2 space-y-4">
          <div className="border-b border-gray-200 pb-3">
            <h2 className="text-base font-bold text-gray-900">
              Submitted Verification Reports ({impactRecords.length})
            </h2>
            <p className="text-xs text-gray-400">
              Platform impact audited directly for donor transparency
            </p>
          </div>

          {impactRecords.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-3">
              <FileCheck className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="text-xs text-gray-500">
                No impact records submitted yet. Once you receive and distribute items, submit proofs
                here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {impactRecords.map((rec) => (
                <div
                  key={rec._id}
                  className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                      Donation: {rec.donationId}
                    </span>
                    <span className="text-xs font-semibold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200 flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
                      <span>{rec.verified ? "Verified Outcome" : "Audited"}</span>
                    </span>
                  </div>

                  <div className="text-base font-bold text-gray-900">
                    {rec.itemsDistributed} Items Distributed → {rec.beneficiaries} Beneficiaries Aided
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
                    "{rec.description}"
                  </p>

                  {rec.proofImageUrl && (
                    <div className="pt-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={rec.proofImageUrl}
                        alt="Proof of impact"
                        className="w-full h-44 object-cover rounded-xl border border-gray-200"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function NgoImpactPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-sm text-gray-500">Loading impact form...</div>
      }
    >
      <NgoImpactContent />
    </Suspense>
  );
}

