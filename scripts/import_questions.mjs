import fs from "fs";
import path from "path";
import dbConnect from "../config/db.mjs";
import Question from "../models/Question.mjs";

async function run() {
  await dbConnect();

  const file = path.resolve("./data/questions.json");
  const raw = fs.readFileSync(file, "utf8");
  const items = JSON.parse(raw);

  let count = 0;
  for (const it of items) {
    const filter = { qid: it.id };
    const update = { qid: it.id, set: it.set, question: it.question };
    const opts = { upsert: true, new: true };
    await Question.findOneAndUpdate(filter, update, opts);
    count++;
  }

  console.log(`Imported ${count} questions`);
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
