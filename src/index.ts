import express from 'express';
import { errorHandeler } from './middlewares/errorHandeler.js';
import userRouter from './routes/user.routes.js';
const app = express();
const port = 8080;

app.use(express.json());
app.use('/user', userRouter);

app.use(errorHandeler);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
