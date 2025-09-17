import mongoose from "mongoose";
import { Schema } from "mongoose";

const questionSchema = new Schema({
    id : { type: String, required: true, unique: true },
    set : { type: String, required: true },
    question: { type: String, required: true },
    answer: { type: String, required: false }

  
});

const Question = mongoose.model("Question", questionSchema);

export default Question;
