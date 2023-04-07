const UserModel = require('../models/user.model');

const getUsers = async (req, res) => {
  const user = new UserModel();
  try {
    const users = await user.findAll();
    res.json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};

const getUserById = async (req, res) => {
  const user = new UserModel();
  const userId = req.params.id;
  try {
    const users = await user.findById(userId);
    res.json({ users });
  } catch (error) {
    if (error?.message) {
      res.status(404).json({ error: error.message });
    } else {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  }
};

const createUser = async (req, res) => {
  try {
    await UserModel.createUser(req.body);

    res.status(201).json({ message: `User has been created` });
  } catch (error) {
    if (error?.message) {
      res.status(404).json({ error: error.message });
    } else {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  }
};

const updateUser = async (req, res) => {
  const userId = req.params.id;
  const userReq = req.body;

  try {
    const user = await UserModel.findById(userId);
    console.log({ ...user[0], ...userReq });
    await UserModel.updateUser(userId, { ...user[0], ...userReq });
    res.status(201).json({ message: `User has been updated` });
  } catch (error) {
    if (error?.message) {
      res.status(404).json({ error: error.message });
    } else {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  }
};

const deleteUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    await UserModel.findById(userId);

    await UserModel.deleteUser(userId);
    res
      .status(200)
      .json({ message: `User with ID ${userId} has been deleted` });
  } catch (error) {
    if (error?.message) {
      res.status(404).json({ error: error.message });
    } else {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUserById,
};
