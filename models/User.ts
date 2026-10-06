import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: "donor" | "ngo" | "admin";
  location: string;
  latitude: number;
  longitude: number;
  trustScore: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: ["donor", "ngo", "admin"],
      default: "donor",
      required: true,
    },
    location: {
      type: String,
      default: "Local Area",
      trim: true,
    },
    latitude: {
      type: Number,
      default: 28.6139, // Default fallback coordinates (e.g. New Delhi / central)
    },
    longitude: {
      type: Number,
      default: 77.209,
    },
    trustScore: {
      type: Number,
      default: 50,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent re-compilation in development mode hot-reloading
export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;

