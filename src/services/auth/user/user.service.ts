import { User, UserDocument } from "../../../models/auth/user/user.model";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../errors/error.base";
import { HttpStatusCode } from "../../../errors/types/HttpStatusCode";
import { createServiceResponse } from "../../../util/apiHelpers";

class UserResponse {
    firstname: string = null;
    lastname: string = null;
    email: string = null;
}

export const emailSignupService = async (req: Request, res: Response, next: NextFunction): Promise<any> => {

    const newUser = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password
    });

    const users = await User.find({ email: req.body.email });
    if (users.length) {
        throw new AppError(HttpStatusCode.Conflict, "User already exists with this email!");
    }
    const result = await newUser.save();

    return createServiceResponse((result as any)._doc, new UserResponse());
};

    // Somehow working
    // await User.findOne({ email: sreq.body.email }).then((data: UserDocument) => {
    //     throw new AppError(HttpStatusCode.BadRequest, `User with email ${req.body.email} already exists!`)
    // }).catch((error: NativeError) => {
    //     throw new AppError(HttpStatusCode.BadRequest, error.message)
    // })

    // user.save().then((data: UserDocument) => {
    //     return data
    // }).catch((error: NativeError) => {
    //     throw new AppError(HttpStatusCode.BadRequest, error.message)
    // })

    // user.save((err, result) => {
    //     if (err) {
    //         throw new AppError(HttpStatusCode.Conflict, 'Error while saving user details!')
    //     }
    //     return result;
    // });