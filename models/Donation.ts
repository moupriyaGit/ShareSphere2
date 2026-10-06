import mongoose, { Document, Model, Schema } from "mongoose";

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

export interface IStatusLog {
  status: DonationStatus;
  timestamp: Date;
  updatedBy?: mongoose.Types.ObjectId;
  notes?: string;
}

export interface IDonation extends Document {
  donationId: string;
  donorId: mongoose.Types.ObjectId;
  donorName?: string;
  itemName: string;
  category: string;
  quantity: number;
  remainingQuantity: number;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  status: DonationStatus;
  statusHistory: IStatusLog[];
  assignedNgoId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const DonationSchema = new Schema<IDonation>(
  {
    donationId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    donorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    donorName: {
      type: String,
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
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: 1,
    },
    remainingQuantity: {
      type: Number,
      required: true,
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
    status: {
      type: String,
      enum: DONATION_STATUS_SEQUENCE,
      default: "DONATED",
      required: true,
    },
    assignedNgoId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    statusHistory: [
      {
        status: {
          type: String,
          enum: DONATION_STATUS_SEQUENCE,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        updatedBy: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        notes: {
          type: String,
          default: "",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Donation: Model<IDonation> =
  mongoose.models.Donation || mongoose.model<IDonation>("Donation", DonationSchema);

export default Donation;

