import React from "react";
import { MatchScoreBreakdown } from "@/lib/matching";
import { Check, Shield, MapPin, AlertTriangle, Layers, Percent } from "lucide-react";

interface MatchScoreBadgeProps {
  score: number;
  breakdown: MatchScoreBreakdown;
  ngoName: string;
  rank?: number;
}

export default function MatchScoreBadge({
  score,
  breakdown,
  ngoName,
  rank,
}: MatchScoreBadgeProps) {
  const getScoreColor = (val: number) => {
    if (val >= 85) return "text-brand-700 bg-brand-50 border-brand-200";
    if (val >= 70) return "text-emerald-700 bg-emerald-50 border-emerald-200";
    if (val >= 50) return "text-amber-700 bg-amber-50 border-amber-200";
    return "text-gray-700 bg-gray-50 border-gray-200";
  };

  const getRankBadge = (r?: number) => {
    if (r === 1) return "🥇 Best Match";
    if (r === 2) return "🥈 2nd Match";
    if (r === 3) return "🥉 3rd Match";
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5 hover:border-brand-200 transition">
      {/* Header with Rank & Overall Score */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-2">
            {rank && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                {getRankBadge(rank)}
              </span>
            )}
            <span className="text-xs font-medium text-gray-500 flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              <span>{breakdown.distanceKm.toFixed(1)} km away</span>
            </span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mt-1">{ngoName}</h3>
        </div>

        {/* Big Overall Match Score */}
        <div
          className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl border ${getScoreColor(
            score
          )} font-bold shadow-xs`}
        >
          <span className="text-2xl font-black leading-none">{Math.round(score)}%</span>
          <span className="text-[10px] uppercase font-semibold tracking-wider mt-0.5 text-gray-600">
            Match
          </span>
        </div>
      </div>

      {/* Mathematical Breakdown Bars */}
      <div className="space-y-2.5 pt-2 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs font-semibold text-gray-600 mb-1">
          <span>Weighted Criteria Breakdown</span>
          <span className="text-[10px] text-gray-600 font-mono">Formula: Σ(W × S)</span>
        </div>

        {/* 1. Category (30%) */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-600">Category Match (30% weight)</span>
            <span className="font-semibold text-gray-900">{breakdown.categoryScore}%</span>
          </div>
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-500 rounded-full"
              style={{ width: `${breakdown.categoryScore}%` }}
            />
          </div>
        </div>

        {/* 2. Urgency (25%) */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-600">Urgency Priority (25% weight)</span>
            <span className="font-semibold text-gray-900">{breakdown.urgencyScore}%</span>
          </div>
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full"
              style={{ width: `${breakdown.urgencyScore}%` }}
            />
          </div>
        </div>

        {/* 3. Distance (20%) */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-600">Proximity / Distance (20% weight)</span>
            <span className="font-semibold text-gray-900">{breakdown.distanceScore}%</span>
          </div>
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${breakdown.distanceScore}%` }}
            />
          </div>
        </div>

        {/* 4. Quantity (15%) */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-600">Quantity Utilization (15% weight)</span>
            <span className="font-semibold text-gray-900">{breakdown.quantityScore}%</span>
          </div>
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full"
              style={{ width: `${breakdown.quantityScore}%` }}
            />
          </div>
        </div>

        {/* 5. Trust (10%) */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-600">NGO Trust Rating (10% weight)</span>
            <span className="font-semibold text-gray-900">{breakdown.trustScore}%</span>
          </div>
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-500 rounded-full"
              style={{ width: `${breakdown.trustScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Why this match? */}
      {breakdown.reasons && breakdown.reasons.length > 0 && (
        <div className="pt-3 border-t border-gray-100 bg-brand-50/40 rounded-xl p-3.5 space-y-1.5">
          <p className="text-xs font-semibold text-brand-900 uppercase tracking-wider mb-2">
            Why this match?
          </p>
          {breakdown.reasons.map((reason, i) => (
            <div key={i} className="flex items-start space-x-2 text-xs text-gray-700">
              <Check className="w-3.5 h-3.5 text-brand-600 shrink-0 mt-0.5" />
              <span>{reason}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

