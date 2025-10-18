import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { prisma } from "../db";
import { partSchema } from "../utils/validators";
import { requireAuth } from "../middleware/auth";

const router = express.Router();

// === Ensure uploads directory exists ===
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// === Multer Setup ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
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
    const normalized = parts.map((p) => ({
      ...p,
      imageUrl: p.image || "/uploads/placeholder.png",
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
      imageUrl: part.image || "/uploads/placeholder.png",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// Create part with image
router.post("/", requireAuth, upload.single("image"), async (req, res) => {
  try {
    const body = JSON.parse(req.body.data);
    const parsed = partSchema.parse(body);

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const created = await prisma.parts.create({
      data: {
        name: parsed.name,
        brand: parsed.brand,
        price: parsed.price,
        stock: parsed.stock,
        category: parsed.category,
        image: imageUrl,
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
    const id = Number(req.params.id);
    const body = JSON.parse(req.body.data || "{}");

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    const updated = await prisma.parts.update({
      where: { id },
      data: { ...body, ...(imageUrl ? { image: imageUrl } : {}) },
    });

    res.json({
      ...updated,
      imageUrl:
        imageUrl ||
        `${process.env.API_BASE_URL || "http://localhost:5000"}${updated.image ||
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
