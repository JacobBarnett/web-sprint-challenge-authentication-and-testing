const db = require("../../data/dbConfig.js");
const bcrypt = require("bcryptjs");

async function registerUser(creds) {
  const { username, password } = creds;
  const hash = bcrypt.hashSync(password, 7);
  const [id] = await db("users").insert({
    username,
    password: hash,
  });
  const user = await get(id);
  return user;
}

async function get(id) {
  const user = await db("users").where("users.id", id).first();
  if (!user) {
    return;
  }
  return user;
}
function validatePassword(user, password) {
  return bcrypt.compareSync(password, user.password);
}

async function findByUserName(username) {
  const user = await db("users").where("users.username", username).first();
  if (!user) {
    return;
  }
  return user;
}

module.exports = {
  registerUser,
  get,
  findByUserName,
  validatePassword,
};
