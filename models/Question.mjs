import mongoose from "mongoose";

const { Schema } = mongoose;

const questionSchema = new Schema({
  qid: { type: Number, required: true, unique: true },
  set: { type: String },
  question: { type: String, required: true },
});

const Question = mongoose.model("Question", questionSchema);

export default Question;
