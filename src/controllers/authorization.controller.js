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
  await bcrypt.hash(password, 10).then((hash) => {
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

const changeLogin = async (req, res) => {
  const model = new UserModel();
  const { oldUsername, newUsername } = req.body;

  if (oldUsername === newUsername)
    throw new BadRequestError('Username cannot be the same.');

  const user = await model.findByUsername(oldUsername);
  if (!user) throw new BadRequestError('User does not exist.');
  if (user.ID !== req.user.id)
    throw new BadRequestError('Error! Something went wrong.');

  user.Nickname = newUsername;
  await model.update(user.ID, user);
  res.json({ message: 'Username updated successfully' });
};

const changePassword = async (req, res) => {
  const model = new UserModel();
  const { username, oldPassword, newPassword } = req.body;

  if (oldPassword === newPassword)
    throw new BadRequestError('Password cannot be the same.');

  const user = await model.findByUsername(username);
  if (!user) throw new BadRequestError('User does not exist.');
  if (user.ID !== req.user.id)
    throw new BadRequestError('Error! Something went wrong.');

  const isMatch = await bcrypt.compare(oldPassword, user.Password);
  if (!isMatch) throw new BadRequestError('Old password is incorrect.');

  user.Password = await bcrypt.hash(newPassword, 10);
  await model.update(user.ID, user);
  res.json({ message: 'Password updated successfully' });
};

module.exports = {
  loginUser,
  signupUser,
  getUser,
  changeLogin,
  changePassword,
};
