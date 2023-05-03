const { Op } = require('sequelize');
const db = require('../models');
const QuizTypesModel = db.quizTypes;

const error = require('../errors');
const helpers = require('../utils/helpers');

const getQuizTypes = async (req, res) => {
  const quizTypes = await QuizTypesModel.findAll({
    attributes: ['id', 'type'],
  });

  res.json(quizTypes);
};

const getQuizTypeById = async (req, res) => {
  const quizTypeId = req.params.id;
  helpers.checkIfNumber(quizTypeId);

  const quizType = await QuizTypesModel.findOne({
    attributes: ['id', 'type'],
    where: { id: { [Op.eq]: quizTypeId } },
  });
  if (!quizType)
    throw new error.BadRequestError('Error! Something went wrong.');

  res.json(quizType);
};

const createQuizType = async (req, res) => {
  if (!req.body.type || Object.keys(req.body).length !== 1) {
    throw new error.BadRequestError('Error! You need to provide type.');
  }

  const response = await QuizTypesModel.findAll();
  response.forEach((e) => {
    if (
      e.type.replace(/\s+/g, '').toLowerCase() ===
      req.body.type.replace(/\s+/g, '').toLowerCase()
    )
      throw new error.BadRequestError('type actully exist');
  });

  const created = await QuizTypesModel.create({
    type: req.body.type.replace(/\s+/g, ' '),
  });
  if (!created) throw new error.BadRequestError('Error! Something went wrong.');

  res.status(201).json({ message: `Quiz type has been created` });
};

const updateQuizType = async (req, res) => {
  const quizTypeId = req.params.id;
  const quizTypeBody = req.body;

  helpers.checkIfNumber(quizTypeId);

  if (!quizTypeBody.type || Object.keys(req.body).length !== 1) {
    throw new error.BadRequestError('Error! You need to provide type.');
  }

  const response = await QuizTypesModel.findAll();
  if (!response.length)
    throw new error.BadRequestError('Error! Something went wrong.');
  response.forEach((e) => {
    if (
      e.type.replace(/\s+/g, '').toLowerCase() ===
      req.body.type.replace(/\s+/g, '').toLowerCase()
    )
      throw new error.BadRequestError('type actully exist');
  });

  const updated = await QuizTypesModel.update(
    { type: quizTypeBody.type.replace(/\s+/g, ' ') },
    { where: { id: { [Op.eq]: quizTypeId } } },
  );
  if (!updated[0]) throw new error.BadRequestError('type do not exists.');

  res.status(201).json({ message: `Quiz type has been updated` });
};

const deleteQuizTypeById = async (req, res) => {
  const quizTypeId = req.params.id;
  helpers.checkIfNumber(quizTypeId);

  const response = await QuizTypesModel.destroy({
    where: { id: { [Op.eq]: quizTypeId } },
  });
  if (!response) throw new error.BadRequestError('type do not exist');

  res
    .status(200)
    .json({ message: `Quiz type with id ${quizTypeId} has been deleted` });
};

module.exports = {
  getQuizTypes,
  getQuizTypeById,
  createQuizType,
  updateQuizType,
  deleteQuizTypeById,
};
