import { Router } from 'express';

const userRouter = Router();

userRouter.get('/list', (req, res) => {
  res.send('user list');
});

userRouter.get('/new', (req, res) => {
  res.send('user new');
});

export default userRouter;
