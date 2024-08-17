const jwt = require("jsonwebtoken");

require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;

const generateAccessToken = (id, roles /* , extraData = {} */) => {
  const payload = {
    id,
    roles
    //...extraData  если будет необходимо
  };

  return jwt.sign(payload, jwtSecret, { expiresIn: "30d" });
};

module.exports = generateAccessToken;
