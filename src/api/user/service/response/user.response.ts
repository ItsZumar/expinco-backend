import { UserDocument } from "../../model/user.model";

export interface EmailSignUpI {
    token: string
    user: UserDocument
}

export interface EmailSignInI {
    user: UserDocument
    token: string
}

export interface ForgetPasswordI {
    message: string
}

export interface ChangePasswordI {
    message: string
}

export interface VerifyEmailI {
    message: string
}

export interface ResendVerifyEmailI {
    message: string
}

export interface ResetPasswordI {
    message: string
}