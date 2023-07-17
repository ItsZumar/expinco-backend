import mongoose, { Schema, Document } from "mongoose";

export type TransactionCategoryDocument = Document & {
  name: string;
  icon: string;
};

const transactionCategorySchema = new Schema<TransactionCategoryDocument>(
  {
    name: { type: String, required: true, unique: true },
    icon: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

export const TransactionCategory = mongoose.model<TransactionCategoryDocument>(
  "TransactionCategory",
  transactionCategorySchema,
  "transactionCategory"
);
