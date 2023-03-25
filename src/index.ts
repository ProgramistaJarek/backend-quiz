import express from 'express';
const app = express();
const port = 4000;

app.get('/user', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.send({ msg: 'user!' });
});

app.delete('/user', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.send({ msg: 'delete user!' });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
