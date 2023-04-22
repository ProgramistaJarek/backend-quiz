require('dotenv').config();

const jwt = require('jsonwebtoken');

const logoutToken = (req, res) => {
  const authHeader = req.headers['authorization'];

  jwt.sign(
    authHeader.split(' ')[1],
    process.env.TOKEN_SECRET,
    { expiresIn: '1s' },
    (logout, err) => {
      console.log(logout);
      if (logout) {
        res.send({ msg: 'You have been Logged Out' });
      } else {
        res.send({ msg: 'Error' });
      }
    },
  );
};

module.exports = logoutToken;
