const { Op } = require('sequelize');
const db = require('../models');
const QuestionTypesModel = db.questionTypes;

const error = require('../errors');
const helpers = require('../utils/helpers');

const getQuestionTypes = async (req, res) => {
  const questionTypes = await QuestionTypesModel.findAll({
    attributes: ['ID', 'Type'],
  });
  if (!questionTypes.length)
    throw new error.BadRequestError('Error! Something went wrong.');

  res.json(questionTypes);
};

const createQuestionType = async (req, res) => {
  if (!req.body.Type || Object.keys(req.body).length !== 1) {
    throw new error.BadRequestError('Error! You need to provide Type.');
  }

  const response = await QuestionTypesModel.findAll();
  response.forEach((e) => {
    if (
      e.Type.replace(/\s+/g, '').toLowerCase() ===
      req.body.Type.replace(/\s+/g, '').toLowerCase()
    )
      throw new error.BadRequestError('Type actully exist.');
  });

  const created = await QuestionTypesModel.create({
    Type: req.body.Type.replace(/\s+/g, ' '),
  });
  if (!created) throw new error.BadRequestError('Error! Something went wrong.');

  res.status(201).json({ message: `Question type has been created.` });
};

const deleteQuestionTypeById = async (req, res) => {
  const questionTypeId = req.params.id;
  helpers.checkIfNumber(questionTypeId);

  const response = await QuestionTypesModel.destroy({
    where: {
      ID: { [Op.eq]: questionTypeId },
    },
  });
  if (!response) throw new error.BadRequestError('Type do not exist.');

  res.status(200).json({
    message: `Question type with ID ${questionTypeId} has been deleted.`,
  });
};

module.exports = {
  getQuestionTypes,
  createQuestionType,
  deleteQuestionTypeById,
};
