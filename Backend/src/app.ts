// src/app.ts
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import slotsRouter from "./routes/slots";

const app = express();

// Build whitelist from env (comma separated) + local defaults
const defaultFrontends = [
  "http://localhost:5173",
  "https://slotify-five.vercel.app",
  "https://slotify-abyf.vercel.app",
  
];
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean)
  .concat(defaultFrontends);

// cors options with dynamic check
const corsOptions = {
  origin: (origin: string | undefined, callback: any) => {
    // allow non-browser requests with no origin (e.g. curl, server-to-server)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
};

app.use(cors(corsOptions));
// ensure preflight requests also handled
app.options("*", cors(corsOptions));

app.use(express.json());
app.use("/slots", slotsRouter);

app.get("/", (req, res) => {
  res.send("Scheduler backend is up");
});

export default app;
