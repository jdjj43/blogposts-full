const { body, validationResult } = require("express-validator");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const utils = require("../lib/utils");
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

exports.user_create_post = [
  body("name", "Your name must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("last_name", "Your lastname must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("username", "You must specify a username")
    .trim()
    .isLength({ min: 4 })
    .escape()
    .custom(async (value) => {
      const existingUser = await User.findOne({ username: value });
      if (existingUser) {
        throw new Error("This username is already in use.");
      }
    }),
  body("email", "You must specify an email address.")
    .isEmail()
    .custom(async (value) => {
      const existingUser = await User.findOne({ email: value });
      if (existingUser) {
        throw new Error("An user already exists with this email address.");
      }
    }),
  body(
    "password1",
    "Your password must not be empty and must contain at least 6 characters, including at least one uppercase letter and one special character."
  )
    .isLength({ min: 6 })
    .isStrongPassword()
    .escape(),
  body("password2").custom((value, { req }) => {
    return value === req.body.password1;
  }),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const saltHash = utils.genPassword(req.body.password1);
    const salt = saltHash.salt;
    const hash = saltHash.hash;
    const user = new User({
      full_name: `${
        req.body.name.slice(0, 1).toUpperCase() + req.body.name.slice(1)
      } ${
        req.body.last_name.slice(0, 1).toUpperCase() +
        req.body.last_name.slice(1)
      }`,
      username: req.body.username,
      email: req.body.email,
      hash: hash,
      salt: salt,
      author: false,
    });
    if (!errors.isEmpty()) {
      res.status(400).json({
        errors: errors.array(),
      });
    } else {
      await user
        .save()
        .then((user) => {
          const jwt = utils.issueJWT(user);

          res.json({
            success: true,
            user: user,
            accessToken: jwt.accessToken,
            refreshToken: jwt.refreshToken,
            expiresIn: jwt.expires,
          });
        })
        .catch((err) => next(err));
    }
  }),
];

exports.user_login_post = (req, res, next) => {
  User.findOne({ username: req.body.username })
    .then((user) => {
      if (!user) {
        res.status(401).json({ success: false, msg: "User not found." });
      }

      const isValid = utils.validPassword(
        req.body.password,
        user.hash,
        user.salt
      );

      if (isValid) {
        const tokenObject = utils.issueJWT(user);
        res.status(200)
          .json({
            success: true,
            accessToken: tokenObject.accessToken,
            expiresIn: tokenObject.expires,
            user: {
              username: user.username, author: user.author, _id: user._id, token: `Bearer ${tokenObject.accessToken}`,
            },
            Login: true,
          });
      } else {
        res.status(401).json({ success: false, msg: "Wrong Password." });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.user_get = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ success: false, msg: "User not found." });
      } else {
        return res.status(200).json({
          full_name: user.full_name,
          username: user.username,
          author: user.author,
        });
      }
    })
    .catch((err) => {
      next(err);
    });
};
