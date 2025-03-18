const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const ListSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  animes: [{ type: Schema.Types.ObjectId, ref: "Anime" }],
});
 
const List = model("List", ListSchema);
module.exports = List;
