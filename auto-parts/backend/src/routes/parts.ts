import express from 'express';
import { prisma } from '../db';
import { partSchema } from '../utils/validators';
import { requireAuth } from '../middleware/auth';


const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const parts = await prisma.parts.findMany({ orderBy: { createdAt: 'desc' } });
        res.json(parts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const part = await prisma.parts.findUnique({ where: { id } });
        if (!part) return res.status(404).json({ message: 'Not found' });
        res.json(part);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});


router.post('/', requireAuth, async (req, res) => {
    try {
        const body = partSchema.parse(req.body);
        const created = await prisma.parts.create({
            data: {
                name: body.name,
                brand: body.brand,
                price: body.price,
                stock: body.stock,
                category: body.category
            }
        });
        res.status(201).json(created);
    } catch (err: any) {
        if (err?.issues) return res.status(400).json({ errors: err.issues });
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});


router.put('/:id', requireAuth, async (req, res) => {
    try {
        const id = Number(req.params.id);
        const body = partSchema.partial().parse(req.body);
        const updated = await prisma.parts.update({ where: { id }, data: body as any });
        res.json(updated);
    } catch (err: any) {
        if (err?.code === 'P2025') return res.status(404).json({ message: 'Not found' });
        if (err?.issues) return res.status(400).json({ errors: err.issues });
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});


router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const id = Number(req.params.id);
        await prisma.parts.delete({ where: { id } });
        res.json({ ok: true });
    } catch (err: any) {
        if (err?.code === 'P2025') return res.status(404).json({ message: 'Not found' });
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});


export default router;