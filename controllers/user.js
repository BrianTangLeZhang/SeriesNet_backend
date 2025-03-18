const User = require("../models/User");

const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");

const { JWT_PRIVATE_KEY } = require("../secret");

const getUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  return user;
};

const generateTokenForUser = async (user) => {
  return jwt.sign(
    {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      gender: user.gender,
    },
    JWT_PRIVATE_KEY
  );
};

const setUserOnline = async (userId) => {
  try {
    await User.findByIdAndUpdate(userId, {
      isOnline: true,
    });
    return;
  } catch (e) {
    throw new Error(e);
  }
};

const setUserOffline = async (userId) => {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        isOnline: false,
      },
      { new: true }
    );
    return user;
  } catch (e) {
    throw new Error(e);
  }
};

const getUser = async (id) => {
  try {
    const user = await User.findById(id)
      .select("-password")
    if (!user) throw new Error("User not exists");
    return user;
  } catch (e) {
    throw new Error(e);
  }
};

const getUsers = async (target, page) => {
  try {
    let filteredUsers = await User.find().select("-password");
    if (target) {
      const keyword = target.toLowerCase();
      filteredUsers = filteredUsers.filter((user) =>
        user.username.toLowerCase().includes(keyword)
      );
    }

    const limit = 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit - 1;

    return filteredUsers.slice(startIndex, endIndex);
  } catch (e) {
    throw new Error(e);
  }
};

const userSignUp = async (user) => {
  try {
    const { username, email, password, gender, profile } = user;
    const email_exists = await getUserByEmail(email);
    if (email_exists) throw new Error("Email already exists");

    const newUser = new User({
      username: username,
      email: email,
      password: bcrypt.hashSync(password, 10),
      gender: gender,
      profile: profile,
    });

    await newUser.save();
    return newUser;
  } catch (e) {
    throw new Error(e);
  }
};

const userLogin = async ({ username, email, password }) => {
  try {
    const user = await getUserByEmail(email);

    if (!user) {
      throw new Error("Invalid email or password");
    }

    if (username !== user.username) {
      throw new Error("Username not match");
    }

    const isPasswordMatch = bcrypt.compareSync(password, user.password);
    if (!isPasswordMatch) {
      throw new Error("Invalid email or password");
    }

    const token = await generateTokenForUser({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      gender: user.gender,
    });

    await setUserOnline(user._id);

    return {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      gender: user.gender,
      image: user.profile,
      token: token,
    };
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = {
  userSignUp,
  userLogin,
  getUser,
  getUsers,
  getUserByEmail,
  setUserOffline,
};
