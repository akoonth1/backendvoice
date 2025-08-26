import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  messages: [{ type: Array, required: false }],
  profilePicture: { type: String, required: false }

});

const User = mongoose.model("User", userSchema);

export default User;
