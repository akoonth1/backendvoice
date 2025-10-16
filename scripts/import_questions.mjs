import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dbConnect from "../config/db.mjs";
import Question from "../models/Question.mjs";

export async function importQuestions() {
  await dbConnect();

  const file = path.resolve("./data/questions.json");
  const raw = fs.readFileSync(file, "utf8");
  const items = JSON.parse(raw);

  let count = 0;
  for (const it of items) {
    const filter = { qid: it.id };
    const update = { qid: it.id, id: it.id, set: it.set, question: it.question };
    const opts = { upsert: true, new: true };
    await Question.findOneAndUpdate(filter, update, opts);
    count++;
  }

  console.log(`Imported ${count} questions`);
  return count;
}

// If script is run directly from node, call import and exit when done.
const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] && process.argv[1] === __filename) {
  importQuestions()
    .then((count) => {
      console.log("Done:", count);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
