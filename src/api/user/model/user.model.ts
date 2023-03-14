import bcrypt from "bcrypt";
import mongoose, { Schema, Document } from "mongoose";
import { BCRYPT_SALT } from '../../../config/secrets';

export type UserDocument = Document & {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  isEmailVerified: boolean;
  authCode: string;

  comparePassword: (password: string) => { isMatch: boolean };
};

const userSchema = new Schema<UserDocument>(
  {
    firstname: String,
    lastname: String,
    email: { type: String, unique: true, required: true, lowercase: true },
    password: String,
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    authCode: {
      type: String,
      default: null,
    },
  },
  { timestamps: true, versionKey: false }
);

/**
 * Password hashing middleware.
 */
userSchema.pre("save", async function (next) {
  const user = this as UserDocument;

  // If password is changed, we again generate hash
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, Number(BCRYPT_SALT))
  }
  next();
});

/**
 * Password comparison method.
 */
userSchema.methods.comparePassword = async function (password: string) {
  let isMatch = await bcrypt.compare(password, this.password);
  return { isMatch };
};

export const User = mongoose.model<UserDocument>("User", userSchema, "user");
