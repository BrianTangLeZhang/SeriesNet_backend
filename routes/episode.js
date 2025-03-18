const express = require("express");
const router = express.Router();
const Anime = require("../models/Series");
const Episode = require("../models/Episode");
const { isUserValid, isAdmin } = require("../middleware/auth");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./episodes");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const uploadVideo = multer({ storage }).single("episode");

router.post("/:id", isAdmin, uploadVideo, async (req, res) => {
  try {
    const anime = await Anime.findById(req.params.id);
    if (!anime) return res.status(404).send("Anime not found");

    const episode = new Episode({
      anime: req.params.id,
      title: req.body.title,
      video: req.file.filename,
    });

    await episode.save();

    anime.episodes.push(episode);
    await anime.save();

    return res.status(200).send(anime);
  } catch (e) {
    return res.status(400).send({ e: e.message });
  }
});

router.get("/:id", isUserValid, async (req, res) => {
  try {
    const episode = await Episode.findById(req.params.id);
    return res.status(200).send(episode);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

router.delete("/:id", isAdmin, async (req, res) => {
  try {
    const episode = await Episode.findById(req.params.id);
    if (!episode) return res.status(404).send("Episode not found");

    const filepath = path.join(__dirname, "../episodes", episode.video);
    fs.unlinkSync(filepath);

    const anime = await Anime.findById(episode.anime);
    if (anime) {
      anime.episodes = anime.episodes.filter(
        (ep) => ep.toString() !== req.params.id
      );
      await anime.save();
    }

    await Episode.findByIdAndDelete(req.params.id);

    return res.status(200).send("Delete Successfully");
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});
module.exports = router;
