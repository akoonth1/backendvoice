import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import audioRoutes from "./routes/audio_routes.mjs";
import userRoutes from "./routes/user_routes.mjs";
import questionsRoutes from "./routes/questions_routes.mjs";
import mongoose from "mongoose";
import db from "./config/db.mjs";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// connect to DB (if db.mjs exports a connect function or mongoose connection)
if (db && typeof db.connect === "function") {
  db.connect();
} else if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI).then(() => console.log("Mongo connected"));
}

// serve uploaded files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/audio", audioRoutes);
app.use("/api/users", userRoutes);
app.use("/api/questions", questionsRoutes);

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () => console.log(`Server running at http://localhost:${port}/`));