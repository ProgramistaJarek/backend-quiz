var express = require('express');
var router = express.Router();

const results = require('../controllers/results.controller');
const authenticateToken = require('../utils/authenticateToken');
const tryCatch = require('../utils/tryCatch');

router
  .get('/', tryCatch(results.getResults))
  .get('/most/:most', tryCatch(results.getResultsMost))
  .get('/user', authenticateToken, tryCatch(results.getResultsByUserId));

router.post('/create', tryCatch(results.createResult));

module.exports = router;
