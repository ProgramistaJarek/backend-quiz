const User = require('../models/user.model');
const { v4: uuidv4 } = require('uuid');
const db = require('../configs/db');

const Users = [];

const getUsers = async (req, res) => {
  const rows = await db.query(`SELECT * FROM Users`);
  res.json({ usersLocal: Users, db: rows });
};

const createUser = (req, res) => {
  console.log(req.body);
  const { firstName, lastName } = req.body;
  const id = uuidv4();
  const newUser = new User(id, firstName, lastName);
  Users.push(newUser);
  res
    .status(201)
    .json({ message: 'User created successfully', createdUser: newUser });
};

const deleteUser = (req, res) => {
  const id = Number(req.params.id);
  const userId = Users.findIndex((x) => x.id === id);
  if (userId < 0) {
    throw new Error('Could not find user!');
  }

  const deletedData = { id: Users[userId].id, text: Users[userId].firstName };

  Users.splice(userId, 1);
  res.status(201).json({
    message: `${deletedData.id}: ${deletedData.text} deleted successfully`,
  });
};

module.exports = {
  getUsers,
  createUser,
  deleteUser,
};
