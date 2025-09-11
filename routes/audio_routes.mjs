import express from "express";
import multer from "multer";
import path from "path";
import Conversation from "../models/Conversation.mjs";

const router = express.Router();

// store uploads in ./uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("./uploads"));
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || ".webm";
    cb(null, `${unique}${ext}`);
  },
});

const upload = multer({ storage });

// POST /audio/upload - accepts a single 'audio' file and optional userId
router.post("/upload", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const { userId } = req.body;

    const conv = new Conversation({
      userId: userId || null,
      audio: {
        path: req.file.path,
        filename: req.file.filename,
        contentType: req.file.mimetype,
        size: req.file.size,
      },
    });

    await conv.save();

    res.status(201).json({ message: "Uploaded", conversationId: conv._id, file: req.file });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
});

// GET /audio/:id - return conversation metadata (including file path)
router.get("/:id", async (req, res) => {
  try {
    const conv = await Conversation.findById(req.params.id);
    if (!conv) return res.status(404).json({ message: "Not found" });
    res.json(conv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error" });
  }
});

export default router;
