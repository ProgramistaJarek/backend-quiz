require('dotenv').config();

const jwt = require('jsonwebtoken');

const checkForToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    req.user = { ...user };

    next();
  });
};

module.exports = checkForToken;
