export interface TrustScoreFactors {
  baseScore: number;
  completedDonationsCount: number;
  verifiedImpactCount: number;
  receivedDonationsCount: number;
  totalDonationBonus: number;
  impactBonus: number;
  receivingBonus: number;
  computedTrustScore: number;
  reasons: string[];
}

/**
 * Calculates a rule-based NGO trust score strictly from verifiable database platform actions.
 * Base score: 50.
 * +5 per successfully distributed/completed donation
 * +10 per verified impact report
 * +5 per accepted/received donation batch
 * Range: 0 to 100
 */
export function calculateNgoTrustScore(
  completedDonationsCount: number = 0,
  verifiedImpactCount: number = 0,
  receivedDonationsCount: number = 0
): TrustScoreFactors {
  const baseScore = 50;
  const totalDonationBonus = Math.min(25, completedDonationsCount * 5);
  const impactBonus = Math.min(30, verifiedImpactCount * 10);
  const receivingBonus = Math.min(15, receivedDonationsCount * 5);

  const rawScore = baseScore + totalDonationBonus + impactBonus + receivingBonus;
  const computedTrustScore = Math.max(0, Math.min(100, Math.round(rawScore)));

  const reasons: string[] = [
    `Baseline platform verification (+${baseScore})`,
  ];

  if (completedDonationsCount > 0) {
    reasons.push(
      `${completedDonationsCount} completed donation lifecycle distribution(s) (+${totalDonationBonus})`
    );
  }

  if (verifiedImpactCount > 0) {
    reasons.push(
      `${verifiedImpactCount} verified community impact report(s) (+${impactBonus})`
    );
  }

  if (receivedDonationsCount > 0) {
    reasons.push(
      `${receivedDonationsCount} successfully received consignment(s) (+${receivingBonus})`
    );
  }

  return {
    baseScore,
    completedDonationsCount,
    verifiedImpactCount,
    receivedDonationsCount,
    totalDonationBonus,
    impactBonus,
    receivingBonus,
    computedTrustScore,
    reasons,
  };
}

