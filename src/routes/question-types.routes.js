var express = require('express');
var router = express.Router();

const questionTypes = require('../controllers/question-types.controller');
const authenticateToken = require('../utils/authenticateToken');
const tryCatch = require('../utils/tryCatch');

router.get('/', tryCatch(questionTypes.getQuestionTypes));

router.post(
  '/create',
  authenticateToken,
  tryCatch(questionTypes.createQuestionType),
);
router.delete(
  '/delete/:id',
  authenticateToken,
  tryCatch(questionTypes.deleteQuestionTypeById),
);

module.exports = router;
