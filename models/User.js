
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed
  role: { type: String, enum: ["user","provider"], default: "user" },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: "Provider", default: null },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
