import mongoose, { Document, Model, Schema } from "mongoose";

export interface IImpactRecord extends Document {
  donationId: string;
  ngoId: mongoose.Types.ObjectId;
  ngoName: string;
  donorId?: mongoose.Types.ObjectId;
  itemsReceived: number;
  itemsDistributed: number;
  beneficiaries: number;
  description: string;
  proofImageUrl?: string;
  verified: boolean;
  verifiedAt?: Date;
  verifiedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ImpactRecordSchema = new Schema<IImpactRecord>(
  {
    donationId: {
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
    donorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    itemsReceived: {
      type: Number,
      required: true,
      min: 1,
    },
    itemsDistributed: {
      type: Number,
      required: true,
      min: 0,
    },
    beneficiaries: {
      type: Number,
      required: true,
      min: 1,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    proofImageUrl: {
      type: String,
      default: "",
    },
    verified: {
      type: Boolean,
      default: false,
      index: true,
    },
    verifiedAt: {
      type: Date,
    },
    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const ImpactRecord: Model<IImpactRecord> =
  mongoose.models.ImpactRecord || mongoose.model<IImpactRecord>("ImpactRecord", ImpactRecordSchema);

export default ImpactRecord;

