var express = require('express');
var router = express.Router();

const quizzes = require('../controllers/quizzes.controller');
const authenticateToken = require('../utils/authenticateToken');
const checkForToken = require('../utils/checkForToken');

router.get('/', quizzes.getQuizzes);
router.get('/:id', quizzes.getQuizById);
router.get('/quiz/:id', checkForToken, quizzes.getQuiz);

router.post('/create/', authenticateToken, quizzes.createQuiz);

router.put('/update/:id', quizzes.updateQuiz);

router.delete('/delete/:id', quizzes.deleteQuizById);

module.exports = router;
