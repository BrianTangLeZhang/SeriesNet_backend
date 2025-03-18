const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const EpisodeSchema = new Schema({
  series: { type: Schema.Types.ObjectId, ref: "Series" },
  title: { type: String, required: true },
  video: { type: String, require: true },
});

const Episode = model("Episode", EpisodeSchema);
module.exports = Episode;
