var express = require('express');
var router = express.Router();

const quizzes = require('../controllers/quizzes.controller');

router.get('/', quizzes.getQuizzes);
router.get('/:id', quizzes.getQuizById);
router.get('/quiz/:id', quizzes.getQuiz);

router.post('/create', quizzes.createQuiz);

router.put('/update/:id', quizzes.updateQuiz);

router.delete('/delete/:id', quizzes.deleteQuizById);

module.exports = router;
