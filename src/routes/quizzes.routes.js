var express = require('express');
var router = express.Router();

const quizzes = require('../controllers/quizzes.controller');
const authenticateToken = require('../utils/authenticateToken');
const checkForToken = require('../utils/checkForToken');

router
  .get('/', quizzes.getQuizzes)
  .get('/:id', quizzes.getQuizById)
  .get('/quiz/:id', checkForToken, quizzes.getQuiz);

router.post('/create/', authenticateToken, quizzes.createQuiz);

router.put('/update/:id', authenticateToken, quizzes.updateQuiz);

router.delete('/delete/:id', authenticateToken, quizzes.deleteQuizById);

module.exports = router;
