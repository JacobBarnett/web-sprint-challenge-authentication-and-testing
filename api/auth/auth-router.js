const { response } = require("../server");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { registerUser, findByUserName, validatePassword } = require("./model");
const { secret } = require("../auth/secret");

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400);
    res.end("username and password required");
    return;
  }
  try {
    const user = await registerUser(req.body);
    res.setHeader("Content-type", "application/json");
    res.end(JSON.stringify(user));
  } catch (e) {
    res.status(500);
    if (e.code === "SQLITE_CONSTRAINT_UNIQUE") {
      res.end("username taken");
      return;
    }
    console.log(e);
    res.end();
  }
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400);
    res.end("username and password required");
    return;
  }
  const user = await findByUserName(username);
  if (!user || !validatePassword(user, password)) {
    res.status(403);
    res.end("invalid credentials");
    return;
  }
  const token = jwt.sign({ id: user.id }, secret);

  res.setHeader("Content-type", "application/json");
  res.end(JSON.stringify({ message: `welcome, ${user.username}`, token }));
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
});

module.exports = router;
