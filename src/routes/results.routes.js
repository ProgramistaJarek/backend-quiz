var express = require('express');
var router = express.Router();

const results = require('../controllers/results.controller');
const authenticateToken = require('../utils/authenticateToken');
const tryCatch = require('../utils/tryCatch');

router
  .get('/', tryCatch(results.getResults))
  .get('/most/:most', tryCatch(results.getResultsMost));

router.post('/create', tryCatch(results.createResult));

router.delete('/delete/:id', tryCatch(results.deleteResultById));

module.exports = router;
