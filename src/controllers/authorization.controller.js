const bcrypt = require('bcrypt');
const UserModel = require('../models/user.model');
const generateAccessToken = require('../utils/generateToken');
const BadRequestError = require('../errors/bad-request');

const loginUser = async (req, res) => {
  const model = new UserModel();
  let { username, password } = req.body;

  const existingUser = await model.findByUsername(username);
  if (!existingUser) throw new BadRequestError('User do not exist');

  if (!(await bcrypt.compare(password, existingUser.Password)))
    throw new BadRequestError('Wrong details please check at once');

  const token = generateAccessToken({
    username: existingUser.Nickname,
    id: existingUser.ID,
  });
  res.status(200).json({
    id: existingUser.ID,
    Nickname: existingUser.Nickname,
    token: token,
  });
};

const signupUser = async (req, res) => {
  const model = new UserModel();
  const { username, password } = req.body;

  let passwordHash;
  await bcrypt.hash(password, 10).then(function (hash) {
    passwordHash = hash;
  });

  const existingUser = await model.signUp(username, passwordHash);
  if (!existingUser) throw new BadRequestError('Error! Username is taken');

  const token = generateAccessToken({
    username: existingUser.Nickname,
    id: existingUser.ID,
  });
  if (!token) throw new BadRequestError('Error! Something went wrong.');

  res.status(201).json({
    id: existingUser.ID,
    Nickname: existingUser.Nickname,
    token: token,
  });
};

const getUser = async (req, res) => {
  const model = new UserModel();

  const existingUser = await model.findById(req.user.id);
  if (!existingUser) throw new BadRequestError('Error! Something went wrong.');

  res.status(200).json({
    ID: existingUser.ID,
    Nickname: existingUser.Nickname,
    token: req.user.token,
  });
};

module.exports = {
  loginUser,
  signupUser,
  getUser,
};
