const express = require("express");
const router = express.Router();
const {
  userLogin,
  userSignUp,
  getUser,
  getUsers,
  setUserOffline,
  getUserByEmail,
} = require("../controllers/user");
const { isUserValid } = require("../middleware/auth");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const List = require("../models/List");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images/profileImg");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const uploadProf = multer({ storage }).single("profile");

//user register
router.post("/register", uploadProf, async (req, res) => {
  try {
    const checkEmail = await getUserByEmail(req.body.email);
    if (checkEmail) {
      const filepath = path.join(
        __dirname,
        "../images/profileImg/" + req.file.filename
      );
      fs.unlinkSync(filepath);
      return res.status(400).json({ msg: "Email already used" });
    }
    const user = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      gender: req.body.gender,
      profile: req.file.filename,
    };
    const newUser = await userSignUp(user);

    await List.create({
      user: newUser._id,
      animes: [],
    });

    return res.status(200).send(newUser);
  } catch (e) {
    const filepath = path.join(
      __dirname,
      "../images/profileImg/" + req.file.filename
    );
    fs.unlinkSync(filepath);
    return res.status(400).send({ msg: e.message });
  }
});

//user login
router.post("/login", async (req, res) => {
  try {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const user = await userLogin({
      username,
      email,
      password,
    });
    return res.status(200).send(user);
  } catch (e) {
    return res.status(400).send({ msg: e.message });
  }
});

//get user
router.get("/:id", async (req, res) => {
  try {
    const user = await getUser(req.params.id);
    return res.status(200).send(user);
  } catch (e) {
    return res.status(400).send({ msg: e.message });
  }
});

//get all users
router.get("/", async (req, res) => {
  try {
    const username = req.query.username;
    const page = req.query.page;
    const users = await getUsers(username, page);
    return res.status(200).send(users);
  } catch (e) {
    return res.status(400).send({ msg: e.message });
  }
});

// logout
router.put("/logout", isUserValid, async (req, res) => {
  try {
    const logout = await setUserOffline(req.user._id);
    return res.status(200).send(logout);
  } catch (e) {
    return res.status(400).send({ msg: e.message });
  }
});


module.exports = router;
