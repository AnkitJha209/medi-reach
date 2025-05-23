import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config();

export interface AuthRequest extends Request {
    user?: jwt.JwtPayload
}

export const verifyToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            res.status(401).json({ message: 'No token provided' });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
        
        if (!decoded) {
            res.status(401).json({ message: 'Invalid token' });
            return;
        }
        console.log(decoded.userId);
        // Extract user information from token
        req.user = {
            id: decoded.userId,
            email: decoded.email,
            name: decoded.name,
            address: decoded.address
        };

        next();

    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
        return;
    }

}