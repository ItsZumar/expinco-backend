import { User, UserDocument } from "../../models/user/user.model";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../../errors/error.base";
import { HttpStatusCode } from "../../errors/types/HttpStatusCode";
import { createServiceResponse } from "../../util/apiHelpers";
import { UserSignUpResponse, UserSignInResponse } from "./user.responses";

export const emailSignupService = async (req: Request, res: Response, next: NextFunction): Promise<UserDocument> => {
    const newUser = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password
    });
    const users = await User.find({ email: req.body.email });
    if (users.length) {
        next(new AppError(HttpStatusCode.Conflict, "User already exists with this email!"));
    }
    const result = await newUser.save();
    return result;
    // return createServiceResponse(result, new UserSignUpResponse());
};

export const emailSigninService = async (req: Request, res: Response, next: NextFunction): Promise<any> => {    
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        throw new AppError(HttpStatusCode.Conflict, "User doesn't exists with this email!");
    } else {
        return user.comparePassword(req.body.password, (err, isMatch) => {
            console.log("isMatch ==== ", isMatch);
            console.log("err ==== ", err);

            if (err) {
                console.log("here...");
                throw new AppError(HttpStatusCode.BadRequest, err.message);
            }
            else if (isMatch) {
                let mUser = { ...user }
                delete mUser.password
                return mUser;
            } else {
                throw new AppError(HttpStatusCode.Unauthorized, "Entered password is invalid");
            } 
        })
    }

    // return createServiceResponse(users, users);
    // return createServiceResponse(users, new UserSignInResponse());
};
