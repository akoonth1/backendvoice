import express from "express";
import { importQuestions } from "../scripts/import_questions.mjs";
import Question from "../models/Question.mjs";

const router = express.Router();

router.get("/", (req, res) => res.send("Questions routes test"));

// GET /api/questions/questions - list all
router.get("/questions", async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST /api/questions/ - create single question
// body: { id|qid, set, question }
router.post("/", async (req, res) => {
  try {
    const { id, qid, set, question } = req.body;
    const qidNum = qid ?? id;
    if (!qidNum || !question) return res.status(400).json({ message: "Missing qid (or id) or question" });

    const exists = await Question.findOne({ qid: qidNum });
    if (exists) return res.status(409).json({ message: "Question with this qid already exists" });

    const q = new Question({ qid: qidNum, set, question });
    await q.save();
    res.status(201).json(q);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating question" });
  }
});

// GET /api/questions/bulk -> trigger import of data/questions.json
router.get("/bulk", async (req, res) => {
  try {
    const count = await importQuestions();
    res.json({ ok: true, imported: count });
  } catch (err) {
    console.error("Bulk import error:", err);
    res.status(500).json({ ok: false, error: err.message || String(err) });
  }
});

// POST /api/questions/bulk - upsert array of questions
router.post("/bulk", async (req, res) => {
  try {
    const items = req.body;
    if (!Array.isArray(items)) return res.status(400).json({ message: "Expected an array" });

    const ops = items.map((it) => {
      const qidNum = it.qid ?? it.id;
      return {
        updateOne: {
          filter: { qid: qidNum },
          update: { $set: { qid: qidNum, set: it.set, question: it.question } },
          upsert: true,
        },
      };
    });

    if (ops.length === 0) return res.status(400).json({ message: "No items to import" });

    const result = await Question.bulkWrite(ops);
    res.json({ message: "Bulk upsert complete", result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Bulk import failed" });
  }
});

// DELETE /api/questions/questions/:id - delete by _id
router.delete("/questions/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "ID is required" });

  try {
    const deleted = await Question.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Question not found" });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PUT /api/questions/questions/:id - update by _id
router.put("/questions/:id", async (req, res) => {
  const { id } = req.params;
  const { set, question } = req.body;
  if (!id || !question) return res.status(400).json({ message: "ID and question are required" });

  try {
    const updated = await Question.findByIdAndUpdate(id, { set, question }, { new: true });
    if (!updated) return res.status(404).json({ message: "Question not found" });
    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
