const { Op } = require('sequelize');
const db = require('../models');
const QuizTypesModel = db.quizTypes;

const error = require('../errors');
const helpers = require('../utils/helpers');

const getQuizTypes = async (req, res) => {
  const quizTypes = await QuizTypesModel.findAll({
    attributes: ['ID', 'Type'],
  });

  res.json(quizTypes);
};

const getQuizTypeById = async (req, res) => {
  const quizTypeId = req.params.id;
  helpers.checkIfNumber(quizTypeId);

  const quizType = await QuizTypesModel.findOne({
    attributes: ['ID', 'Type'],
    where: { ID: { [Op.eq]: quizTypeId } },
  });
  if (!quizType)
    throw new error.BadRequestError('Error! Something went wrong.');

  res.json(quizType);
};

const createQuizType = async (req, res) => {
  if (!req.body.Type || Object.keys(req.body).length !== 1) {
    throw new error.BadRequestError('Error! You need to provide Type.');
  }

  const response = await QuizTypesModel.findAll();
  response.forEach((e) => {
    if (
      e.Type.replace(/\s+/g, '').toLowerCase() ===
      req.body.Type.replace(/\s+/g, '').toLowerCase()
    )
      throw new error.BadRequestError('Type actully exist');
  });

  const created = await QuizTypesModel.create({
    Type: req.body.Type.replace(/\s+/g, ' '),
  });
  if (!created) throw new error.BadRequestError('Error! Something went wrong.');

  res.status(201).json({ message: `Quiz type has been created` });
};

const updateQuizType = async (req, res) => {
  const quizTypeId = req.params.id;
  const quizTypeBody = req.body;

  helpers.checkIfNumber(quizTypeId);

  if (!quizTypeBody.Type || Object.keys(req.body).length !== 1) {
    throw new error.BadRequestError('Error! You need to provide Type.');
  }

  const response = await QuizTypesModel.findAll();
  if (!response.length)
    throw new error.BadRequestError('Error! Something went wrong.');
  response.forEach((e) => {
    if (
      e.Type.replace(/\s+/g, '').toLowerCase() ===
      req.body.Type.replace(/\s+/g, '').toLowerCase()
    )
      throw new error.BadRequestError('Type actully exist');
  });

  const updated = await QuizTypesModel.update(
    { Type: quizTypeBody.Type.replace(/\s+/g, ' ') },
    { where: { ID: { [Op.eq]: quizTypeId } } },
  );
  if (!updated[0]) throw new error.BadRequestError('Type do not exists.');

  res.status(201).json({ message: `Quiz type has been updated` });
};

const deleteQuizTypeById = async (req, res) => {
  const quizTypeId = req.params.id;
  helpers.checkIfNumber(quizTypeId);

  const response = await QuizTypesModel.destroy({
    where: { ID: { [Op.eq]: quizTypeId } },
  });
  if (!response) throw new error.BadRequestError('Type do not exist');

  res
    .status(200)
    .json({ message: `Quiz type with ID ${quizTypeId} has been deleted` });
};

module.exports = {
  getQuizTypes,
  getQuizTypeById,
  createQuizType,
  updateQuizType,
  deleteQuizTypeById,
};
