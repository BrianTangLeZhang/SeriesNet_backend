const Post = require("../models/Post");
const Anime = require("../models/Series");
const Comment = require("../models/Comment");

const likePost = async (postId, userId) => {
  try {
    const post = await Post.findById(postId);
    if (!post) throw new Error("Post not found");

    let newlike = [...post.likes];
    let newdislike = [...post.dislikes];

    const checkLike = newlike.find((u) => u.toString() === userId.toString());
    const checkDislike = newdislike.find(
      (u) => u.toString() === userId.toString()
    );

    if (checkDislike) {
      newdislike = newdislike.filter(
        (u) => u.toString() !== checkDislike.toString()
      );
    }

    if (checkLike) {
      newlike = newlike.filter((u) => u.toString() !== checkLike.toString());
    } else {
      newlike.push(userId);
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

const likeAnime = async (animeId, userId) => {
  try {
    const anime = await Anime.findById(animeId);
    if (!anime) throw new Error("Anime not found");

    let newlike = [...anime.likes];
    let newdislike = [...anime.dislikes];

    const checkLike = newlike.find((u) => u.toString() === userId.toString());
    const checkDislike = newdislike.find(
      (u) => u.toString() === userId.toString()
    );

    if (checkDislike) {
      newdislike = newdislike.filter(
        (u) => u.toString() !== checkDislike.toString()
      );
    }

    if (checkLike) {
      newlike = newlike.filter((u) => u.toString() !== checkLike.toString());
    } else {
      newlike.push(userId);
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

const likeComment = async (commentId, userId) => {
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) throw new Error("Comment not found");
    let newlike = [...comment.likes];
    let newdislike = [...comment.dislikes];

    const checkLike = newlike.find((u) => u.toString() === userId.toString());
    const checkDislike = newdislike.find(
      (u) => u.toString() === userId.toString()
    );

    if (checkDislike) {
      newdislike = newdislike.filter(
        (u) => u.toString() !== checkDislike.toString()
      );
    }

    if (checkLike) {
      newlike = newlike.filter((u) => u.toString() !== checkLike.toString());
    } else {
      newlike.push(userId);
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

module.exports = { likePost, likeAnime, likeComment };
