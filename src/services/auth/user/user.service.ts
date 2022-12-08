import { User, UserDocument } from "../../../models/auth/user/user.model";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../errors/error.base";
import { HttpStatusCode } from "../../../errors/types/HttpStatusCode";

export const emailSignupService = (req: Request, res: Response, next: NextFunction): Promise<any> => {

    const user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password
    });

    let userData = null
    User.findOne({ email: req.body.email }, (err: NativeError, existingUser: UserDocument) => {
        if (err) { throw new AppError(HttpStatusCode.BadRequest, "bla bla 1 error") }

        if (existingUser) {
            throw new AppError(HttpStatusCode.Conflict, 'User already exists with this email!')
        }

        user.save((err, result) => {
            if (err) { throw new AppError(HttpStatusCode.BadRequest, "bla bla 2 error") }
            console.log("result ==== ", result)
            userData = result;
            // return result;
        });
    });

    if (userData) {
        return userData;
    }
};

    // Somehow working
    // await User.findOne({ email: req.body.email }).then((data: UserDocument) => {
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