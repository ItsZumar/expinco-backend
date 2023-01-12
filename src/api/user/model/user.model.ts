import mongoose, { Schema, Document, Error } from "mongoose";
import bcrypt from "bcrypt";

type comparePasswordFunction = (password: string) => { isMatch: boolean };

export type UserDocument = Document & {
  firstname: string;
  lastname: string;
  email: string;
  password: string;

  isEmailVerified: boolean;
  authCode: string;

  comparePassword: comparePasswordFunction;
};

const userSchema = new Schema<UserDocument>(
  {
    firstname: String,
    lastname: String,
    email: { type: String, unique: true, required: true },
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
 * Password hash middleware.
 */
userSchema.pre("save", async function(next) {
  const user = this as UserDocument;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 5)
  }
  next();
});

const comparePassword = async function (password: string) {
  let isMatch = await bcrypt.compare(password, this.password);
  return { isMatch };
};

userSchema.methods.comparePassword = comparePassword;

export const User = mongoose.model<UserDocument>("User", userSchema, "user");
