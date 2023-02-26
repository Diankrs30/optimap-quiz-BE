const postgreDb = require("../config/postgre");

const register = (body) => {
  return new Promise((resolve, reject) => {
    const { first_name, last_name, email, password } = body;

    const query =
      "insert into users (first_name, last_name, email, password) values ($1,$2,$3,$4) returning id";

    postgreDb.query(
      query,
      [first_name, last_name, email, password],
      (error, result) => {
        if (error) {
          console.log(error);
          return reject(error);
        }
        return resolve(result);
      }
    );
  });
};

const checkEmail = (email) => {
  return new Promise((resolve, reject) => {
    const query = "select * from users where email = $1";

    postgreDb.query(query, [email], (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      return resolve(result);
    });
  });
};

const getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const query = "select * from users where email = $1";

    postgreDb.query(query, [email], (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      return resolve(result);
    });
  });
};

const insertWhiteListToken = (token) => {
  return new Promise((resolve, reject) => {
    const query = " insert into white_list_token (token) values ($1)";
    postgreDb.query(query, [token], (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      resolve(result);
    });
  });
};

const checkWhiteListToken = (token) => {
  return new Promise((resolve, reject) => {
    const query = "select * from white_list_token where token = $1";
    postgreDb.query(query, [token], (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      resolve(result);
    });
  });
};

const deleteWhiteListToken = (token) => {
  return new Promise((resolve, reject) => {
    const query = "delete from white_list_token where token = $1";

    postgreDb.query(query, [token], (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      resolve(result);
    });
  });
};

const usersRepo = {
  register,
  checkEmail,
  getUserByEmail,
  insertWhiteListToken,
  checkWhiteListToken,
  deleteWhiteListToken,
};

module.exports = usersRepo;
