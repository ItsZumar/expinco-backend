import { NextFunction, Request, Response } from "express";
import { check } from "express-validator";
import { apiOk, apiValidation, catchAsync } from "../../../util/apiHelpers";
import {
  emailSignupService,
  emailSigninService,
  forgotPasswordService,
  verifyEmailService,
  resendVerifyEmailService,
  changePasswordService,
  resetPasswordService,
  getProfileService,
  updateProfileService,
} from "../service/user.service";

export const emailSignup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  await check("firstname", "Firstname is not valid").isString().run(req);
  await check("lastname", "Lastname is not valid").isString().run(req);
  await check("email", "Email is not valid").isEmail().run(req);
  await check("password", "Password must be at least 8 characters long").isLength({ min: 8 }).run(req);

  apiValidation(req, res);
  const result = await emailSignupService(req, res, next);
  apiOk(res, result);
});

export const emailSignin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  await check("email", "Email is not valid").isEmail().run(req);

  apiValidation(req, res);
  const result = await emailSigninService(req, res, next);
  apiOk(res, result);
});

export const verifyEmail = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  await check("email", "Email is not valid").isEmail().run(req);

  apiValidation(req, res);
  const result = await verifyEmailService(req, res, next);
  apiOk(res, result);
});

export const resendVerifyEmail = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  await check("email", "Email is not valid").isEmail().run(req);

  apiValidation(req, res);
  const result = await resendVerifyEmailService(req, res, next);
  apiOk(res, result);
});

export const forgotPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  await check("email", "Please enter your valid email").isEmail().run(req);

  apiValidation(req, res);
  const result = await forgotPasswordService(req, res, next);
  apiOk(res, result);
});

export const changePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  await check("oldPassword", "Please enter your old password.").isString().run(req);
  await check("newPassword", "Please enter a new password").isString().run(req);

  apiValidation(req, res);
  const result = await changePasswordService(req, res, next);
  apiOk(res, result);
});

export const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  await check("email", "Email is not valid").isEmail().run(req);
  await check("authCode", "Auth code is missing").isString().run(req);
  await check("newPassword", "New password is missing").isString().run(req);

  apiValidation(req, res);
  const result = await resetPasswordService(req, res, next);
  apiOk(res, result);
});

export const getProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  apiValidation(req, res);
  const result = await getProfileService(req, res, next);
  apiOk(res, result);
});

export const updateProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  await check("firstname", "Firstname is not valid").isString().optional().run(req);
  await check("lastname", "Lastname is not valid").isString().optional().run(req);
  await check("email", "Email is not valid").isEmail().optional().run(req);
  await check("displayPicture", "Entered displayPicture source is not valid").isString().optional().run(req);

  apiValidation(req, res);
  const result = await updateProfileService(req, res, next);
  apiOk(res, result);
});
