var express = require('express');
var router = express.Router();

const answers = require('../controllers/answers.controller');

router.get('/', answers.getAnswers);
router.get('/:id', answers.getAnswerById);

router.post('/create', answers.createAnswer);

router.put('/update/:id', answers.updateAnswer);

router.delete('/delete/:id', answers.deleteAnswerById);

module.exports = router;
