import { User, UserDocument } from "../../models/user/user.model";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../../errors/error.base";
import { HttpStatusCode } from "../../errors/types/HttpStatusCode";
import { createServiceResponse, validateAPI } from "../../util/apiHelpers";
import { UserResponse } from "./responses/UserResponse";

export const emailSignupService = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const newUser = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password
    });

    const users: UserDocument[] = await User.find({ email: req.body.email });
    if (users.length) {
        // Check if we got any data stored in db
        throw new AppError(HttpStatusCode.Conflict, "User already exists with this email!");
    }
    const result: UserDocument = await newUser.save();
    return createServiceResponse(result, new UserResponse());
};
