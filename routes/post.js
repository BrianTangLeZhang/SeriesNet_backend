const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const {
  getPosts,
  getPost,
  getUserPosts,
  addPost,
  updatePost,
  deletePost,
} = require("../controllers/post");
const { isUserValid } = require("../middleware/auth");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images/postImg");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const uploadImg = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return "Only .png, .jpg and .jpeg format allowed!";
    }
  },
});

router.post(
  "/",
  isUserValid,
  uploadImg.array("postImg", 4),
  async (req, res) => {
    try {
      const imgs = [];
      await req.files.forEach((file) => imgs.push(file.filename));
      const post = await addPost({
        user: req.user._id,
        title: req.body.title,
        content: req.body.content,
        tags: req.body.tags.split(" "),
        images: imgs,
        announcement: req.body.announcement,
      });
      return res.status(200).send(post);
    } catch (e) {
      return res.status(400).send({ msg: e.message });
    }
  }
);

//get posts
router.get("/", async (req, res) => {
  try {
    const search = req.query.search;
    const tag = req.query.tag;
    const page = req.query.page;
    const sort = req.query.sort;
    const posts = await getPosts(search, tag, page, sort);
    if (!posts) return res.status(404).send("Posts not found");
    return res.status(200).send(posts);
  } catch (e) {
    res.status(400).send({ msg: e.message });
  }
});

//get post by id
router.get("/:id", async (req, res) => {
  try {
    const post = await getPost(req.params.id);
    if (!post) return res.status(404).send("Post not found");
    return res.status(200).send(post);
  } catch (e) {
    res.status(400).send({ msg: e.message });
  }
});

//get user post
router.get("/user/:userId", async (req, res) => {
  try {
    const posts = await getUserPosts(req.params.userId);

    if (!posts || posts.length === 0) {
      return res.status(404).send("No posts found for this user");
    }

    return res.status(200).send(posts);
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});

//update post
router.put(
  "/:id",
  isUserValid,
  uploadImg.array("postImg", 4),
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).send("Post not found");

      if (
        req.user.role !== "Admin" &&
        req.user._id.toString() !== post.user.toString()
      ) {
        return res.status(400).send("You are not allow to do this");
      }

      let images = [];

      if (req.files[0]) {
        if (post.images.length > 0)
          post.images.map((img) => {
            const filepath = path.join(__dirname, "../images/postImg/" + img);
            fs.unlinkSync(filepath);
          });
        req.files.forEach((file) => images.push(file.filename));
      } else if (!req.files[0] && post.images.length > 0) {
        images = post.images;
      }

      const updatedPost = await updatePost(req.params.id, {
        user: post.user._id,
        title: req.body.title,
        content: req.body.content,
        tags: req.body.tags.split(" "),
        images: images,
        announcement: req.body.announcement,
      });
      return res.status(200).send(updatedPost);
    } catch (e) {
      res.status(400).send({ msg: e.message });
    }
  }
);

router.delete("/:id", isUserValid, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).send("Post not found");

    if (
      req.user.role !== "Admin" &&
      req.user._id.toString() !== post.user.toString()
    ) {
      return res.status(400).send("You are not allow to do this");
    }

    if (post.images.length > 0)
      post.images.map((img) => {
        const filepath = path.join(__dirname, "../images/postImg/" + img);
        fs.unlinkSync(filepath);
      });

    const updatedPost = await deletePost(req.params.id);
    return res.status(200).send(updatedPost);
  } catch (e) {
    res.status(400).send({ msg: e.message });
  }
});

module.exports = router;
