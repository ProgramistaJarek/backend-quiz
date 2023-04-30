const QuizTypesModel = require('../models/quiz-types.model');

const BadRequestError = require('../errors/bad-request');

const getQuizTypes = async (req, res) => {
  const model = new QuizTypesModel();

  const quizTypes = await model.findAll();
  if (!quizTypes) throw new BadRequestError('Error! Something went wrong.');
  res.json(quizTypes);
};

const getQuizTypeById = async (req, res) => {
  const model = new QuizTypesModel();
  const quizTypeId = req.params.id;

  if (isNaN(quizTypeId)) {
    throw new BadRequestError('Error! You need to provide valid id.');
  }

  const quizType = await model.findById(quizTypeId);
  if (!quizType) throw new BadRequestError('Error! Something went wrong.');
  res.json({ ...quizType });
};

const createQuizType = async (req, res) => {
  const model = new QuizTypesModel();

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
  res.status(201).json({ message: `Quiz type has been created` });
};

const updateQuizType = async (req, res) => {
  const model = new QuizTypesModel();
  const quizTypeId = req.params.id;
  const quizTypeBody = req.body;

  if (isNaN(quizTypeId)) {
    throw new BadRequestError('Error! You need to provide valid id.');
  }

  if (!quizTypeBody.Type || Object.keys(req.body).length !== 1) {
    throw new BadRequestError('Error! You need to provide Type.');
  }

  await model.findById(quizTypeId);
  const response = await model.findAll();
  if (!response) throw new BadRequestError('Error! Something went wrong.');
  response.forEach((e) => {
    if (
      e.Type.replace(/\s+/g, '').toLowerCase() ===
      req.body.Type.replace(/\s+/g, '').toLowerCase()
    )
      throw new BadRequestError('Type actully exist');
  });
  await model.update(quizTypeId, quizTypeBody);
  res.status(201).json({ message: `Quiz type has been updated` });
};

const deleteQuizTypeById = async (req, res) => {
  const model = new QuizTypesModel();
  const quizTypeId = req.params.id;

  if (isNaN(quizTypeId)) {
    throw new BadRequestError('Error! You need to provide valid id.');
  }

  await model.findById(quizTypeId);
  await model.delete(quizTypeId);
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
