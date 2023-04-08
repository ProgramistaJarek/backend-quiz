var express = require('express');
var router = express.Router();

const question = require('../controllers/questions.controller');

router.get('/', question.getQuestions);
router.get('/:id', question.getQuestionById);

router.post('/create', question.createQuestion);

router.put('/update/:id', question.updateQuestion);

router.delete('/delete/:id', question.deleteQuestionById);

module.exports = router;
