const express = require("express");
const {
  getGenres,
  getGenreById,
  addGenre,
  editGenre,
  deleteGenre,
} = require("../controllers/genre");
const { isAdmin } = require("../middleware/auth");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const genres = await getGenres();
    res.status(200).send(genres);
  } catch (e) {
    res.status(400).send({ msg: e.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const genre = await getGenreById(req.params.id);
    res.status(200).send(genre);
  } catch (e) {
    res.status(400).send({ msg: e.message });
  }
});

router.post("/",isAdmin, async (req, res) => {
  try {
    const newGenre = await addGenre(req.body.name.toUpperCase());
    res.status(200).send(newGenre);
  } catch (e) {
    res.status(400).send({ msg: e.message });
  }
});

router.put("/:id",isAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const updatedGenre = await editGenre(id, req.body.name.toUpperCase());
    res.status(200).send(updatedGenre);
  } catch (e) {
    res.status(400).send({ msg: e.message });
  }
});

router.delete("/:id",isAdmin, async (req, res) => {
  try {
    const deletedGenre = await deleteGenre(req.params.id);
    res.status(200).send(deletedGenre);
  } catch (e) {
    res.status(400).send({ msg: e.message });
  }
});

module.exports = router;
