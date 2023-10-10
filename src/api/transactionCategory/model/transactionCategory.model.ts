import mongoose, { Schema, Document } from "mongoose";

export type IconDocument = Document & {
  format: string;
  secureURL: string;
};

const iconSchema = new Schema<IconDocument>(
  {
    format: String,
    secureURL: String,
  },
  { timestamps: true, versionKey: false }
);

export type TransactionCategoryDocument = Document & {
  name: string;
  icon: IconDocument;
};

const transactionCategorySchema = new Schema<TransactionCategoryDocument>(
  {
    name: { type: String, required: true, unique: true },
    icon: iconSchema,
  },
  { timestamps: true, versionKey: false }
);

export const TransactionCategory = mongoose.model<TransactionCategoryDocument>(
  "TransactionCategory",
  transactionCategorySchema,
  "transactionCategory"
);
