import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import env from '../env';


export interface AuthRequest extends Request {
    userId?: number;
}


export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const token = req.cookies?.[env.COOKIE_NAME];
        if (!token) return res.status(401).json({ message: 'Not authenticated' });
        const payload = jwt.verify(token, env.JWT_SECRET) as any;
        req.userId = payload.userId;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}