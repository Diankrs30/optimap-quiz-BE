const response = require("../helper/response");

const registerBody = (req, res, next) => {
  // validasi body
  const { body } = req;
  const registerBody = ["first_name", "last_name", "email", "password"];
  const bodyProperty = Object.keys(body);
  const isBodyValid =
    registerBody.filter((property) => !bodyProperty.includes(property))
      .length == 0
      ? true
      : false;
  // console.log(isBodyValid);
  if (!isBodyValid)
    return response(res, { status: 400, message: "Invalid Body" });
  next();
};

const loginBody = (req, res, next) => {
  // validasi body
  const { body } = req;
  const registerBody = ["email", "password"];
  const bodyProperty = Object.keys(body);
  const isBodyValid =
    registerBody.filter((property) => !bodyProperty.includes(property))
      .length == 0
      ? true
      : false;
  // console.log(isBodyValid);
  if (!isBodyValid)
    return response(res, { status: 400, message: "Invalid Body" });
  next();
};

module.exports = { registerBody, loginBody };
