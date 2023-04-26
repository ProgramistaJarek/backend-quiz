var express = require('express');
var router = express.Router();

const questionTypes = require('../controllers/question-types.controller');
const authenticateToken = require('../utils/authenticateToken');

router.get('/', questionTypes.getQuestionTypes);
router.get('/:id', questionTypes.getQuestionTypeById);

router.post('/create', authenticateToken, questionTypes.createQuestionType);

router.put('/update/:id', authenticateToken, questionTypes.updateQuestionType);

router.delete(
  '/delete/:id',
  authenticateToken,
  questionTypes.deleteQuestionTypeById,
);

module.exports = router;
