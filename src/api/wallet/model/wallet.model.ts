import mongoose, { Schema, Document, Types } from "mongoose";

export type WalletDocument = Document & {
  amount: number;
  name: string;
  type: Types.ObjectId;
};

const walletSchema = new Schema<WalletDocument>(
  {
    amount: { required: true, type: Number },
    name: { type: String, required: true },
    type: { type: Schema.Types.ObjectId, ref: "WalletType" },
  },
  { timestamps: true, versionKey: false }
);

export const Wallet = mongoose.model<WalletDocument>("Wallet", walletSchema, "wallet");
