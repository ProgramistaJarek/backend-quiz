const express = require('express');

const user = require('../controllers/userController.js');
const userRouter = express.Router();

userRouter.get('/', user.getUsers);

userRouter.post('/', user.createUser);

userRouter.delete('/delete/:id', user.deleteUser);

module.exports = userRouter;
