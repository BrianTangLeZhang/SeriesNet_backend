//import two library
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

//create express app
const app = express();

app.use(express.json());

//connect to mongoDB
app.use(express.static("images"));
app.use(express.static("episodes"));

const corsHandler = cors({
  origin: "*",
  methods: "GET,PUT,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
  preflightContinue: true,
  optionsSuccessStatus: 200,
});

app.use(corsHandler);

mongoose
  .connect("mongodb://127.0.0.1:27017/SeriesNet")
  .then(() => console.log("MongoDB connected successfully"))
  .catch((e) => console.log(e));

//Routes
app.use("/posts", require("./routes/post"));
app.use("/likes", require("./routes/like"));
app.use("/dislikes", require("./routes/dislike"));
app.use("/users", require("./routes/user"));
app.use("/comments", require("./routes/comment"));
app.use("/animes", require("./routes/anime"));
app.use("/genres", require("./routes/genre"));
app.use("/episodes", require("./routes/episode"));
app.use("/lists", require("./routes/list"));

app.listen(1226, () => {
  console.log("Server is running on: http://localhost:1226");
});
