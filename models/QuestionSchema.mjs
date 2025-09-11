import mongoose from "mongoose";
import { Schema } from "mongoose";

const questionSchema = new Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  answer: { type: String, required: true },
});

const Question = mongoose.model("Question", questionSchema);

export default Question;
