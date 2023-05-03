const { Op, Sequelize } = require('sequelize');
const db = require('../models');
const QuizzesModel = db.quizzes;
const QuizTypesModel = db.quizTypes;
const AnswersModel = db.answers;
const QuestionsModel = db.questions;
const QuestionTypesModel = db.questionTypes;

const error = require('../errors');
const helpers = require('../utils/helpers');

const getQuizzes = async (req, res) => {
  const quizzes = await QuizzesModel.findAll({
    attributes: [
      'id',
      'name',
      'createdAt',
      [Sequelize.col('quizType.type'), 'type'],
    ],
    include: [{ model: QuizTypesModel, attributes: [] }],
  });
  res.json(quizzes);
};

const getQuizByType = async (req, res) => {
  const typeId = req.params.typeId;
  helpers.checkIfNumber(typeId);

  const quizzes = await QuizzesModel.findAll({
    attributes: [
      'id',
      'name',
      'createdAt',
      [Sequelize.col('quizType.type'), 'type'],
    ],
    include: [{ model: QuizTypesModel, attributes: [] }],
    where: { typeId: { [Op.eq]: typeId } },
  });
  res.json(quizzes);
};

const getQuizByDate = async (req, res) => {
  const quizOrder = req.params.order;
  const quizNumber = req.params.many;

  if (quizOrder !== 'asc' && quizOrder !== 'desc') {
    throw new error.BadRequestError('Error! You need to provide asc/desc.');
  }

  helpers.checkIfNumber(quizNumber);

  const quizzes = await QuizzesModel.findAll({
    attributes: [
      ['id', 'quizId'],
      'name',
      'createdAt',
      [Sequelize.col('quizType.type'), 'type'],
    ],
    include: [
      {
        model: QuizTypesModel,
        attributes: [],
      },
    ],
    order: [['createdAt', quizOrder]],
    limit: +quizNumber,
  });

  res.json(quizzes);
};

const getQuiz = async (req, res) => {
  const quizId = req.params.id;
  helpers.checkIfNumber(quizId);

  let quiz = await QuizzesModel.findOne({
    attributes: [
      'id',
      'authorId',
      'name',
      'createdAt',
      [Sequelize.col('quizType.type'), 'type'],
    ],
    include: [{ model: QuizTypesModel, attributes: [] }],
    where: { id: { [Op.eq]: quizId } },
  });
  if (!quiz) throw new error.BadRequestError('Quiz do not exist.');

  const questionsByQuizId = await QuestionsModel.findAll({
    attributes: [
      'id',
      'questionId',
      'question',
      'path',
      [Sequelize.col('QuestionType.type'), 'type'],
    ],
    include: [
      {
        model: QuestionTypesModel,
        attributes: [],
      },
    ],
    where: { quizId: { [Op.eq]: quizId } },
  });

  const questions = [];
  for (const question of questionsByQuizId) {
    const questionId = question.id;
    const answersForQuestion = await AnswersModel.findAll({
      attributes: ['answerId', 'answer', 'isCorrect', 'path'],
      where: {
        questionId: { [Op.eq]: questionId },
        quizId: { [Op.eq]: quizId },
      },
    });
    questions.push({ question, answers: answersForQuestion });
  }

  quiz = {
    ...quiz.dataValues,
    isEditable: quiz.authorId === req.user.id,
  };
  res.json({ quiz, questions });
};

const createQuiz = async (req, res) => {
  const body = req.body;
  /* if (!helpers.checkIfBodyOfQuizIsCorrect(body))
    throw new error.BadRequestError('Invalid request body'); */

  // helpers.checkQuestions(body.questions);

  const quiz = await QuizzesModel.create({
    ...body.quiz,
    authorId: req.user.id,
  });

  for (const [index, data] of body.questions.entries()) {
    const questionType = await QuestionTypesModel.findOne({
      attributes: ['id'],
      where: { type: { [Op.eq]: data.question.type } },
    });
    if (!questionType)
      throw new error.BadRequestError('Error! Something went wrong.');

    const question = await QuestionsModel.create({
      ...data.question,
      questionId: index + 1,
      quizId: quiz.id,
      typeId: questionType.id,
    });
    if (!question)
      throw new error.BadRequestError('Error! Something went wrong.');

    for (const [index, answer] of data.answers.entries()) {
      const created = await AnswersModel.create({
        ...answer,
        answerId: index + 1,
        questionId: question.id,
        quizId: quiz.id,
      });
      if (!created)
        throw new error.BadRequestError('Error! Something went wrong.');
    }
  }

  res.status(201).json({ message: `Quiz has been created` });
};

const updateQuiz = async (req, res) => {
  const quizId = req.params.id;
  const body = req.body;

  helpers.checkIfNumber(quizId);

  /* if (!helpers.checkIfBodyOfQuizIsCorrect(body))
    throw new error.BadRequestError('Invalid request body');

  helpers.checkQuestions(body.questions); */

  const quiz = await QuizzesModel.findOne({
    where: { id: { [Op.eq]: quizId } },
  });
  if (!quiz) throw new error.BadRequestError('Quiz do not exists.');

  if (req.user.id !== quiz.authorId)
    throw new error.BadRequestError(
      'You are not authorized to update this quiz.',
    );

  await QuestionsModel.destroy({ where: { quizId: { [Op.eq]: quizId } } });

  for (const [index, data] of body.questions.entries()) {
    const questionType = await QuestionTypesModel.findOne({
      attributes: ['id'],
      where: { type: { [Op.eq]: data.question.type } },
    });
    if (!questionType)
      throw new error.BadRequestError('Error! Something went wrong.');

    const question = await QuestionsModel.create({
      ...data.question,
      questionId: index + 1,
      quizId: quiz.id,
      typeId: questionType.id,
    });
    if (!question)
      throw new error.BadRequestError('Error! Something went wrong.');

    for (const [index, answer] of data.answers.entries()) {
      const created = await AnswersModel.create({
        ...answer,
        answerId: index + 1,
        questionId: question.id,
        quizId: quiz.id,
      });
      if (!created)
        throw new error.BadRequestError('Error! Something went wrong.');
    }
  }

  await quiz.update({ ...body.quiz });

  res.status(201).json({ message: `Quiz has been updated` });
};

const deleteQuizById = async (req, res) => {
  const quizId = req.params.id;
  helpers.checkIfNumber(quizId);

  const quiz = await QuizzesModel.findOne({
    where: { id: { [Op.eq]: quizId } },
  });
  if (!quiz) throw new error.BadRequestError('Quiz do not exists.');

  if (quiz.authorId !== req.user.id)
    throw new error.BadRequestError('You cannot delete this quiz');

  await QuizzesModel.destroy({ where: { id: { [Op.eq]: quizId } } });
  res.status(200).json({ message: `Quiz with id ${quizId} has been deleted` });
};

module.exports = {
  getQuizzes,
  createQuiz,
  updateQuiz,
  deleteQuizById,
  getQuiz,
  getQuizByDate,
  getQuizByType,
};
