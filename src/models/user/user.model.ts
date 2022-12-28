import mongoose, { Schema, Document, Error } from "mongoose";
import bcrypt from "bcrypt";
import { AppError } from "../../errors/error.base";
import { HttpStatusCode } from "../../errors/types/HttpStatusCode";

type comparePasswordFunction = (password: string, cb: (err: any, isMatch: any) => any) => any;

export type UserDocument = Document & {
  firstname: string;
  lastname: string;
  email: string;
  password: string;

  comparePassword: comparePasswordFunction;
};

const userSchema = new Schema<UserDocument>(
  {
    firstname: String,
    lastname: String,
    email: { type: String, unique: true, required: true },
    password: String,
  },
  { timestamps: true, versionKey: false }
);

/**
 * Password hash middleware.
 */
userSchema.pre("save", function save(next) {
  const user = this as UserDocument;

  if (!user.isModified("password")) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, (err: Error, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

const comparePassword: comparePasswordFunction = function (password, cb) {
  bcrypt.compare(password, this.password, (err: mongoose.Error, isMatch: boolean) => {
      cb(err, isMatch);
  });
};

userSchema.methods.comparePassword = comparePassword;

export const User = mongoose.model<UserDocument>("User", userSchema, "user");
