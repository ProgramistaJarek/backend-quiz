var express = require('express');
var router = express.Router();

const quizTypes = require('../controllers/quiz-types.controller');
const authenticateToken = require('../utils/authenticateToken');
const tryCatch = require('../utils/tryCatch');

router.get('/', tryCatch(quizTypes.getQuizTypes));
router.get('/:id', tryCatch(quizTypes.getQuizTypeById));

router.post('/create', authenticateToken, tryCatch(quizTypes.createQuizType));

router.put(
  '/update/:id',
  authenticateToken,
  tryCatch(quizTypes.updateQuizType),
);

router.delete(
  '/delete/:id',
  authenticateToken,
  tryCatch(quizTypes.deleteQuizTypeById),
);

module.exports = router;
