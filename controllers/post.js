const Post = require("../models/Post");
const Comment = require("../models/Comment");

const getPosts = async (search, tag, page = 1, sort) => {
  try {
    let filteredPosts = await Post.find()
      .populate({ path: "user", select: "-password" })
      .populate({
        path: "comments",
        populate: { path: "user", select: "-password" },
      });

    if (search) {
      const keyword = search.toLowerCase();
      filteredPosts = filteredPosts.filter((post) =>
        post.title.toLowerCase().includes(keyword)
      );
    }

    if (tag) {
      const keyword = tag.toLowerCase();
      let newfilteredPosts = [];
      filteredPosts.map((post) => {
        post.tags.map((t) => {
          if (t.toLowerCase().includes(keyword)) newfilteredPosts.push(post);
        });
      });
      filteredPosts = [...newfilteredPosts];
    }

    if (sort) {
      const sortBy = sort;
      filteredPosts.sort((a, b) => {
        if (sortBy === "title") {
          return a.title.localeCompare(b.title);
        } else if (sortBy === "popularity") {
          return b.likes.length - a.likes.length;
        }
      });
    }
    const limit = 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit - 1;

    return filteredPosts.slice(startIndex, endIndex);
  } catch (e) {
    throw new Error(e);
  }
};

const getPost = async (postId) => {
  try {
    const post = await Post.findById(postId)
      .populate({ path: "user", select: "-password" })
      .populate("comments");
    return post;
  } catch (e) {
    throw new Error(e);
  }
};

const getUserPosts = async (userId) => {
  try {
    const posts = await Post.find({ user: userId })
      .populate({ path: "user", select: "-password" });
    
    return posts;
  } catch (error) {
    throw new Error(e);; 
  }
};

const addPost = async (post) => {
  try {
    const newPost = new Post(post);
    await newPost.save();
    return newPost;
  } catch (e) {
    throw new Error(e);
  }
};

const updatePost = async (postId, post) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { ...post, updateDate: Date.now() },
      {
        new: true,
      }
    );
    return updatedPost;
  } catch (e) {
    throw new Error(e);
  }
};

const deletePost = async (postId) => {
  try {
    const post = await Post.findByIdAndDelete(postId);
    await Comment.deleteMany({ post: postId });
    return post;
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = {
  getPosts,
  getPost,
  addPost,
  updatePost,
  deletePost,
  getUserPosts
};
