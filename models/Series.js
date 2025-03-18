const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const AnimeSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  dislikes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  episodes: [{ type: Schema.Types.ObjectId, ref: "Episode" }],
  genres: [{ type: Schema.Types.ObjectId, ref: "Genre" }],
  poster: { type: String, required: true },
  background: { type: String, required: true },
});

const Anime = model("Anime", AnimeSchema);
module.exports = Anime;
