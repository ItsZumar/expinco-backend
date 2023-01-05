import jwt, { JwtPayload } from 'jsonwebtoken';

export const signJWT = async (id: string): Promise<string> => {
    let token = await jwt.sign({ _id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
    return token
}

export const decodeJWT = async (token: string) => {
    let decode = await jwt.verify(token, process.env.JWT_SECRET);
    return decode;
}