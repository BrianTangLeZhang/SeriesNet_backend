const User = require("../models/User");
const Anime = require("../models/Series");
const List = require("../models/List");

const getList = async (userId) => {
  try {
    const list = await List.findOne({ user: userId });

    if (!list) {
      const newList = new List.create({
        user: userId,
        animes: [],
      });
      return newList.populate("animes");
    }

    return list.populate("animes");
  } catch (e) {
    throw new Error(e);
  }
};

const clearList = async (userId) => {
  try {
    const list = await List.updateOne(
      { user: userId },
      { animes: [] },
      { new: true }
    );

    return list;
  } catch (e) {
    throw new Error(e);
  }
};

const addToList = async (animeId, userId) => {
  try {
    const list = await getList(userId);

    const anime = await Anime.findById(animeId);
    if (!anime) throw new Error("Anime not found");

    const animeIndex = list.animes.findIndex((anime) => anime._id == animeId);

    if (animeIndex !== -1) {
      list.animes.splice(animeIndex, 1);
    } else {
      list.animes.push(anime);
    }

    await list.save();
    return list;
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = { addToList, getList, clearList };
