import mongoose, { Schema, Document, Types } from "mongoose";
import { TransactionType } from "../../../enums";

export type TransactionDocument = Document & {
  type: keyof typeof TransactionType;
  amount: number;
  category: Types.ObjectId;
  description: string;
  wallet: Types.ObjectId;
  owner: Types.ObjectId;
  attachments?: any;
};

const transactionSchema = new Schema<TransactionDocument>(
  {
    type: { type: String, required: true, enum: TransactionType },
    amount: { type: Number, required: true },
    category: { type: Schema.Types.ObjectId, ref: "transactionCategory", required: true },
    description: { type: String, required: true },
    wallet: { type: Schema.Types.ObjectId, ref: "Wallet", required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    attachments: { type: Array<String>, required: false, default: [] },
  },
  { timestamps: true, versionKey: false }
);

export const Transaction = mongoose.model<TransactionDocument>("Transaction", transactionSchema, "transaction");
