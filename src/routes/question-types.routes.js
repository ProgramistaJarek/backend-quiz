var express = require('express');
var router = express.Router();

const questionTypes = require('../controllers/question-types.controller');

router.get('/', questionTypes.getQuestionTypes);
router.get('/:id', questionTypes.getQuestionTypeById);

router.post('/create', questionTypes.createQuestionType);

router.put('/update/:id', questionTypes.updateQuestionType);

router.delete('/delete/:id', questionTypes.deleteQuestionTypeById);

module.exports = router;
