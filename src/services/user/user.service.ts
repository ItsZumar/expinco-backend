import { User, UserDocument } from "../../models/user/user.model";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../../errors/error.base";
import { HttpStatusCode } from "../../errors/types/HttpStatusCode";
import { createServiceResponse } from "../../util/apiHelpers";
import { UserSignUpResponse, UserSignInResponse } from './user.responses';

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
        throw new AppError(HttpStatusCode.BadRequest, "Either email or password is invalid");
    } else {
        let { isMatch } = await user.comparePassword(req.body.password);
        if (isMatch) {
            let _User = { ...user.toJSON() };
            delete _User.password;
            return _User;
        } else {
            throw new AppError(HttpStatusCode.BadRequest, "Either email or password is invalid");
        }
    }

};
