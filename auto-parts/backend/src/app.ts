import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth";
import partsRoutes from "./routes/parts";

const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true, // allows cookies (HttpOnly)
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/parts", partsRoutes);

// Health check
app.get("/", (_req, res) => {
  res.json({ message: "Auto Parts API is running 🚗" });
});

export default app;
