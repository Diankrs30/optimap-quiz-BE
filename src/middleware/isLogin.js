const jwt = require("jsonwebtoken");
const response = require("../helper/response");
const usersRepo = require("../repo/user");

const isLogin = async (req, res, next) => {
  const token = req.header("x-access-token");
  if (!token)
    return response.response(res, {
      status: 401,
      message: "You have to login first",
      data: null,
    });

  const checkWhitelistToken = await usersRepo.checkWhiteListToken(token);
  if (checkWhitelistToken.rows.length === 0) {
    return response.response(res, {
      status: 400,
      message: "You have to login first",
    });
  }

  // verifikasi
  jwt.verify(
    token,
    process.env.SECRET_KEY,
    { issuer: process.env.ISSUER },
    async (error, decodedPayload) => {
      if (error) {
        console.log(error);
        return response.response(res, {
          status: 403,
          message: "Authentication failed",
          error: error.message,
        });
      }
      // payload
      req.userPayload = decodedPayload;
      next();
    }
  );
};

module.exports = { isLogin };
