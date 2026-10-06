"use client";

import React, { useState } from "react";
import { DONATION_STATUS_SEQUENCE, DonationStatus } from "@/types";
import {
  CheckCircle,
  Circle,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Truck,
  Box,
  Users,
} from "lucide-react";

interface StatusLogItem {
  status: DonationStatus;
  timestamp: string | Date;
  notes?: string;
}

interface StatusTimelineProps {
  currentStatus: DonationStatus;
  statusHistory?: StatusLogItem[];
  donationId: string;
  canUpdate?: boolean;
  onStatusUpdated?: (newStatus: DonationStatus) => void;
}

const STATUS_LABELS: Record<DonationStatus, { title: string; desc: string }> = {
  DONATED: {
    title: "Donated",
    desc: "Donation pledged and registered on platform",
  },
  ACCEPTED: {
    title: "Accepted",
    desc: "Target NGO confirmed and committed to receipt",
  },
  PICKUP_SCHEDULED: {
    title: "Pickup Scheduled",
    desc: "Logistics coordinated with donor for item handover",
  },
  COLLECTED: {
    title: "Collected",
    desc: "Items picked up from donor address by NGO team",
  },
  DELIVERED: {
    title: "Delivered",
    desc: "Consignment safely arrived at NGO shelter/hub",
  },
  DISTRIBUTED: {
    title: "Distributed",
    desc: "All items successfully distributed to beneficiaries",
  },
};

export default function StatusTimeline({
  currentStatus,
  statusHistory = [],
  donationId,
  canUpdate = false,
  onStatusUpdated,
}: StatusTimelineProps) {
  const currentIndex = DONATION_STATUS_SEQUENCE.indexOf(currentStatus);
  const nextStatus =
    currentIndex < DONATION_STATUS_SEQUENCE.length - 1
      ? DONATION_STATUS_SEQUENCE[currentIndex + 1]
      : null;

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [notesInput, setNotesInput] = useState("");

  const handleAdvanceStatus = async () => {
    if (!nextStatus) return;
    try {
      setLoading(true);
      setErrorMsg("");
      const res = await fetch(`/api/donations/${donationId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: nextStatus,
          notes: notesInput.trim() || `Advanced to ${STATUS_LABELS[nextStatus].title}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update status");
      }

      setNotesInput("");
      if (onStatusUpdated) {
        onStatusUpdated(nextStatus);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Lifecycle Tracking Timeline</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Strict sequential verification of item custody and distribution
          </p>
        </div>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200">
          Current: {STATUS_LABELS[currentStatus]?.title || currentStatus}
        </span>
      </div>

      {/* Timeline Steps */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
        {DONATION_STATUS_SEQUENCE.map((status, idx) => {
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isPending = idx > currentIndex;

          const historyItem = statusHistory.find((h) => h.status === status);

          return (
            <div key={status} className="relative flex items-start group">
              {/* Status Circle Indicator */}
              <div
                className={`absolute -left-6 sm:-left-8 top-0.5 flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full text-xs font-bold transition-all ${
                  isDone
                    ? "bg-brand-600 text-white ring-4 ring-brand-50"
                    : isCurrent
                    ? "bg-brand-500 text-white ring-4 ring-brand-100 animate-pulse"
                    : "bg-white text-gray-400 border-2 border-gray-300"
                }`}
              >
                {isDone ? (
                  <CheckCircle className="w-4 h-4" />
                ) : isCurrent ? (
                  <Clock className="w-3.5 h-3.5" />
                ) : (
                  <Circle className="w-3 h-3" />
                )}
              </div>

              {/* Status Details */}
              <div className="flex-1 ml-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <h4
                    className={`text-sm font-semibold ${
                      isDone || isCurrent ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {STATUS_LABELS[status].title}
                  </h4>
                  {historyItem?.timestamp && (
                    <span className="text-[11px] text-gray-400 mt-0.5 sm:mt-0 font-mono">
                      {new Date(historyItem.timestamp).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}
                </div>

                <p
                  className={`text-xs mt-0.5 ${
                    isDone || isCurrent ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  {STATUS_LABELS[status].desc}
                </p>

                {historyItem?.notes && (
                  <p className="mt-1 text-xs text-brand-800 bg-brand-50/70 rounded px-2 py-0.5 inline-block">
                    Note: {historyItem.notes}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Authorized Status Transition Control */}
      {canUpdate && nextStatus && (
        <div className="mt-6 pt-5 border-t border-gray-100 bg-gray-50/60 rounded-xl p-4">
          <div className="flex items-center space-x-2 text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4 text-brand-600" />
            <span>Authorized Custody Transition</span>
          </div>

          <p className="text-xs text-gray-600 mb-3">
            Advance donation status to the next sequential phase:{" "}
            <strong className="text-gray-900">{STATUS_LABELS[nextStatus].title}</strong>.
            (Direct skipping of phases is prevented by protocol).
          </p>

          {errorMsg && (
            <div className="mb-3 p-2.5 rounded-lg bg-red-50 text-red-700 text-xs flex items-center space-x-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder={`Optional note (e.g., driver arrived, dispatch verified)...`}
              value={notesInput}
              onChange={(e) => setNotesInput(e.target.value)}
              className="flex-1 text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
            <button
              onClick={handleAdvanceStatus}
              disabled={loading}
              className="inline-flex items-center justify-center space-x-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-lg shadow-sm transition disabled:opacity-50"
            >
              <span>{loading ? "Updating..." : `Mark as ${STATUS_LABELS[nextStatus].title}`}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {currentStatus === "DISTRIBUTED" && (
        <div className="p-3 bg-brand-50 border border-brand-200 rounded-xl flex items-center space-x-2 text-xs text-brand-800">
          <CheckCircle className="w-4 h-4 text-brand-600 shrink-0" />
          <span>
            This donation has concluded its distribution lifecycle and directly aided local beneficiaries.
          </span>
        </div>
      )}
    </div>
  );
}

