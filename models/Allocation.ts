import mongoose, { Document, Model, Schema } from "mongoose";

export interface IAllocation extends Document {
  donationId: string;
  requirementId: string;
  ngoId: mongoose.Types.ObjectId;
  ngoName: string;
  allocatedQuantity: number;
  matchScore: number;
  allocationReason: string;
  createdAt: Date;
  updatedAt: Date;
}

const AllocationSchema = new Schema<IAllocation>(
  {
    donationId: {
      type: String,
      required: true,
      index: true,
    },
    requirementId: {
      type: String,
      required: true,
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
    allocatedQuantity: {
      type: Number,
      required: true,
      min: 1,
    },
    matchScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    allocationReason: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Allocation: Model<IAllocation> =
  mongoose.models.Allocation || mongoose.model<IAllocation>("Allocation", AllocationSchema);

export default Allocation;

