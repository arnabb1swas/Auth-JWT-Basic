const mongoose = require("mongoose");

const UserAuthSchema = new mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "can't be blank"],
    match: [/\S+@\S+\.\S+/, "is invalid"],
    index: true,
  },
  password: {
    type: String,
    required: [true, "can't be blank"],
  },
  DOC: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("UserCred", UserAuthSchema);
