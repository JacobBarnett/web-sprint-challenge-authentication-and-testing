const jwt = require("jsonwebtoken");
const { secret } = require("../auth/secret");

module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    res.status(403);
    res.end("token required");
    return;
  }

  const token = authHeader.substring(7);
  try {
    jwt.verify(token, secret);
  } catch {
    res.status(403);

    res.end("token invalid");
    return;
  }
  next();
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
};
