var express = require('express');
var router = express.Router();

const auth = require('../controllers/authorization.controller');
const authenticateToken = require('../utils/authenticateToken');
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.post('/login', auth.loginUser);
router.post('/signup', auth.signupUser);
router.get('/tak', authenticateToken, (req, res) => {
  res
    .status(200)
    .json({ success: false, message: 'Error! Token was not provided.' });
});

module.exports = router;
