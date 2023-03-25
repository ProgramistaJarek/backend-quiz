import express from 'express';
import userRouter from './routes/user.routes.js';
const app = express();
const port = 8080;

app.use('/', userRouter);
app.use(express.json());

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
