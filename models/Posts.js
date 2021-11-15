const mongoose = require("mongoose");

const PublicPostsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "can't be blank"],
  },
  content: {
    type: String,
    required: [true, "can't be blank"],
  },
  DOC: {
    type: Date,
    default: Date.now,
  },
});

const PrivatePostsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "can't be blank"],
  },
  content: {
    type: String,
    required: [true, "can't be blank"],
  },
  DOC: {
    type: Date,
    default: Date.now,
  },
});

const PublicPosts = mongoose.model("PublicPosts", PublicPostsSchema);
const PrivatePosts = mongoose.model("PrivatePosts", PrivatePostsSchema);

module.exports = { PublicPosts, PrivatePosts };
