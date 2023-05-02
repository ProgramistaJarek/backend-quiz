var express = require('express');
var router = express.Router();

const quizzes = require('../controllers/quizzes.controller');
const authenticateToken = require('../utils/authenticateToken');
const checkForToken = require('../utils/checkForToken');
const tryCatch = require('../utils/tryCatch');

router
  .get('/', tryCatch(quizzes.getQuizzes))
  .get('/quiz/:id', checkForToken, tryCatch(quizzes.getQuiz))
  .get(
    '/quiz/new/:order/:many',
    checkForToken,
    tryCatch(quizzes.getQuizByDate),
  );

router.post('/create/', authenticateToken, tryCatch(quizzes.createQuiz));

router.put('/update/:id', authenticateToken, tryCatch(quizzes.updateQuiz));

router.delete(
  '/delete/:id',
  authenticateToken,
  tryCatch(quizzes.deleteQuizById),
);

module.exports = router;
