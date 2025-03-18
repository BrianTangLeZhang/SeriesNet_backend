const express = require("express");
const router = express.Router();
const Anime = require("../models/Series");
const { isUserValid, isAdmin } = require("../middleware/auth");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { getGenreByName } = require("../controllers/genre");
const {
  addAnime,
  getAnimes,
  editAnime,
  getAnime,
  deleteAnime,
} = require("../controllers/series");
const Genre = require("../models/Genre");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destination =
      file.fieldname === "poster" ? "./images/poster" : "./images/background";
    cb(null, destination);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const uploadImg = multer({
  storage,
});

router.get("/", isUserValid, async (req, res) => {
  try {
    const search = req.query.search;
    const genre = req.query.genre;
    const sort = req.query.sort;
    const animes = await getAnimes(search, genre, sort);
    return res.status(200).send(animes);
  } catch (e) {
    return res.status(400).send({ msg: e.message });
  }
});

router.get("/:id", isUserValid, async (req, res) => {
  try {
    const animes = await getAnime(req.params.id);
    return res.status(200).send(animes);
  } catch (e) {
    return res.status(400).send({ msg: e.message });
  }
});

router.post(
  "/",
  isAdmin,
  uploadImg.fields([
    { name: "poster", maxCount: 1 },
    { name: "background", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const convert = req.body.genres.split(", ");

      const genrePromises = convert.map((g) => getGenreByName(g));
      const genres = await Promise.all(genrePromises);

      if (
        !req.files["poster"].length === 0 ||
        !req.files["background"].length === 0
      )
        throw new Error("Poster and background is needed!");

      const anime = await addAnime({
        name: req.body.name,
        description: req.body.description,
        genres: genres,
        poster: req.files["poster"][0].filename,
        background: req.files["background"][0].filename,
      });

      return res.status(200).send(anime);
    } catch (e) {
      if (req.files && req.files["poster"]) {
        const filepath1 = path.join(
          __dirname,
          "../images/poster/" + req.files["poster"][0].filename
        );
        fs.unlinkSync(filepath1);
      }
      if (req.files && req.files["background"]) {
        const filepath2 = path.join(
          __dirname,
          "../images/background/" + req.files["background"][0].filename
        );
        fs.unlinkSync(filepath2);
      }
      return res.status(400).send({ msg: e.message });
    }
  }
);

router.put(
  "/:id",
  isAdmin,
  uploadImg.fields([
    { name: "poster", maxCount: 1 },
    { name: "background", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const convert = req.body.genres.split(", ");

      const genrePromises = convert.map((g) => getGenreByName(g));
      const genres = await Promise.all(genrePromises);
      const anime = await Anime.findById(req.params.id);
      if (!anime) return res.status(404).send("Anime not found");
      let poster = anime.poster;
      let background = anime.background;

      if (req.files && req.files["poster"]) {
        const filepath1 = path.join(
          __dirname,
          "../images/poster/" + anime.poster
        );
        fs.unlinkSync(filepath1);
        poster = req.files["poster"][0];
      }

      if (req.files && req.files["background"]) {
        const filepath2 = path.join(
          __dirname,
          "../images/background/" + anime.background
        );
        fs.unlinkSync(filepath2);
        background = req.files["background"][0];
      }

      const updatedAnime = await editAnime(req.params.id, {
        name: req.body.name,
        description: req.body.description,
        genres: genres,
        poster,
        background,
      });

      return res.status(200).send(updatedAnime);
    } catch (e) {
      if (req.files && req.files["poster"]) {
        const filepath1 = path.join(
          __dirname,
          "../images/poster/" + req.files["poster"][0].filename
        );
        fs.unlinkSync(filepath1);
      }
      if (req.files && req.files["background"]) {
        const filepath2 = path.join(
          __dirname,
          "../images/background/" + req.files["background"][0].filename
        );
        fs.unlinkSync(filepath2);
      }
      return res.status(400).send({ msg: e.message });
    }
  }
);

router.delete("/:id", isAdmin, async (req, res) => {
  try {
    const deletedAnime = await deleteAnime(req.params.id);
    return res.status(200).send(deletedAnime);
  } catch (e) {
    return res.status(400).send({ msg: e.message });
  }
});

module.exports = router;
