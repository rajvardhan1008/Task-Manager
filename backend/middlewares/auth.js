const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User");
dotenv.config();

exports.auth = (req, res, next) => {
  const token =
  req.cookies?.token ||
  req.body?.token ||
  (req.header("Authorization") && req.header("Authorization").replace("Bearer ", ""));


  if (!token) {
    console.log("token not found")
    return res.status(401).json({ success: false, message: "Token missing" });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    console.log("auth done");
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Token invalid" });
  }
};
