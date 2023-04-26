var express = require('express');
var router = express.Router();

const quizTypes = require('../controllers/quiz-types.controller');
const authenticateToken = require('../utils/authenticateToken');

router.get('/', quizTypes.getQuizTypes);
router.get('/:id', quizTypes.getQuizTypeById);

router.post('/create', authenticateToken, quizTypes.createQuizType);

router.put('/update/:id', authenticateToken, quizTypes.updateQuizType);

router.delete('/delete/:id', authenticateToken, quizTypes.deleteQuizTypeById);

module.exports = router;
