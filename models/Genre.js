const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const GenreSchema = new Schema({
  name: { type: String, required: true, unique: true },
});

const Genre = model("Genre", GenreSchema);
module.exports = Genre;
