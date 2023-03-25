import { RequestHandler } from 'express';
import { User } from '../models/user.model.js';

const Users: User[] = [];

export const getUsers: RequestHandler = (req, res) => {
  res.json(Users);
};

export const createUser: RequestHandler = (req, res) => {
  console.log(req.body);
  const { firstName, lastName } = req.body as {
    firstName: string;
    lastName: string;
  };
  const id = Math.floor(Math.random() * 100);
  const newUser = new User(id, firstName, lastName);
  Users.push(newUser);
  res
    .status(201)
    .json({ message: 'User created successfully', createdUser: newUser });
};

export const deleteUser: RequestHandler = (req, res) => {
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
