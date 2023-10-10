import mongoose, { Schema, Document, Types } from "mongoose";

export type FileStorageDocument = Document & {
  format: string;
  secureURL: string;
};

const fileStorageSchema = new Schema<FileStorageDocument>(
  {
    format: { type: String, required: true },
    secureURL: String,
  },
  { timestamps: true, versionKey: false }
);

export const FileStorage = mongoose.model<FileStorageDocument>("FileStorage", fileStorageSchema, "fileStorage");
