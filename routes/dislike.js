const express = require("express");
const router = express.Router();
const {
  dislikePost,
  dislikeAnime,
  dislikeComment,
} = require("../controllers/dislike");
const { isUserValid } = require("../middleware/auth");

router.put("/:type/:id", isUserValid, async (req, res) => {
  try {
    const { id, type } = req.params;

    if (type === "post") {
      const dislikedPost = await dislikePost(id, req.user._id);
      return res.status(200).send(dislikedPost);
    }

    if (type === "anime") {
      const dislikedAnime = await dislikeAnime(id, req.user._id);
      return res.status(200).send(dislikedAnime);
    }

    if (type === "comment") {
      const dislikedComment = await dislikeComment(id, req.user._id);
      return res.status(200).send(dislikedComment);
    }
  } catch (e) {
    return res.status(400).send({ msg: e.message });
  }
});

module.exports = router;
