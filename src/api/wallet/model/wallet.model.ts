import mongoose, { Schema, Document, Types } from "mongoose";

export type WalletDocument = Document & {
  name: string;
  amount: number;
  // walletType: Types.ObjectId;
  owner: Types.ObjectId;
};

const walletSchema = new Schema<WalletDocument>(
  {
    amount: { required: true, type: Number },
    name: { type: String, required: true },
    // walletType: { type: Schema.Types.ObjectId, ref: "WalletType", required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true, versionKey: false }
);

export const Wallet = mongoose.model<WalletDocument>("Wallet", walletSchema, "wallet");
