const express = require("express");
const usersRouter = express.Router();
const validate = require("../middleware/validate");
const { isLogin } = require("../middleware/isLogin");
const { register, login, logout, getUserById } = require("../controllers/user");

usersRouter.post("/register/", validate.registerBody, register);
usersRouter.post("/login/", validate.loginBody, login);
usersRouter.delete("/logout", isLogin, logout);
usersRouter.get("/", isLogin, getUserById);

module.exports = usersRouter;
