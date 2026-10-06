export type DonationStatus =
  | "DONATED"
  | "ACCEPTED"
  | "PICKUP_SCHEDULED"
  | "COLLECTED"
  | "DELIVERED"
  | "DISTRIBUTED";

export const DONATION_STATUS_SEQUENCE: DonationStatus[] = [
  "DONATED",
  "ACCEPTED",
  "PICKUP_SCHEDULED",
  "COLLECTED",
  "DELIVERED",
  "DISTRIBUTED",
];

export type UrgencyLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type RequirementStatus = "OPEN" | "FULFILLED" | "CLOSED";
export type UserRole = "donor" | "ngo" | "admin";

