const bcrypt = require('bcrypt');
const UserModel = require('../models/user.model');
const generateAccessToken = require('../utils/generateToken');
const BadRequestError = require('../errors/bad-request');
const CustomAPIError = require('../errors/custom-api');
const { error } = require('console');

const loginUser = async (req, res, next) => {
  const model = new UserModel();
  let { username, password } = req.body;

  let existingUser;
  try {
    existingUser = await model.findByUsername(username);
  } catch {
    const error = new BadRequestError('Error! Something went wrong.');
    return next(error);
  }

  try {
    if (!(await bcrypt.compare(password, existingUser.Password))) throw error;
  } catch {
    const error = new CustomAPIError('Wrong details please check at once');
    return next(error);
  }

  try {
    const token = generateAccessToken({
      username: existingUser.Nickname,
      id: existingUser.ID,
    });
    res.status(200).json({
      id: existingUser.ID,
      Nickname: existingUser.Nickname,
      token: token,
    });
  } catch (err) {
    const error = new CustomAPIError('Error! Something went wrong.');
    return next(error);
  }
};

const signupUser = async (req, res, next) => {
  const model = new UserModel();
  const { username, password } = req.body;

  let passwordHash;
  await bcrypt.hash(password, 10).then(function (hash) {
    passwordHash = hash;
  });

  let existingUser;
  try {
    existingUser = await model.signUp(username, passwordHash);
  } catch {
    const error = new CustomAPIError('username');
    return next(error);
  }

  try {
    const token = generateAccessToken({
      username: existingUser.Nickname,
      id: existingUser.ID,
    });
    res.status(201).json({
      id: existingUser.ID,
      Nickname: existingUser.Nickname,
      token: token,
    });
  } catch (err) {
    const error = new CustomAPIError('Error! Something went wrong.');
    return next(error);
  }
};

const logoutUser = async (req, res, next) => {
  logoutToken();
};

const getUser = async (req, res, next) => {
  const model = new UserModel();

  try {
    existingUser = await model.findById(req.user.id);
    res.status(200).json({
      ID: existingUser.ID,
      Nickname: existingUser.Nickname,
      token: req.user.token,
    });
  } catch {
    const error = new BadRequestError('Error! Something went wrong.');
    return next(error);
  }
};

module.exports = {
  loginUser,
  signupUser,
  logoutUser,
  getUser,
};
