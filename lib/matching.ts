import { calculateDistance } from "./distance";

export interface MatchInputDonation {
  itemName: string;
  category: string;
  quantity: number;
  latitude?: number | null;
  longitude?: number | null;
}

export interface MatchInputRequirement {
  _id?: string;
  requirementId: string;
  itemName: string;
  category: string;
  quantityNeeded: number;
  quantityReceived: number;
  urgency: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  latitude?: number | null;
  longitude?: number | null;
  location?: string;
}

export interface MatchInputNGO {
  _id?: string;
  name: string;
  trustScore: number;
  latitude?: number | null;
  longitude?: number | null;
  location?: string;
}

export interface MatchScoreBreakdown {
  categoryScore: number;
  urgencyScore: number;
  distanceScore: number;
  quantityScore: number;
  trustScore: number;
  finalMatchScore: number;
  distanceKm: number;
  reasons: string[];
}

export interface SmartMatchResult {
  requirement: MatchInputRequirement;
  ngo: MatchInputNGO;
  breakdown: MatchScoreBreakdown;
  matchScore: number;
}

/**
 * 1. Category Score (0 - 100)
 * Evaluates semantic match between donation category/item and NGO requirement.
 */
export function calculateCategoryScore(
  donationCategory: string,
  reqCategory: string,
  donationItem: string,
  reqItem: string
): number {
  const normDonCat = donationCategory.trim().toLowerCase();
  const normReqCat = reqCategory.trim().toLowerCase();
  const normDonItem = donationItem.trim().toLowerCase();
  const normReqItem = reqItem.trim().toLowerCase();

  if (normDonCat === normReqCat) {
    if (normDonItem === normReqItem || normDonItem.includes(normReqItem) || normReqItem.includes(normDonItem)) {
      return 100;
    }
    return 95;
  }

  // Cross-category keyword overlap (e.g. "blanket" in clothes vs shelter)
  const donWords = normDonItem.split(/\s+/).filter((w) => w.length > 2);
  const reqWords = normReqItem.split(/\s+/).filter((w) => w.length > 2);
  const commonWords = donWords.filter((w) => reqWords.includes(w));

  if (commonWords.length > 0) {
    return 80;
  }

  return 20;
}

/**
 * 2. Urgency Score (0 - 100)
 * Evaluates urgency of NGO requirement.
 */
export function calculateUrgencyScore(urgency: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"): number {
  switch (urgency) {
    case "CRITICAL":
      return 100;
    case "HIGH":
      return 80;
    case "MEDIUM":
      return 55;
    case "LOW":
      return 30;
    default:
      return 50;
  }
}

/**
 * 3. Distance Score (0 - 100)
 * Mathematical decay scoring using Haversine distance in kilometers.
 * Closer NGO gets higher score. Max standard radius benchmark = 50 km.
 */
export function calculateDistanceScore(distanceKm: number, maxRadiusKm = 50): number {
  if (distanceKm <= 2) return 100;
  if (distanceKm <= 5) return 96;
  if (distanceKm <= 10) return 90;
  if (distanceKm <= 20) return 80;
  if (distanceKm <= 35) return 65;
  if (distanceKm <= maxRadiusKm) return 50;

  // For distances beyond 50km, graceful decay with floor of 10
  const decayed = Math.max(10, Math.round(50 - ((distanceKm - maxRadiusKm) / maxRadiusKm) * 30));
  return decayed;
}

/**
 * 4. Quantity Score (0 - 100)
 * Evaluates how effectively the donation fulfills the NGO's remaining need.
 */
export function calculateQuantityScore(
  donationQuantity: number,
  quantityNeeded: number,
  quantityReceived: number = 0
): number {
  const remainingNeeded = Math.max(1, quantityNeeded - quantityReceived);

  if (donationQuantity >= remainingNeeded) {
    // Donation completely satisfies requirement
    return 100;
  }

  // Donation partially satisfies requirement - ratio of need fulfilled
  const fulfillmentRatio = (donationQuantity / remainingNeeded) * 100;
  return Math.min(100, Math.max(25, Math.round(fulfillmentRatio)));
}

/**
 * 5. NGO Trust Score (0 - 100)
 * Transparent verification-based NGO score.
 */
export function calculateTrustScore(ngoTrustScore: number | undefined | null): number {
  if (ngoTrustScore === undefined || ngoTrustScore === null) return 50;
  return Math.max(0, Math.min(100, Math.round(ngoTrustScore)));
}

/**
 * Combined Weighted Smart Matching Algorithm
 * Match Score =
 *   0.30 × Category Score
 * + 0.25 × Urgency Score
 * + 0.20 × Distance Score
 * + 0.15 × Quantity Score
 * + 0.10 × Trust Score
 */
export function calculateFinalMatchScore(
  donation: MatchInputDonation,
  requirement: MatchInputRequirement,
  ngo: MatchInputNGO
): MatchScoreBreakdown {
  const categoryScore = calculateCategoryScore(
    donation.category,
    requirement.category,
    donation.itemName,
    requirement.itemName
  );

  const urgencyScore = calculateUrgencyScore(requirement.urgency);

  const reqLat = requirement.latitude ?? ngo.latitude;
  const reqLon = requirement.longitude ?? ngo.longitude;
  const distanceKm = calculateDistance(donation.latitude, donation.longitude, reqLat, reqLon);

  const distanceScore = calculateDistanceScore(distanceKm);

  const quantityScore = calculateQuantityScore(
    donation.quantity,
    requirement.quantityNeeded,
    requirement.quantityReceived
  );

  const trustScore = calculateTrustScore(ngo.trustScore);

  const rawScore =
    0.3 * categoryScore +
    0.25 * urgencyScore +
    0.2 * distanceScore +
    0.15 * quantityScore +
    0.1 * trustScore;

  const finalMatchScore = Math.round(rawScore * 10) / 10;

  // Generate dynamic algorithmic explanation from computed metrics
  const reasons: string[] = [];

  if (categoryScore >= 95) {
    reasons.push(`Same donation category (${requirement.category})`);
  } else if (categoryScore >= 80) {
    reasons.push(`Compatible item specification (${requirement.itemName})`);
  }

  if (urgencyScore === 100) {
    reasons.push(`Critical urgent requirement needing immediate relief`);
  } else if (urgencyScore >= 80) {
    reasons.push(`High priority community requirement`);
  } else {
    reasons.push(`${requirement.urgency.toLowerCase()} priority requirement`);
  }

  if (distanceKm <= 5) {
    reasons.push(`Extremely close NGO location (${distanceKm.toFixed(1)} km away)`);
  } else if (distanceKm <= 15) {
    reasons.push(`Nearby NGO within convenient dispatch reach (${distanceKm.toFixed(1)} km away)`);
  } else {
    reasons.push(`Accessible regional distance (${distanceKm.toFixed(1)} km away)`);
  }

  const remainingNeeded = Math.max(0, requirement.quantityNeeded - requirement.quantityReceived);
  if (donation.quantity >= remainingNeeded) {
    reasons.push(`Donation can completely fulfill requirement (${remainingNeeded} units)`);
  } else {
    const pct = Math.round((donation.quantity / remainingNeeded) * 100);
    reasons.push(`Donation provides substantial relief (${pct}% of needed quantity)`);
  }

  if (trustScore >= 80) {
    reasons.push(`High NGO trust rating (${trustScore}/100) with verified records`);
  } else {
    reasons.push(`Registered platform partner (${trustScore}/100 trust rating)`);
  }

  return {
    categoryScore,
    urgencyScore,
    distanceScore,
    quantityScore,
    trustScore,
    finalMatchScore,
    distanceKm,
    reasons,
  };
}

