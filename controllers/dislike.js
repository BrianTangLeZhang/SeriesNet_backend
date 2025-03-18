const Post = require("../models/Post");
const Anime = require("../models/Series");
const Comment = require("../models/Comment");

const dislikePost = async (postId, userId) => {
  try {
    const post = await Post.findById(postId);
    let newlike = [...post.likes];
    let newdislike = [...post.dislikes];

    const checkLike = newlike.find((u) => u.toString() === userId.toString());
    const checkDislike = newdislike.find(
      (u) => u.toString() === userId.toString()
    );

    if (checkLike) {
      newlike = newlike.filter((u) => u.toString() !== checkLike.toString());
    }

    if (checkDislike) {
      newdislike = newdislike.filter(
        (u) => u.toString() !== checkDislike.toString()
      );
    } else {
      newdislike.push(userId);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { likes: newlike, dislikes: newdislike },
      {
        new: true,
      }
    );

    return updatedPost;
  } catch (e) {
    throw new Error(e);
  }
};

const dislikeAnime = async (animeId, userId) => {
  try {
    const anime = await Anime.findById(animeId);
    let newlike = [...anime.likes];
    let newdislike = [...anime.dislikes];

    const checkLike = newlike.find((u) => u.toString() === userId.toString());
    const checkDislike = newdislike.find(
      (u) => u.toString() === userId.toString()
    );

    if (checkLike) {
      newlike = newlike.filter((u) => u.toString() !== checkLike.toString());
    }

    if (checkDislike) {
      newdislike = newdislike.filter(
        (u) => u.toString() !== checkDislike.toString()
      );
    } else {
      newdislike.push(userId);
    }

    const updatedAnime = await Anime.findByIdAndUpdate(
      animeId,
      { likes: newlike, dislikes: newdislike },
      {
        new: true,
      }
    );

    return updatedAnime;
  } catch (e) {
    throw new Error(e);
  }
};

const dislikeComment = async (commentId, userId) => {
  try {
    const comment = await Comment.findById(commentId);
    let newlike = [...comment.likes];
    let newdislike = [...comment.dislikes];

    const checkLike = newlike.find((u) => u.toString() === userId.toString());
    const checkDislike = newdislike.find(
      (u) => u.toString() === userId.toString()
    );

    if (checkLike) {
      newlike = newlike.filter((u) => u.toString() !== checkLike.toString());
    }

    if (checkDislike) {
      newdislike = newdislike.filter(
        (u) => u.toString() !== checkDislike.toString()
      );
    } else {
      newdislike.push(userId);
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { likes: newlike, dislikes: newdislike },
      {
        new: true,
      }
    );

    return updatedComment;
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = { dislikePost, dislikeAnime, dislikeComment };
