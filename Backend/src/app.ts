import express from "express";
import dotenv from "dotenv";
dotenv.config();
import slotsRouter from "./routes/slots";

const app = express();
app.use(express.json());

// routes
app.use("/slots", slotsRouter);

app.get("/", (req, res) => {
  res.send("Slotify backend is up 🚀");
});

export default app;
