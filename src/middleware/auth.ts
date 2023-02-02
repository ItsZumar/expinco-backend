import { AppError } from "../errors/error.base";
import { HttpStatusCode } from "../errors/types/HttpStatusCode";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../util/apiHelpers";
import { decodeJWT } from "../util/jwt";
import { User } from "../api/user/model/user.model";

export const ProtectedRoute = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        next(new AppError(HttpStatusCode.Unauthorized, "You are not logged in! Please login to access this!"));
    }

    // 2) Verification token
    const decodedUser = decodeJWT(token)
    console.log("decoded ++===++ ", decodedUser);

    // 3) Check if user still exists (if deleted from DB or not)
    const currentUser = await User.findById(decodedUser)
    if (!currentUser) {
        next(new AppError(HttpStatusCode.Unauthorized, "The user belonging to the token no longer exists."));
    }

    // 4) Check if user changed password after the token was issued
    // iat--> issued at
    // if (currentUser.changedPasswordAfter(decoded.iat)) {
    //     next(new AppError(HttpStatusCode.Unauthorized, "User recently changed password! Please login again."));
    // }

    // GRANT ACCESS TO THE PROTECTED ROUTE
    req.user = currentUser; // storing user to the req
    next();
});