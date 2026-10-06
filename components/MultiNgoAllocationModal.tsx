"use client";

import React, { useState, useEffect } from "react";
import { MultiNgoAllocationPlan, AllocatedItem } from "@/lib/allocation";
import {
  PieChart,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building,
  Package,
} from "lucide-react";

interface MultiNgoAllocationModalProps {
  donationId: string;
  itemName: string;
  totalQuantity: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function MultiNgoAllocationModal({
  donationId,
  itemName,
  totalQuantity,
  isOpen,
  onClose,
  onSuccess,
}: MultiNgoAllocationModalProps) {
  const [loading, setLoading] = useState(false);
  const [committing, setCommitting] = useState(false);
  const [plan, setPlan] = useState<MultiNgoAllocationPlan | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchAllocationPlan = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const res = await fetch("/api/allocation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ donationId, confirm: false }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to calculate allocation");
      }
      setPlan(data.plan);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to preview allocation");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && donationId) {
      fetchAllocationPlan();
    }
  }, [isOpen, donationId]);

  const handleConfirmCommit = async () => {
    try {
      setCommitting(true);
      setErrorMsg("");
      const res = await fetch("/api/allocation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ donationId, confirm: true }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to commit allocation");
      }
      setSuccessMsg(
        `Successfully allocated ${data.plan.totalAllocated} units across ${data.plan.allocations.length} NGOs!`
      );
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to execute allocation");
    } finally {
      setCommitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 pb-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-brand-50 text-brand-700 text-xs font-semibold uppercase tracking-wider mb-1">
              <PieChart className="w-3.5 h-3.5" />
              <span>Multi-NGO Algorithmic Allocation</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Optimal Distribution Plan
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Distributing {totalQuantity} × {itemName} mathematically across vetted organizations
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold p-1 rounded-lg"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-10 h-10 border-3 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-medium text-gray-700">
              Computing optimal distribution based on Urgency, Proximity & Match Scores...
            </p>
          </div>
        ) : errorMsg ? (
          <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        ) : plan ? (
          <div className="space-y-6">
            {/* Allocation Pool Summary Banner */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100 text-center">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold">
                  Available Pool
                </p>
                <p className="text-xl font-black text-gray-900">
                  {plan.donationTotalQuantity}
                </p>
              </div>
              <div className="border-x border-gray-200">
                <p className="text-[11px] uppercase tracking-wider text-brand-700 font-semibold">
                  Allocated
                </p>
                <p className="text-xl font-black text-brand-600">
                  {plan.totalAllocated}
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold">
                  Remaining
                </p>
                <p className="text-xl font-black text-gray-700">
                  {plan.remainingQuantity}
                </p>
              </div>
            </div>

            {/* List of NGO Allocations */}
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                NGO Allocation Breakdown
              </h4>

              {plan.allocations.length === 0 ? (
                <p className="text-xs text-gray-500 italic py-4 text-center">
                  No active requirements found matching this item type.
                </p>
              ) : (
                plan.allocations.map((alloc, idx) => (
                  <div
                    key={alloc.requirementId || idx}
                    className="p-4 rounded-xl border border-gray-200 hover:border-brand-300 bg-white shadow-xs space-y-2 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Building className="w-4 h-4 text-brand-600" />
                        <span className="font-bold text-gray-900 text-sm">
                          {alloc.ngoName}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                            alloc.urgency === "CRITICAL"
                              ? "bg-red-100 text-red-800"
                              : alloc.urgency === "HIGH"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {alloc.urgency}
                        </span>
                        <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                          {alloc.allocatedQuantity} Allocated
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar of NGO requirement fulfilled */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-gray-500">
                        <span>Requested: {alloc.requestedQuantity} units</span>
                        <span>{alloc.distanceKm.toFixed(1)} km away • {alloc.matchScore}% Match</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-500 rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.round((alloc.allocatedQuantity / alloc.requestedQuantity) * 100)
                            )}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Algorithmic Reason */}
                    <p className="text-[11px] text-gray-600 bg-gray-50 rounded-lg p-2 border border-gray-100">
                      <strong>Reason:</strong> {alloc.allocationReason}
                    </p>
                  </div>
                ))
              )}
            </div>

            {successMsg && (
              <div className="p-3 rounded-xl bg-brand-50 text-brand-800 text-xs font-medium flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-100">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmCommit}
                disabled={committing || plan.allocations.length === 0}
                className="inline-flex items-center space-x-1.5 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl shadow-md hover:shadow-lg transition disabled:opacity-50"
              >
                <span>{committing ? "Committing to Database..." : "Confirm & Commit Allocation"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

