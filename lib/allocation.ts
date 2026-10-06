import { SmartMatchResult } from "./matching";

export interface CandidateRequirement {
  requirementId: string;
  requirementObjId?: string;
  ngoId: string;
  ngoName: string;
  itemName: string;
  category: string;
  quantityNeeded: number;
  quantityReceived: number;
  urgency: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  distanceKm: number;
  matchScore: number;
}

export interface AllocatedItem {
  requirementId: string;
  requirementObjId?: string;
  ngoId: string;
  ngoName: string;
  itemName: string;
  urgency: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  requestedQuantity: number;
  allocatedQuantity: number;
  remainingRequirement: number;
  matchScore: number;
  distanceKm: number;
  allocationReason: string;
}

export interface MultiNgoAllocationPlan {
  donationTotalQuantity: number;
  totalAllocated: number;
  remainingQuantity: number;
  allocations: AllocatedItem[];
  summary: string;
}

const URGENCY_WEIGHT: Record<"LOW" | "MEDIUM" | "HIGH" | "CRITICAL", number> = {
  CRITICAL: 4,
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

/**
 * Computes Multi-NGO Smart Allocation
 * Prioritizes based on Urgency, Match Score, Distance, and Remaining Need.
 * Strict mathematical constraint: never allocate more than available donation or remaining need.
 */
export function calculateMultiNgoAllocation(
  donationTotalQuantity: number,
  candidates: CandidateRequirement[]
): MultiNgoAllocationPlan {
  let availablePool = Math.max(0, donationTotalQuantity);
  const allocations: AllocatedItem[] = [];

  // Sort candidate requirements mathematically:
  // 1. Urgency priority (Descending)
  // 2. Match Score (Descending)
  // 3. Proximity / Distance (Ascending)
  const sortedCandidates = [...candidates]
    .filter((c) => Math.max(0, c.quantityNeeded - c.quantityReceived) > 0)
    .sort((a, b) => {
      const urgencyDiff = URGENCY_WEIGHT[b.urgency] - URGENCY_WEIGHT[a.urgency];
      if (urgencyDiff !== 0) return urgencyDiff;

      const scoreDiff = b.matchScore - a.matchScore;
      if (Math.abs(scoreDiff) > 1) return scoreDiff;

      return a.distanceKm - b.distanceKm;
    });

  for (const candidate of sortedCandidates) {
    if (availablePool <= 0) break;

    const remainingNeeded = Math.max(0, candidate.quantityNeeded - candidate.quantityReceived);
    if (remainingNeeded <= 0) continue;

    // Allocate either full remaining need or whatever remains in the donation pool
    const allocatedQuantity = Math.min(availablePool, remainingNeeded);

    availablePool -= allocatedQuantity;
    const remainingAfter = remainingNeeded - allocatedQuantity;

    // Generate programmatic mathematical rationale
    let reason = "";
    if (allocatedQuantity === remainingNeeded) {
      reason = `100% fulfilled (${allocatedQuantity}/${remainingNeeded} units) based on ${candidate.urgency} urgency and ${candidate.matchScore}% match score.`;
    } else {
      const pct = Math.round((allocatedQuantity / remainingNeeded) * 100);
      reason = `Partially fulfilled (${pct}%: ${allocatedQuantity}/${remainingNeeded} units) due to donation capacity allocation constraints.`;
    }

    allocations.push({
      requirementId: candidate.requirementId,
      requirementObjId: candidate.requirementObjId,
      ngoId: candidate.ngoId,
      ngoName: candidate.ngoName,
      itemName: candidate.itemName,
      urgency: candidate.urgency,
      requestedQuantity: candidate.quantityNeeded,
      allocatedQuantity,
      remainingRequirement: remainingAfter,
      matchScore: candidate.matchScore,
      distanceKm: candidate.distanceKm,
      allocationReason: reason,
    });
  }

  const totalAllocated = donationTotalQuantity - availablePool;

  const summary = `Algorithmic distribution completed: ${totalAllocated} of ${donationTotalQuantity} units distributed across ${allocations.length} NGO(s) prioritized by urgency weight and proximity score.`;

  return {
    donationTotalQuantity,
    totalAllocated,
    remainingQuantity: availablePool,
    allocations,
    summary,
  };
}

