const Anime = require("../models/Series");
const fs = require("fs");
const path = require("path");
const Episode = require("../models/Episode");
const Comment = require("../models/Comment");

const addAnime = async (anime) => {
  try {
    const newAnime = new Anime(anime);
    await newAnime.save();
    return newAnime;
  } catch (e) {
    throw new Error(e);
  }
};

const getAnime = async (Id) => {
  try {
    const anime = await Anime.findById(Id)
      .populate("genres")
      .populate({ path: "episodes" })
      .populate({
        path: "comments",
        populate: { path: "user", select: "-password" },
      });
    if (!anime) throw new Error("Anime not found");
    return anime;
  } catch (e) {
    throw new Error(e);
  }
};

const getAnimes = async (search, genre, sort) => {
  try {
    let filteredAnimes = await Anime.find().populate({ path: "genres" });

    if (search) {
      const keyword = search.toLowerCase();
      filteredAnimes = filteredAnimes.filter((anime) =>
        anime.name.toLowerCase().includes(keyword)
      );
    }

    if (genre) {
      filteredAnimes = filteredAnimes.filter((anime) =>
        anime.genres.some((g) => g._id.toString() === genre)
      );
    }

    if (sort) {
      const sortBy = sort;
      filteredAnimes.sort((a, b) => {
        if (sortBy === "name") {
          return a.name.localeCompare(b.name);
        } else if (sortBy === "popularity") {
          return b.likes.length - a.likes.length;
        }
      });
    }

    return filteredAnimes;
  } catch (e) {
    throw new Error(e);
  }
};

const editAnime = async (Id, data) => {
  try {
    const anime = await Anime.findById(Id);
    if (!anime) throw new Error("Anime not found");

    const updatedAnime = await Anime.findByIdAndUpdate(Id, data, {
      new: true,
    });
    return updatedAnime;
  } catch (e) {
    throw new Error(e);
  }
};

const deleteAnime = async (animeId) => {
  try {
    const anime = await Anime.findById(animeId);
    if (!anime) throw new Error("Anime not found");

    await Comment.deleteMany({ anime: anime._id });

    await Episode.deleteMany({ anime: animeId });

    const filepath1 = path.join(__dirname, "../images/poster/" + anime.poster);
    fs.unlinkSync(filepath1);

    const filepath2 = path.join(
      __dirname,
      "../images/background/" + anime.background
    );
    fs.unlinkSync(filepath2);

    await Anime.findByIdAndDelete(animeId);

    return anime;
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = { addAnime, getAnime, getAnimes, editAnime, deleteAnime };
