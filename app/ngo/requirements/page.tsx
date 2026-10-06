"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import {
  Layers,
  PlusCircle,
  AlertCircle,
  CheckCircle2,
  MapPin,
  Trash2,
  Building,
  Sparkles,
} from "lucide-react";

const CATEGORIES = [
  "Clothes & Blankets",
  "Food & Ration",
  "Education & Books",
  "Medical & Hygiene",
  "Shelter & Furniture",
  "Other",
];

const URGENCIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

export default function NgoRequirementsPage() {
  const { user } = useAuth();
  const [requirements, setRequirements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [itemName, setItemName] = useState("Winter Blankets");
  const [category, setCategory] = useState("Clothes & Blankets");
  const [quantityNeeded, setQuantityNeeded] = useState("40");
  const [urgency, setUrgency] = useState<string>("CRITICAL");
  const [description, setDescription] = useState(
    "Urgent winter bedding required for destitute residents before cold wave peak."
  );
  const [location, setLocation] = useState(user?.location || "Lajpat Nagar, South Delhi");
  const [latitude, setLatitude] = useState(user?.latitude || 28.57);
  const [longitude, setLongitude] = useState(user?.longitude || 77.24);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchRequirements = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/requirements?ngoId=${user?.userId}&status=ALL`);
      const data = await res.json();
      setRequirements(data.requirements || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.userId) {
      fetchRequirements();
    }
  }, [user?.userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setErrorMsg("");
      setSuccessMsg("");

      const res = await fetch("/api/requirements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemName,
          category,
          quantityNeeded: parseInt(quantityNeeded, 10),
          urgency,
          description,
          location,
          latitude: parseFloat(latitude.toString()),
          longitude: parseFloat(longitude.toString()),
          ngoId: user?.userId,
          ngoName: user?.name,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create requirement");
      }

      setSuccessMsg(`Requirement registered with ID ${data.requirement.requirementId}`);
      fetchRequirements();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to post requirement");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (requirementId: string) => {
    if (!confirm("Are you sure you want to delete this requirement?")) return;
    try {
      const res = await fetch(`/api/requirements/${requirementId}`, { method: "DELETE" });
      if (res.ok) {
        fetchRequirements();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-brand-700 uppercase tracking-wider bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
          Demand Signal Registry
        </span>
        <h1 className="text-3xl font-extrabold text-gray-900 mt-1">Manage NGO Requirements</h1>
        <p className="text-xs text-gray-500">
          Publish verified needs to receive weighted algorithmic matches from regional donors
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Form */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-5 lg:col-span-1 h-fit">
          <h2 className="text-base font-bold text-gray-900 flex items-center space-x-2">
            <PlusCircle className="w-4 h-4 text-brand-600" />
            <span>Post New Need</span>
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
              <label className="block font-semibold text-gray-700 uppercase mb-1">Item Needed</label>
              <input
                type="text"
                required
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g. Blankets, Ration Packs"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 uppercase mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-gray-700 uppercase mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={quantityNeeded}
                  onChange={(e) => setQuantityNeeded(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 uppercase mb-1">Urgency</label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold"
                >
                  {URGENCIES.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 uppercase mb-1">
                Description / Context
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 uppercase mb-1">
                Delivery Location
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl shadow-xs transition disabled:opacity-50"
            >
              {submitting ? "Publishing..." : "Publish Requirement"}
            </button>
          </form>
        </div>

        {/* Existing Requirements List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <h2 className="text-base font-bold text-gray-900">
              Active Registered Requirements ({requirements.length})
            </h2>
            <span className="text-xs text-gray-400">Available for Algorithmic Multi-NGO Matching</span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-gray-400">Loading requirements...</div>
          ) : requirements.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-3">
              <Layers className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="text-xs text-gray-500">
                You haven't posted any requirements yet. Use the form on the left to publish community needs.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {requirements.map((req) => (
                <div
                  key={req._id}
                  className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-[11px] font-bold text-gray-500 mr-2">
                        {req.requirementId}
                      </span>
                      <span className="text-sm font-bold text-gray-900">{req.itemName}</span>
                    </div>

                    <div className="flex items-center space-x-2">
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
                      <button
                        onClick={() => handleDelete(req.requirementId)}
                        className="p-1 text-gray-400 hover:text-red-600 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600">{req.description}</p>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-gray-500">
                      <span>
                        Fulfillment: {req.quantityReceived} / {req.quantityNeeded} units
                      </span>
                      <span>
                        Status: <strong className="text-brand-700">{req.status}</strong>
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
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
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

