import mongoose, { Schema, Document, Types } from "mongoose";
import { TransactionType } from "../../../enums";

export type AttachmentDocument = Document & {
  format: string;
  secureURL: string;
};

const attachmentSchema = new Schema<AttachmentDocument>(
  {
    format: String,
    secureURL: String,
  },
  { timestamps: true, versionKey: false }
);

export type TransactionDocument = Document & {
  type: keyof typeof TransactionType;
  amount: number;
  category: Types.ObjectId;
  description: string;
  wallet: Types.ObjectId;
  owner: Types.ObjectId;
  attachments: [AttachmentDocument];
  createdAt: Date;
};

const transactionSchema = new Schema<TransactionDocument>(
  {
    type: { type: String, required: true, enum: TransactionType },
    amount: { type: Number, required: true, default: 0 },
    category: { type: Schema.Types.ObjectId, ref: "TransactionCategory", required: true },
    description: { type: String, required: true, default: null },
    wallet: { type: Schema.Types.ObjectId, ref: "Wallet", required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    attachments: [attachmentSchema],
  },
  { timestamps: true, versionKey: false }
);

export const Transaction = mongoose.model<TransactionDocument>("Transaction", transactionSchema, "transaction");
