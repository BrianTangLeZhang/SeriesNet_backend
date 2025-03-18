const Anime = require("../models/Series");
const Genre = require("../models/Genre");

const getGenres = async () => {
  try {
    const genres = await Genre.find();
    if (!genres) throw new Error("There are no genre added");
    const sortedGenres = genres.sort((a, b) => a.name.localeCompare(b.name));
    return sortedGenres;
  } catch (e) {
    throw new Error(e);
  }
};

const getGenreById = async (id) => {
  try {
    const genre = await Genre.findById(id);
    if (!genre) throw new Error("Genre not found");
    return genre;
  } catch (e) {
    throw new Error(e);
  }
};

const getGenreByName = async (name) => {
  try {
    const genre = await Genre.findOne({ name: name });
    return genre;
  } catch (e) {
    throw new Error(e);
  }
};

const addGenre = async (name) => {
  try {
    const record = await Genre.findOne({ name: name });
    if (record) throw new Error("This genre already exists");
    const genre = new Genre({ name: name });
    await genre.save();
    return genre;
  } catch (e) {
    throw new Error(e);
  }
};

const editGenre = async (id, name) => {
  try {
    const genre = await Genre.findById(id);
    if (!genre) throw new Error("Genre not found");
    const newGenre = await Genre.findByIdAndUpdate(
      id,
      { name: name },
      { new: true }
    );
    return newGenre;
  } catch (e) {
    throw new Error(e);
  }
};

const deleteGenre = async (id) => {
  try {
    const genre = await Genre.findById(id);
    if (!genre) throw new Error("Genre not found");
    const anime = await Anime.findOne({ ganres: genre.id });
    if (anime) throw new Error("Not allowed");
    const newGenre = await Genre.findByIdAndDelete(id);
    return newGenre;
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = {
  getGenreById,
  deleteGenre,
  getGenres,
  addGenre,
  editGenre,
  getGenreByName,
};
