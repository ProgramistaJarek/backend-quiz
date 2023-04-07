var express = require('express');
var router = express.Router();

const user = require('../controllers/user.controller');

router.get('/', user.getUsers);
router.get('/:id', user.getUserById);

/* 
router.post('/create', user.createUser);

router.put('/update/:id', user.updateUser);

router.delete('/delete/:id', user.deleteUserById); */

module.exports = router;
