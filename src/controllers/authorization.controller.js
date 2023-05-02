const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const db = require('../models');
const UserModel = db.user;

const generateAccessToken = require('../utils/generateToken');
const error = require('../errors');

const loginUser = async (req, res) => {
  let { username, password } = req.body;

  if (
    typeof username !== 'string' ||
    typeof password !== 'string' ||
    Object.keys(req.body).length !== 2
  ) {
    throw new error.BadRequestError(
      'Error! You need to provide username and password.',
    );
  }

  const existingUser = await UserModel.findOne({
    where: { Nickname: { [Op.eq]: username } },
  });
  if (!existingUser) throw new error.BadRequestError('User do not exist');

  if (!(await bcrypt.compare(password, existingUser.Password)))
    throw new error.BadRequestError('Wrong details please check at once');

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
  const { username, password } = req.body;

  if (
    typeof username !== 'string' ||
    typeof password !== 'string' ||
    Object.keys(req.body).length !== 2
  ) {
    throw new error.BadRequestError(
      'Error! You need to provide username and password.',
    );
  }

  const response = await UserModel.findAll({
    where: { Nickname: { [Op.eq]: username } },
  });
  if (response.length)
    throw new error.BadRequestError('Error! Username is taken');

  let passwordHash;
  await bcrypt.hash(password, 10).then((hash) => {
    passwordHash = hash;
  });

  const existingUser = await UserModel.create({
    Nickname: username,
    Password: passwordHash,
  });

  const token = generateAccessToken({
    username: existingUser.Nickname,
    id: existingUser.ID,
  });
  if (!token) throw new error.BadRequestError('Error! Something went wrong.');

  res.status(201).json({
    id: existingUser.ID,
    Nickname: existingUser.Nickname,
    token: token,
  });
};

const getUser = async (req, res) => {
  const existingUser = await UserModel.findOne({
    where: { ID: { [Op.eq]: req.user.id } },
  });
  if (!existingUser)
    throw new error.BadRequestError('Error! Something went wrong.');

  res.status(200).json({
    ID: existingUser.ID,
    Nickname: existingUser.Nickname,
    token: req.user.token,
  });
};

const changeLogin = async (req, res) => {
  const { oldUsername, newUsername } = req.body;

  if (
    typeof oldUsername !== 'string' ||
    typeof newUsername !== 'string' ||
    Object.keys(req.body).length !== 2
  ) {
    throw new error.BadRequestError(
      'Error! You need to provide old and new username.',
    );
  }

  if (oldUsername === newUsername)
    throw new error.BadRequestError('Username cannot be the same.');

  const user = await UserModel.findOne({
    where: { Nickname: { [Op.eq]: oldUsername } },
  });
  if (!user) throw new error.BadRequestError('User does not exist.');
  if (user.ID !== req.user.id)
    throw new error.BadRequestError('Error! Something went wrong.');

  const checkIfExist = await UserModel.findOne({
    where: { Nickname: { [Op.eq]: newUsername } },
  });
  if (checkIfExist) throw new error.BadRequestError('Username is taken.');

  await UserModel.update(
    { Nickname: newUsername },
    { where: { ID: { [Op.eq]: user.ID } } },
  );
  res.json({ message: 'Username updated successfully' });
};

const changePassword = async (req, res) => {
  const { username, oldPassword, newPassword } = req.body;

  if (
    typeof username !== 'string' ||
    typeof oldPassword !== 'string' ||
    typeof newPassword !== 'string' ||
    Object.keys(req.body).length !== 3
  ) {
    throw new error.BadRequestError(
      'Error! You need to provide username and old and new password.',
    );
  }

  if (oldPassword === newPassword)
    throw new error.BadRequestError('Password cannot be the same.');

  const user = await UserModel.findOne({
    where: { Nickname: { [Op.eq]: username } },
  });
  if (!user) throw new error.BadRequestError('User does not exist.');
  if (user.ID !== req.user.id)
    throw new error.BadRequestError('Error! Something went wrong.');

  const isMatch = await bcrypt.compare(oldPassword, user.Password);
  if (!isMatch) throw new error.BadRequestError('Old password is incorrect.');

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await UserModel.update(
    { Password: passwordHash },
    { where: { ID: { [Op.eq]: user.ID } } },
  );
  res.json({ message: 'Password updated successfully' });
};

module.exports = {
  loginUser,
  signupUser,
  getUser,
  changeLogin,
  changePassword,
};
