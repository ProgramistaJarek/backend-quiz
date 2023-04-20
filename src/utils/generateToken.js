require('dotenv').config();

const jwt = require('jsonwebtoken');

const generateAccessToken = (username) => {
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '3600s' });
};

module.exports = generateAccessToken;
