const express = require("express");
const mainRouter = express.Router();
const usersRouter = require("./user");

// prefix
const prefix = "/optimap-quiz";

// connection subrouter to mainrouter
mainRouter.use(`${prefix}/users`, usersRouter);

// membuat http route
mainRouter.get("/", (req, res) => {
  // mengirim respon ke client
  res.json({
    msg: "Welcome",
  });
});

// export router
module.exports = mainRouter;
