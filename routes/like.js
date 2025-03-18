const express = require("express");
const router = express.Router();
const { likePost, likeAnime, likeComment } = require("../controllers/like");
const { isUserValid } = require("../middleware/auth");

router.put("/:type/:id", isUserValid, async (req, res) => {
  try {
    const { id, type } = req.params;

    if (type === "post") {
      const likedPost = await likePost(id, req.user._id);
      return res.status(200).send(likedPost);
    }

    if (type === "anime") {
      const likedAnime = await likeAnime(id, req.user._id);
      return res.status(200).send(likedAnime);
    }

    if (type === "comment") {
      const likedComment = await likeComment(id, req.user._id);
      return res.status(200).send(likedComment);
    }
    return res.status(400).send("Invalid type")
  } catch (e) {
    return res.status(400).send({ msg: e.message });
  }
});

module.exports = router;
