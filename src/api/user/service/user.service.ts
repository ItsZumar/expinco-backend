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

    if (!user) {
        throw new AppError(HttpStatusCode.BadRequest, "Either email or password is invalid");
    } else {
        let { isMatch } = await user.comparePassword(req.body.password);

        if (isMatch) {
            let _User = { ...user.toJSON() };
            _User.password = undefined;
            _User.authCode = undefined;
            return _User;
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

        // Generate OTP Code
        let otpCode = "123456"

        // Saving the OTP Code for checking later
        user.authCode = otpCode;
        await user.save()

        // Send OTP Code to user email
        return {
            message: "Check your email for OTP Code."
        }
    }
};

export const verifyEmailService = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { email, authCode } = req.body
    const user = await User.findOne({ email })

    if (!user) {
        throw new AppError(HttpStatusCode.BadRequest, "User doesn't exists with this email");
    } else {
        if (user.authCode === authCode) {
            user.isEmailVerified = true
            user.authCode = undefined
            await user.save()
        } else {
            throw new AppError(HttpStatusCode.BadRequest, "AuthCode is invalid");
        }
        return {
            message: "Your email has been verified!"
        }
    }
};
