var express = require('express');
var router = express.Router();

const quizzes = require('../controllers/quizzes.controller');

router.get('/', quizzes.getQuizzes);

module.exports = router;
