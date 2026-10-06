import mongoose, { Document, Model, Schema } from "mongoose";

export type UrgencyLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type RequirementStatus = "OPEN" | "FULFILLED" | "CLOSED";

export interface IRequirement extends Document {
  requirementId: string;
  ngoId: mongoose.Types.ObjectId;
  ngoName: string;
  itemName: string;
  category: string;
  quantityNeeded: number;
  quantityReceived: number;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  urgency: UrgencyLevel;
  status: RequirementStatus;
  createdAt: Date;
  updatedAt: Date;
}

const RequirementSchema = new Schema<IRequirement>(
  {
    requirementId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    ngoId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ngoName: {
      type: String,
      required: true,
      trim: true,
    },
    itemName: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    quantityNeeded: {
      type: Number,
      required: [true, "Quantity needed is required"],
      min: 1,
    },
    quantityReceived: {
      type: Number,
      default: 0,
      min: 0,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    urgency: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "MEDIUM",
      required: true,
    },
    status: {
      type: String,
      enum: ["OPEN", "FULFILLED", "CLOSED"],
      default: "OPEN",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Requirement: Model<IRequirement> =
  mongoose.models.Requirement || mongoose.model<IRequirement>("Requirement", RequirementSchema);

export default Requirement;

