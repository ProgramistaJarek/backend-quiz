var express = require('express');
var router = express.Router();

const user = require('../controllers/userController');

router.get('/', user.getUsers);
router.post('/', user.createUser);
router.delete('/delete/:id', user.deleteUser);

module.exports = router;
