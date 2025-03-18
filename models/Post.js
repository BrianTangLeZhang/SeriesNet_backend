const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const PostSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  title: { type: String, required: true },
  content: { type: String},
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  dislikes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  createDate: { type: Date, default: Date.now() },
  updateDate: { type: Date, default: Date.now() },
  tags: [{ type: String }],
  images: [{ type: String }],
  announcement: { type: Boolean, default: false },
});

const Post = model("Post", PostSchema);
module.exports = Post;
