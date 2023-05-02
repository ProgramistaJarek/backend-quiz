var express = require('express');
var router = express.Router();

const auth = require('../controllers/authorization.controller');
const authenticateToken = require('../utils/authenticateToken');
const tryCatch = require('../utils/tryCatch');

router
  .post('/login', tryCatch(auth.loginUser))
  .post('/signup', tryCatch(auth.signupUser))
  .post('/change/login', authenticateToken, tryCatch(auth.changeLogin))
  .post('/change/password', authenticateToken, tryCatch(auth.changePassword));

router.get('/getUser', authenticateToken, tryCatch(auth.getUser));

module.exports = router;
