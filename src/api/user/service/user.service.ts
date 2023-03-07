import { User, UserDocument } from "../model/user.model";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../errors/error.base";
import { HttpStatusCode } from "../../../errors/types/HttpStatusCode";
import { signJWT } from "../../../util/jwt";
import { sendEmailNotification } from "../../../config/sendGridMail";
import { generateRandomDigits } from '../../../util/common'

export const emailSignupService = async (req: Request, res: Response, next: NextFunction): Promise<{ token: string, user: UserDocument }> => {
    const usersInDB = await User.find({ email: req.body.email });

    if (usersInDB.length) {
        next(new AppError(HttpStatusCode.Conflict, "User already exists with this email!"));
    }
    const newUser = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password
    });

    const user = await newUser.save();
    const token = await signJWT(user._id)

    // Getting authCode by generating random digits
    let authCode = await generateRandomDigits(6)

    // Saving user object with authCode to match later during email verification process
    user.authCode = authCode + ""
    await user.save()

    // Now, sending an email notification for email verification
    await sendEmailNotification({
        to: user.email,
        subject: "VERIFY YOUR EMAIL",
        textMessage: `Your auth code is ${authCode}.`
    })

    // Making these undefined will hide these from getting into response 
    user.password = undefined;
    user.authCode = undefined;

    return { token, user }
};

export const emailSigninService = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const user = await User.findOne({ email: req.body.email })
    const token = await signJWT(user._id)

    if (!user) {
        throw new AppError(HttpStatusCode.BadRequest, "Either email or password is invalid");
    } else {
        let { isMatch } = await user.comparePassword(req.body.password);

        if (isMatch) {
            let mUser = { ...user.toJSON() };
            mUser.password = undefined;
            mUser.authCode = undefined;
            return { user: mUser, token };
        }
        else {
            throw new AppError(HttpStatusCode.BadRequest, "Either email or password is invalid");
        }
    }
};

export const forgotPasswordService = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
        throw new AppError(HttpStatusCode.BadRequest, "User doesn't exists with this email");
    } else {

        // Getting authCode by generating random digits
        let authCode = await generateRandomDigits(6)

        // Saving user object with authCode to match later during email verification process
        user.authCode = authCode + ""
        user.isEmailVerified = false;
        await user.save()

        // Now, sending an email notification for email verification
        await sendEmailNotification({
            to: user.email,
            subject: "Expinco Email Verification",
            textMessage: `Your auth code is ${authCode}.`
        })

        // Send OTP Code to user email
        return {
            message: "Check your email for OTP Code."
        }
    }
};

export const changePasswordService = async (req: Request, res: Response, next: NextFunction): Promise<any> => {

    console.log("req.user.email ", req.user.email)

    const user = await User.findOne({ email: req.user.email })

    console.log("user === ", user)

    if (!user) {
        throw new AppError(HttpStatusCode.BadRequest, "User doesn't exists with this email");
    } else {
        let {isMatch} = await user.comparePassword(req.body.oldPassword)

        if (!isMatch) {
            throw new AppError(HttpStatusCode.NotAcceptable, "Your old password is wrong.");
        }

        user.password = req.body.newPassword;
        await user.save()

        // Send OTP Code to user email
        return {
            message: "Your account password has been changed."
        }
    }
};

export const verifyEmailService = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { email, authCode } = req.body
    const user = await User.findOne({ email })

    if (!user) {
        throw new AppError(HttpStatusCode.BadRequest, "User doesn't exists with this email");
    } else {

        if (user.isEmailVerified) {
            throw new AppError(HttpStatusCode.Conflict, "This email is already verified!");
        }

        if (user.authCode === authCode) {
            user.isEmailVerified = true
            user.authCode = undefined
            await user.save()
        } else {
            throw new AppError(HttpStatusCode.BadRequest, "AuthCode is invalid");
        }
        return {
            message: "Your email has been verified! Please login in!"
        }
    }
};

export const resendVerifyEmailService = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { email } = req.body
    const user = await User.findOne({ email })

    if (!user) {
        throw new AppError(HttpStatusCode.BadRequest, "User doesn't exists with this email");
    } else {

        if (user.isEmailVerified) {
            throw new AppError(HttpStatusCode.Conflict, "This email is already verified!");
        }

        // Getting authCode by generating random digits
        let authCode = await generateRandomDigits(6)

        // Saving user object with authCode to match later during email verification process
        user.authCode = authCode + ""
        await user.save()

        // Now, sending an email notification for email verification
        await sendEmailNotification({
            to: user.email,
            subject: "EXPINCO Email Verification",
            textMessage: `Your auth code is ${authCode}.`
        })

        return {
            message: "Auth code has been send. Check your email!"
        }
    }
};

export const resetPasswordService = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
        throw new AppError(HttpStatusCode.BadRequest, "User doesn't exists with this email");
    } else {

        // Getting authCode by generating random digits
        let authCode = await generateRandomDigits(6)

        // Saving user object with authCode to match later during email verification process
        user.authCode = authCode + ""
        user.isEmailVerified = false;
        await user.save()

        // Now, sending an email notification for email verification
        await sendEmailNotification({
            to: user.email,
            subject: "Expinco Email Verification",
            textMessage: `Your auth code is ${authCode}.`
        })

        // Send OTP Code to user email
        return {
            message: "Check your email for OTP Code."
        }
    }
};
