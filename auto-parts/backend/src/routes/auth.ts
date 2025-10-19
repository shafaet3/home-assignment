import express from 'express';
import bcrypt from 'bcrypt';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { prisma } from '../db';
import { registerSchema, loginSchema } from '../utils/validators';
import env from '../env';
import { AuthRequest, requireAuth } from '../middleware/auth';


const router = express.Router();


router.post('/register', async (req, res) => {
    try {
        const body = registerSchema.parse(req.body);
        const exists = await prisma.users.findUnique({ where: { email: body.email } });
        if (exists) return res.status(400).json({ message: 'Email already used' });
        const hash = await bcrypt.hash(body.password, 10);
        const user = await prisma.users.create({ data: { name: body.name, email: body.email, passwordHash: hash } });
        return res.json({ id: user.id, name: user.name, email: user.email });
    } catch (err: any) {
        if (err?.issues) return res.status(400).json({ errors: err.issues });
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
});


router.post('/login', async (req, res) => {
    try {
        const body = loginSchema.parse(req.body);
        const user = await prisma.users.findUnique({ where: { email: body.email } });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });
        const ok = await bcrypt.compare(body.password, user.passwordHash);
        if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

        const payload = { userId: user.id };
        const secret = env.JWT_SECRET as Secret;
        const expiresIn = (process.env.JWT_EXPIRES_IN || "7d") as SignOptions["expiresIn"];
        const options: SignOptions = { expiresIn };
        const token = jwt.sign(payload, secret, options);
       


        // set httpOnly cookie
        res.cookie(env.COOKIE_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
        });
        return res.json({ user: { id: user.id, name: user.name, email: user.email } });
    } catch (err: any) {
        if (err?.issues) return res.status(400).json({ errors: err.issues });
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
});

router.get('/isLoggedIn', requireAuth, async (req: AuthRequest, res) => {
    try {
        const user = await prisma.users.findUnique({
            where: { id: req.userId },
            select: { id: true, name: true, email: true }
        });

        if (!user) return res.status(401).json({ message: 'User not found' });

        return res.json({ user });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie(env.COOKIE_NAME, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
    return res.json({ ok: true });
});


export default router;