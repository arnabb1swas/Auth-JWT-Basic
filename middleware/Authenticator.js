const JWT = require("jsonwebtoken");
const UserCred = require("../models/UserCred");

module.exports = async (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(400).json({
      errors: [
        {
          msg: "Token Not Found!!",
        },
      ],
    });
  }

  try {
    const userCred = await JWT.verify(token, process.env.SECRET_TOKEN_KEY);
    //req.user = userCred.email; //is needed in this project
    console.log(UserCred);
    next();
  } catch (error) {
    return res.status(400).json({
      errors: [
        {
          msg: "Token Not Valid!!",
        },
      ],
    });
  }
};
