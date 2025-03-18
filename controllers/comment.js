const Comment = require("../models/Comment");
const Post = require("../models/Post");
const Anime = require("../models/Series");

const getPostComment = async (postId) => {
  try {
    const comments = await Comment.find({ post: postId }).populate({
      path: "user",
      select: "-password",
    });
    return comments;
  } catch (e) {
    throw new Error(e);
  }
};

const getAnimeComment = async (animeId) => {
  try {
    const comments = await Comment.find({ anime: animeId }).populate({
      path: "user",
      select: "-password",
    });

    return comments;
  } catch (e) {
    throw new Error(e);
  }
};

const addPostComment = async (postId, comment) => {
  try {
    const post = await Post.findById(postId);
    if (!post) throw new Error("Post not found");

    const newComment = await Comment.create(comment);
    post.comments.push(newComment);
    await post.save();

    return newComment.populate({ path: "user", select: "-password" });
  } catch (e) {
    throw new Error(e);
  }
};

const addAnimeComment = async (animeId, comment) => {
  try {
    const anime = await Anime.findById(animeId);
    if (!anime) throw new Error("Anime not found");

    const newComment = await Comment.create(comment);
    anime.comments.push(newComment);
    await anime.save();

    return newComment.populate({ path: "user", select: "-password" });
  } catch (e) {
    throw new Error(e);
  }
};

const editComment = async (commentId, newContent, user) => {
  try {
    let comment = await Comment.findById(commentId);
    if (!comment) throw new Error("Comment not found");

    if (
      comment.user.toString() === user._id.toString() ||
      user.role === "Admin"
    ) {
      comment = await Comment.findByIdAndUpdate(commentId, newContent, {
        new: true,
      });
    } else throw new Error("You are not allowed to do this");
    return comment;
  } catch (e) {
    throw new Error(e);
  }
};

const deletePostComment = async (targetId, user) => {
  try {
    const comment = await Comment.findById(targetId);
    if (!comment) throw new Error("Comment not found");

    const post = await Post.findById(comment.post);
    if (!post) throw new Error("Post not found");

    if (
      post.user.toString() === user._id.toString() ||
      comment.user.toString() === user._id.toString() ||
      user.role === "Admin"
    ) {
      post.comments = post.comments.filter(
        (c) => c._id.toString() !== targetId.toString()
      );
      await post.save();
      await Comment.findByIdAndDelete(targetId);
      return post;
    } else throw new Error("You are not allowed to do this");
  } catch (e) {
    throw new Error(e);
  }
};

const deleteAnimeComment = async (targetId, user) => {
  try {
    const comment = await Comment.findById(targetId);
    if (!comment) throw new Error("Comment not found");

    const anime = await Anime.findById(comment.anime);
    if (!anime) throw new Error("Anime not found");

    if (
      comment.user.toString() === user._id.toString() ||
      user.role === "Admin"
    ) {
      anime.comments = anime.comments.filter(
        (c) => c._id.toString() !== targetId.toString()
      );
      await anime.save();
      await Comment.findByIdAndDelete(targetId);
      return anime;
    } else throw new Error("You are not allowed to do this");
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = {
  getPostComment,
  getAnimeComment,
  addPostComment,
  addAnimeComment,
  editComment,
  deletePostComment,
  deleteAnimeComment,
};
