import express from "express";
import { Request } from "express";
import { Part } from "../types/part";
import multer from "multer";
import path from "path";
import fs from "fs";
import { prisma } from "../db";
import { partSchema } from "../utils/validators";
import { requireAuth } from "../middleware/auth";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}


const router = express.Router();

// === Ensure uploads directory exists ===
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// === Multer Setup ===
const storage = multer.diskStorage({
  destination: (_req: Express.Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, uploadDir);
  },
  filename: (_req: Express.Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// === ROUTES ===

// Get all parts
router.get("/", async (req, res) => {
  try {
    const parts = await prisma.parts.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Normalize image URLs for frontend
    // const normalized = parts.map((p: Part)=> ({
    //   ...p,
    //   imageUrl: p.image || "/uploads/placeholder.png",
    // }));
    const normalized: Part[] = parts.map((p: Part) => ({
      id: p.id,
    name: p.name,
    brand: p.brand,               // keep null as null
    price: p.price,       // Convert Decimal → number
    stock: p.stock,
    category: p.category,         // keep null as null
    imageUrl: p.imageUrl,            // rename image → imageUrl
    createdAt: p.createdAt,
    }));




    res.json(normalized);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get a single part by ID
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const part = await prisma.parts.findUnique({
      where: { id },
    });

    if (!part) return res.status(404).json({ message: "Part not found" });

    res.json({
      ...part,
      imageUrl: part.imageUrl|| "/uploads/placeholder.png",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Create part with image
router.post("/", requireAuth, upload.single("image"), async (req, res) => {
  try {
    const r = req as MulterRequest;
    const body = JSON.parse(r.body.data);
    const parsed = partSchema.parse(body);

    const imageUrl = r.file ? `/uploads/${r.file.filename}` : null;

    const created = await prisma.parts.create({
      data: {
        name: parsed.name,
        brand: parsed.brand,
        price: parsed.price,
        stock: parsed.stock,
        category: parsed.category,
        imageUrl: imageUrl,
      },
    });

    res.status(201).json({
      ...created,
      imageUrl:
        imageUrl ||
        `${process.env.API_BASE_URL || "http://localhost:5000"}/uploads/placeholder.png`,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update part (optional image)
router.put("/:id", requireAuth, upload.single("image"), async (req, res) => {
  try {
    const r = req as MulterRequest;
    const id = Number(r.params.id);
    const body = JSON.parse(r.body.data || "{}");

    const imageUrl = r.file ? `/uploads/${r.file.filename}` : undefined;

    const updated = await prisma.parts.update({
      where: { id },
      data: { ...body, ...(imageUrl ? { image: imageUrl } : {}) },
    });

    res.json({
      ...updated,
      imageUrl:
        imageUrl ||
        `${process.env.API_BASE_URL || "http://localhost:5000"}${updated.imageUrl ||
        "/uploads/placeholder.png"}`,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete part
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.parts.delete({ where: { id } });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
