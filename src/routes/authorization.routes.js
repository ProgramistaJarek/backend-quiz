var express = require('express');
var router = express.Router();

const auth = require('../controllers/authorization.controller');
const authenticateToken = require('../utils/authenticateToken');
const tryCatch = require('../utils/tryCatch');

router.post('/login', tryCatch(auth.loginUser));
router.post('/signup', tryCatch(auth.signupUser));
router.get('/getUser', authenticateToken, tryCatch(auth.getUser));

module.exports = router;
