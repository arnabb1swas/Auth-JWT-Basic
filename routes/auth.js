const router = require("express").Router();
const mongoose = require("mongoose");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

require("dotenv/config");
const UserCred = require("../models/UserCred");

mongoose.connect(
  process.env.DBCONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to DB");
  }
);

// Sign up Route

router.post(
  "/signup",
  [
    check("email", "Please Provide a Valid Email").isEmail(),
    check("password", "Please Provide a Valid Password").isLength({
      min: 8,
      max: 16,
    }),
  ],
  async (req, res) => {
    const { email, password } = req.body;
    // User Cred Validation
    const ValidationErrors = validationResult(req);

    if (!ValidationErrors.isEmpty()) {
      return res.status(400).json({
        errors: ValidationErrors.array(),
      });
    }

    // User Doesn't Already Exist
    const newuser = await UserCred.findOne({ email: email }).exec();

    if (newuser) {
      return res.status(400).json({
        errors: [
          {
            msg: "This User Already Exist!!",
          },
        ],
      });
    }

    // Hashing The Password Before Saving
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    // Saving User In DB
    const user = new UserCred({
      email: email,
      password: hashedPass,
    });

    try {
      const savedUser = await user.save();
    } catch (error) {
      res.json({ msg: error });
    }

    // Returning the User a Token
    const token = await JWT.sign(
      { email: email },
      process.env.SECRET_TOKEN_KEY,
      {
        expiresIn: "4h",
      }
    );

    res.json({ token });
  }
);

// Sign in Route

router.post(
  "/signin",
  [
    check("email", "Please Provide a Valid Email").isEmail(),
    check("password", "Please Provide a Valid Password").isLength({
      min: 8,
      max: 16,
    }),
  ],
  async (req, res) => {
    // Collection User Provided Creds
    const { email, password } = req.body;
    // Checking If The User Exists in DB or Not
    const newuser = await UserCred.findOne({ email: email }).exec();

    if (!newuser) {
      return res.status(400).json({
        errors: [
          {
            msg: "This User Doesn't Exist!!",
          },
        ],
      });
    }

    //Comparing Password
    let isValidUser = await bcrypt.compare(password, newuser.password);

    if (!isValidUser) {
      return res.status(400).json({
        errors: [
          {
            msg: "Invalid Credential!!",
          },
        ],
      });
    }

    // Returning the User a Token
    const token = await JWT.sign(
      { email: email },
      process.env.SECRET_TOKEN_KEY,
      {
        expiresIn: "28d",
      }
    );

    res.json({ token });
  }
);

router.get("/all", (req, res) => {
  UserCred.find((err, data) => {
    if (err) {
      res.json(err);
    } else {
      res.json(data);
    }
  });
});

module.exports = router;
