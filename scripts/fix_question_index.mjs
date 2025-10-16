import dbConnect from "../config/db.mjs";
import mongoose from "mongoose";

async function run() {
  await dbConnect();

  const coll = mongoose.connection.collection("questions");

  // drop old unique index on `id` if it exists
  try {
    const indexes = await coll.indexes();
    const hasIdIndex = indexes.some(ix => ix.name === "id_1");
    console.log("Indexes before:", indexes.map(i => i.name));
    if (hasIdIndex) {
      await coll.dropIndex("id_1");
      console.log("Dropped index: id_1");
    } else {
      console.log("No id_1 index found");
    }
  } catch (err) {
    console.error("Error dropping index (may not exist):", err.message);
  }

  // remove any documents with id === null to avoid duplicate-null problems
  try {
    const delRes = await coll.deleteMany({ id: null });
    console.log("Removed documents with id:null ->", delRes.deletedCount);
  } catch (err) {
    console.error("Error deleting id:null docs:", err.message);
  }

  // ensure unique index on qid exists
  try {
    await coll.createIndex({ qid: 1 }, { unique: true, background: false });
    console.log("Ensured unique index on qid");
  } catch (err) {
    console.error("Error creating qid index:", err.message);
  }

  await mongoose.connection.close();
  console.log("Done");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});