var express = require('express');
var router = express.Router();

const quizTypes = require('../controllers/quiz-types.controller');

router.get('/', quizTypes.getQuizTypes);
router.get('/:id', quizTypes.getQuizTypeById);

router.post('/create', quizTypes.createQuizType);

router.put('/update/:id', quizTypes.updateQuizType);

router.delete('/delete/:id', quizTypes.deleteQuizTypeById);

module.exports = router;
