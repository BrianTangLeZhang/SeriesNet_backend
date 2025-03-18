const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const {
  getPostComment,
  getAnimeComment,
  addAnimeComment,
  addPostComment,
  editComment,
  deletePostComment,
  deleteAnimeComment,
} = require("../controllers/comment");
const { isUserValid } = require("../middleware/auth");

router.post("/:type/:id", isUserValid, async (req, res) => {
  try {
    const { type, id } = req.params;
    if (type === "post") {
      const commentPost = await addPostComment(id, {
        user: req.user._id,
        post: id,
        content: req.body.content,
      });
      return res.status(200).send(commentPost);
    }
    if (type === "anime") {
      const commentAnime = await addAnimeComment(id, {
        user: req.user._id,
        anime: id,
        content: req.body.content,
      });
      return res.status(200).send(commentAnime);
    }
    return res.status(400).send({ msg: "Invalid type parameter" });
  } catch (e) {
    return res.status(400).send({ msg: e.message });
  }
});

router.get("/:type/:id", isUserValid, async (req, res) => {
  try {
    const { type, id } = req.params;
    if (type === "post") {
      const comments = await getPostComment(id);
      return res.status(200).send(comments);
    }

    if (type === "anime") {
      const comments = await getAnimeComment(id);
      return res.status(200).send(comments);
    }
  } catch (e) {
    return res.status(400).send({ msg: e.message });
  }
});

router.put("/:id", isUserValid, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedComment = await editComment(id, {
      content: req.body.content,
    },req.user);

    return res.status(200).send(updatedComment);
  } catch (e) {
    return res.status(400).send({ msg: e.message });
  }
});

router.delete("/:type/:id", isUserValid, async (req, res) => {
  try {
    const { type, id } = req.params;
    if (type === "post") {
      const target = await deletePostComment(id, req.user);
      return res.status(200).send(target);
    }
    if (type === "anime") {
      const target = await deleteAnimeComment(id, req.user);
      return res.status(200).send(target);
    }
    return res.status(400).send("Invalid type");
  } catch (e) {
    return res.status(400).send({ msg: e.message });
  }
});

module.exports = router;
