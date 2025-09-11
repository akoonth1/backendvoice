import mongoose from "mongoose";
import { Schema } from "mongoose";

const conversationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  // audio metadata (file stored on disk or cloud)
  audio: {
    path: { type: String },
    filename: { type: String },
    contentType: { type: String },
    size: { type: Number },
    uploadedAt: { type: Date, default: Date.now },
  },
  messages: [
    {
      sender: { type: String, required: true },
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
