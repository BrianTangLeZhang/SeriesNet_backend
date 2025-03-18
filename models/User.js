const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const UserSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String, enum: ["Male", "Female", "None"], default: "None" },
  role: {
    type: String,
    enum: ["User", "Creator", "Admin"],
    default: "User",
  },
  profile: { type: String, require: true },
  isOnline: { type: Boolean, default: false },
});

const User = model("User", UserSchema);
module.exports = User;
