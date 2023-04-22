var express = require('express');
var router = express.Router();

const auth = require('../controllers/authorization.controller');
const authenticateToken = require('../utils/authenticateToken');
const logoutToken = require('../utils/logout');

router.post('/login', auth.loginUser);
router.post('/signup', auth.signupUser);
router.post('/logout', authenticateToken, logoutToken);
router.get('/getUser', authenticateToken, auth.getUser);

module.exports = router;
