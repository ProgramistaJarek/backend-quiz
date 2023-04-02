const express = require('express');
const userRouter = require('./routes/user.routes');
const errorHandeler = require('./middlewares/errorHandeler');

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use('/user', userRouter);

app.use(errorHandeler);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
