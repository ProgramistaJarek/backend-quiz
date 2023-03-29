import { Router } from 'express';

import {
  createUser,
  deleteUser,
  getUsers,
} from '../controllers/userController.js';

const userRouter = Router();

userRouter.get('/', getUsers);

userRouter.post('/', createUser);

userRouter.delete('/delete/:id', deleteUser);

export default userRouter;
