const QuestionTypesModel = require('../models/question-types.model');

const BadRequestError = require('../errors/bad-request');

const getQuestionTypes = async (req, res) => {
  const model = new QuestionTypesModel();

  const questionTypes = await model.findAll();
  if (!questionTypes) throw new BadRequestError('Error! Something went wrong.');
  res.json(questionTypes);
};

const getQuestionTypeById = async (req, res) => {
  const model = new QuestionTypesModel();
  const questionTypeId = req.params.id;

  if (isNaN(questionTypeId)) {
    throw new BadRequestError('Error! You need to provide valid id.');
  }

  const questionType = await model.findById(questionTypeId);
  if (!questionType) throw new BadRequestError('Error! Something went wrong.');
  res.json({ ...questionType });
};

const createQuestionType = async (req, res) => {
  const model = new QuestionTypesModel();

  if (!req.body.Type || Object.keys(req.body).length !== 1) {
    throw new BadRequestError('Error! You need to provide Type.');
  }

  const response = await model.findAll();
  if (!response) throw new BadRequestError('Error! Something went wrong.');

  response.forEach((e) => {
    if (
      e.Type.replace(/\s+/g, '').toLowerCase() ===
      req.body.Type.replace(/\s+/g, '').toLowerCase()
    )
      throw new BadRequestError('Type actully exist');
  });

  await model.create({ Type: req.body.Type.replace(/\s+/g, ' ') });
  res.status(201).json({ message: `Question type has been created` });
};

const updateQuestionType = async (req, res) => {
  const model = new QuestionTypesModel();
  const questionTypeId = req.params.id;
  const questionTypeBody = req.body;

  if (isNaN(questionTypeId)) {
    throw new BadRequestError('Error! You need to provide valid id.');
  }

  if (!questionTypeBody.Type) {
    throw new BadRequestError('Error! You need to provide Type.');
  }

  await model.findById(questionTypeId);
  const response = await model.findAll();
  if (!response) throw new BadRequestError('Error! Something went wrong.');

  response.forEach((e) => {
    if (
      e.Type.replace(/\s+/g, '').toLowerCase() ===
      req.body.Type.replace(/\s+/g, '').toLowerCase()
    )
      throw new BadRequestError('Type actully exist');
  });

  await model.update(questionTypeId, questionTypeBody);
  res.status(201).json({ message: `Question type has been updated` });
};

const deleteQuestionTypeById = async (req, res) => {
  const model = new QuestionTypesModel();
  const questionTypeId = req.params.id;

  if (isNaN(questionTypeId)) {
    throw new BadRequestError('Error! You need to provide valid id.');
  }

  await model.findById(questionTypeId);
  await model.delete(questionTypeId);
  res.status(200).json({
    message: `Question type with ID ${questionTypeId} has been deleted`,
  });
};

module.exports = {
  getQuestionTypes,
  getQuestionTypeById,
  createQuestionType,
  updateQuestionType,
  deleteQuestionTypeById,
};
