import mongoose, { Schema, Document, Types } from "mongoose";

export type WalletTypeDocument = Document & {
  name: string;
  icon?: string | null;
};

const walletTypeSchema = new Schema<WalletTypeDocument>(
  {
    name: { type: String, required: true },
    icon: { type: String },
  },
  { timestamps: true, versionKey: false }
);

export const WalletType = mongoose.model<WalletTypeDocument>("WalletType", walletTypeSchema, "walletType");
