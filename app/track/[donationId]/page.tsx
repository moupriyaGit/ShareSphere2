"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import StatusTimeline from "@/components/StatusTimeline";
import { DonationStatus } from "@/types";
import {
  QrCode,
  Package,
  Layers,
  MapPin,
  Calendar,
  Building,
  ArrowRight,
  ShieldCheck,
  Download,
  Share2,
  ExternalLink,
  Sparkles,
} from "lucide-react";

export default function TrackDonationPage() {
  const params = useParams();
  const donationId = params.donationId as string;
  const { user } = useAuth();

  const [donation, setDonation] = useState<any | null>(null);
  const [allocations, setAllocations] = useState<any[]>([]);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);

  const fetchDonation = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/donations/${donationId}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Donation not found");
      }
      setDonation(data.donation);
      setAllocations(data.allocations || []);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to load donation tracking");
    } finally {
      setLoading(false);
    }
  };

  const fetchQrCode = async () => {
    try {
      const res = await fetch(`/api/donations/${donationId}/qr`);
      const data = await res.json();
      if (res.ok && data.qrDataUrl) {
        setQrDataUrl(data.qrDataUrl);
      }
    } catch (err) {
      console.error("QR Code error:", err);
    }
  };

  useEffect(() => {
    if (donationId) {
      fetchDonation();
      fetchQrCode();
    }
  }, [donationId]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-4">
        <div className="w-10 h-10 border-3 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-semibold text-gray-700">Loading donation custody tracking...</p>
      </div>
    );
  }

  if (errorMsg || !donation) {
    return (
      <div className="max-w-md mx-auto my-16 bg-white p-8 rounded-3xl border border-gray-200 text-center space-y-4">
        <Package className="w-12 h-12 text-gray-300 mx-auto" />
        <h2 className="text-xl font-bold text-gray-900">Donation Record Not Found</h2>
        <p className="text-xs text-gray-500">{errorMsg || "The requested donation ID does not exist."}</p>
        <Link
          href="/donate"
          className="inline-block px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold"
        >
          Create New Donation
        </Link>
      </div>
    );
  }

  // Determine if the current viewer can update the status
  const canUpdateStatus =
    user?.role === "ngo" || user?.role === "admin" || user?.userId === donation.donorId?._id;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-800 border border-gray-200">
              {donation.donationId}
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
              {donation.status}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            {donation.quantity} × {donation.itemName}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
            <span>Category: <strong className="text-gray-700">{donation.category}</strong></span>
            <span>•</span>
            <span>Origin: <strong className="text-gray-700">{donation.location}</strong></span>
            <span>•</span>
            <span>
              Registered:{" "}
              <strong className="text-gray-700">
                {new Date(donation.createdAt).toLocaleDateString()}
              </strong>
            </span>
          </div>
        </div>

        {/* Share / Copy Action */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyLink}
            className="px-3.5 py-2 rounded-xl border border-gray-200 hover:border-gray-300 bg-gray-50 text-gray-700 text-xs font-medium flex items-center space-x-1.5 transition"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? "Link Copied!" : "Share Tracking Link"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Lifecycle Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <StatusTimeline
            currentStatus={donation.status as DonationStatus}
            statusHistory={donation.statusHistory || []}
            donationId={donation.donationId}
            canUpdate={canUpdateStatus}
            onStatusUpdated={(newStatus) => {
              setDonation({ ...donation, status: newStatus });
              fetchDonation();
            }}
          />

          {/* Allocation details if multi-NGO distributed */}
          {allocations.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-xs">
              <h3 className="text-base font-bold text-gray-900 flex items-center space-x-2">
                <span>Multi-NGO Distribution Allocations</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200">
                  {allocations.length} Recipient NGOs
                </span>
              </h3>

              <div className="space-y-3">
                {allocations.map((alloc) => (
                  <div
                    key={alloc._id}
                    className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-gray-900">{alloc.ngoName}</div>
                      <div className="text-gray-500 text-[11px] mt-0.5">
                        {alloc.allocationReason}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-brand-700 text-sm">
                        {alloc.allocatedQuantity} units
                      </span>
                      <div className="text-[10px] text-gray-400">
                        {alloc.matchScore}% Match Score
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* If Status is Delivered or Distributed, allow submitting proof of impact */}
          {(donation.status === "DELIVERED" || donation.status === "DISTRIBUTED") && (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-brand-50 to-emerald-50 border border-brand-200 space-y-3">
              <div className="flex items-center space-x-2 text-brand-900 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-brand-600" />
                <span>Next Milestone: Submit Proof of Impact</span>
              </div>
              <p className="text-xs text-brand-800 leading-relaxed">
                Items have been delivered! The recipient NGO can now submit beneficiary counts and
                distribution logs to verify community impact.
              </p>
              <Link
                href={`/ngo/impact?donationId=${donation.donationId}`}
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-xl shadow-xs transition"
              >
                <span>Submit / View Impact Proof</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Right 1 Col: Safe QR Code Card & Details */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs text-center space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Safe QR Identifier
              </span>
              <ShieldCheck className="w-4 h-4 text-brand-600" />
            </div>

            {qrDataUrl ? (
              <div className="space-y-3">
                <div className="p-4 bg-brand-50/40 rounded-2xl border border-brand-100 inline-block shadow-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrDataUrl}
                    alt={`Tracking QR Code for ${donation.donationId}`}
                    className="w-48 h-48 mx-auto rounded-lg"
                  />
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-semibold text-gray-900 font-mono">
                    {donation.donationId}
                  </p>
                  <p className="text-[11px] text-gray-400 max-w-xs mx-auto">
                    Contains strictly the encrypted tracking route. Zero sensitive donor identity data stored.
                  </p>
                </div>

                <a
                  href={qrDataUrl}
                  download={`ShareSphere-${donation.donationId}-QR.png`}
                  className="w-full py-2 px-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-700 flex items-center justify-center space-x-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download QR Code Image</span>
                </a>
              </div>
            ) : (
              <div className="py-12 text-xs text-gray-400">Generating tracking QR code...</div>
            )}
          </div>

          {/* Donation Summary Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-3 text-xs">
            <h4 className="font-bold text-gray-900 border-b border-gray-100 pb-2">
              Consignment Info
            </h4>
            <div className="flex justify-between py-1 border-b border-gray-50 text-gray-600">
              <span>Donor</span>
              <span className="font-semibold text-gray-900">
                {donation.donorName || "Anonymous Donor"}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-50 text-gray-600">
              <span>Total Quantity</span>
              <span className="font-semibold text-gray-900">{donation.quantity} units</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-50 text-gray-600">
              <span>Remaining Quantity</span>
              <span className="font-semibold text-gray-900">
                {donation.remainingQuantity} units
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-50 text-gray-600">
              <span>Pickup Coordinates</span>
              <span className="font-mono text-[11px] text-gray-700">
                {donation.latitude.toFixed(3)}°N, {donation.longitude.toFixed(3)}°E
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

