const usersRepo = require("../repo/user");
const response = require("../helper/response");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userController = {
  register: async (req, res) => {
    try {
      let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
      if (regex.test(req.body.email) === false) {
        return response(res, {
          status: 400,
          message: "Format email is wrong",
        });
      }

      const checkEmail = await usersRepo.checkEmail(req.body.email);

      if (checkEmail.rows.length > 0) {
        return response(res, {
          status: 400,
          message: "Email has been registered",
        });
      }

      const passwordHash = await bcrypt.hash(req.body.password, 10);

      const setData = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: passwordHash,
      };

      const result = await usersRepo.register(setData);
      return response(res, {
        status: 200,
        data: {
          ...result.rows[0],
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: req.body.email,
        },
        message: "Register succes!",
      });
    } catch (error) {
      console.log(error);
      return response(res, {
        error,
        status: 500,
        message: "Internal server error",
      });
    }
  },

  login: async (req, res) => {
    try {
      // validasi
      let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
      if (regex.test(req.body.email) === false) {
        return response(res, {
          status: 400,
          message: "Format email is wrong",
        });
      }
      const checkEmail = await usersRepo.getUserByEmail(req.body.email);
      if (checkEmail.rows.length === 0) {
        return response(res, {
          status: 400,
          message: "Email/password is wrong",
        });
      }

      const hashedPassword = checkEmail.rows[0].password;
      const checkPassword = await bcrypt.compare(
        req.body.password,
        hashedPassword
      );

      if (checkPassword === false) {
        return response(res, {
          status: 401,
          message: "Email/password is wrong",
        });
      }

      const payload = {
        id: checkEmail.rows[0].id,
        email: checkEmail.rows[0].email,
      };

      const token = await jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: "240h",
        issuer: process.env.ISSUER,
      });

      await usersRepo.insertWhiteListToken(token);
      return response(res, {
        status: 200,
        data: {
          id: payload.id,
          email: payload.email,
          token,
        },
        message: "Login success!",
      });
    } catch (error) {
      console.log(error);
      return response(res, {
        error,
        status: 500,
        message: "Internal server error",
      });
    }
  },

  logout: async (req, res) => {
    const token = req.header("x-access-token");
    try {
      const result = await usersRepo.deleteWhiteListToken(token);
      return response(res, {
        status: 200,
        data: result.rows[0],
        message: "Logout success",
      });
    } catch (error) {
      console.log(error);
      return response(res, {
        error,
        status: 500,
        message: "Internal server error",
      });
    }
  },

  getUserById: async (req, res) => {
    try {
      const result = await usersRepo.getUserById(req.userPayload.id);
      const payload = {
        id: result.rows[0].id,
        email: result.rows[0].email,
      };
      return response(res, {
        status: 200,
        data: payload,
        message: "Get success",
      });
    } catch (error) {
      console.log(error);
      return response(res, {
        error,
        status: 500,
        message: "Internal server error",
      });
    }
  },
};

module.exports = userController;
