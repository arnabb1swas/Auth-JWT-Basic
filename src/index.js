const express = require("express");
const posts = require("../routes/posts");
const auth = require("../routes/auth");
require("dotenv/config");

const app = express();
app.use(express.json());
app.use("/auth", auth);
app.use("/posts", posts);

app.get("/", (req, res) => {
  res.json({
    msg: "JWT AUTH PRACTICE",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running on  ${PORT}`);
});
