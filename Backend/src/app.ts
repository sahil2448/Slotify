// src/app.ts
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import slotsRouter from "./routes/slots";

const app = express();

app.use(cors({
  origin: [
    process.env.FRONTEND_ORIGIN || "http://localhost:5173",
    "https://slotify-five.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true
}));


app.use(express.json());
app.use("/slots", slotsRouter);

app.get("/", (req, res) => {
  res.send("Scheduler backend is up");
});

export default app;