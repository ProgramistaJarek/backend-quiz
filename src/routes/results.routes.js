var express = require('express');
var router = express.Router();

const results = require('../controllers/results.controller');

router.get('/', results.getResults);
router.get('/:id', results.getResultById);

router.post('/create', results.createResult);

router.put('/update/:id', results.updateResult);

router.delete('/delete/:id', results.deleteResultById);

module.exports = router;
