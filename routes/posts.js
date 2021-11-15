const router = require("express").Router();
const Authenticator = require("../middleware/Authenticator");
const mongoose = require("mongoose");

require("dotenv/config");
const { PublicPosts, PrivatePosts } = require("../models/Posts");

mongoose.connect(
  process.env.DBCONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to Post.DB");
  }
);

router.get("/public", (req, res) => {
  PublicPosts.find((err, Data) => {
    if (err) {
      res.json(err);
    } else {
      res.json(Data);
    }
  });
});

router.get("/private", Authenticator, (req, res) => {
  PrivatePosts.find((err, Data) => {
    if (err) {
      res.json(err);
    } else {
      res.json(Data);
    }
  });
});

router.post("/createpub", async (req, res) => {
  const { title, content } = req.body;
  const post = new PublicPosts({
    title,
    content,
  });

  try {
    const savedPost = await post.save();
    res.json(savedPost);
  } catch (error) {
    res.json({ msg: error });
  }
});

router.post("/createpri", async (req, res) => {
  const { title, content } = req.body;
  const post = new PrivatePosts({
    title,
    content,
  });

  try {
    const savedPost = await post.save();
    res.json(savedPost);
  } catch (error) {
    res.json({ msg: error });
  }
});

module.exports = router;
