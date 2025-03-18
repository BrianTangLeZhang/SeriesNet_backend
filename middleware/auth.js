const jwt = require("jsonwebtoken");

const { getUserByEmail } = require("../controllers/user");

const { JWT_PRIVATE_KEY } = require("../secret");

const isUserValid = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, JWT_PRIVATE_KEY);
    const user = await getUserByEmail(decoded.email);
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(403).send({
        message: "You are not authorized to perform this action",
      });
    }
  } catch (error) {
    res.status(403).send({
      message: "You are not authorized to perform this action",
    });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, JWT_PRIVATE_KEY);
    const user = await getUserByEmail(decoded.email);
    if (user && user.role === "Admin") {
      req.user = user;
      next();
    } else {
      res.status(403).send({
        message: "You are not authorized to perform this action",
      });
    }
  } catch (error) {
    res.status(403).send({
      message: "You are not authorized to perform this action",
    });
  }
};

module.exports = { isUserValid,isAdmin };
