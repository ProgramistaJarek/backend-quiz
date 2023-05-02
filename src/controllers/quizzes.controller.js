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
      'ID',
      'Name',
      'CreatedAt',
      [Sequelize.col('QuizType.Type'), 'Type'],
    ],
    include: [{ model: QuizTypesModel, attributes: [] }],
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
      'ID',
      'Name',
      'CreatedAt',
      [Sequelize.col('QuizType.Type'), 'Type'],
    ],
    include: [
      {
        model: QuizTypesModel,
        attributes: [],
      },
    ],
    order: [['CreatedAt', quizOrder]],
    limit: +quizNumber,
  });

  res.json(quizzes);
};

const getQuiz = async (req, res) => {
  const quizId = req.params.id;
  helpers.checkIfNumber(quizId);

  let quiz = await QuizzesModel.findOne({
    attributes: [
      'ID',
      'AuthorID',
      'Name',
      'CreatedAt',
      [Sequelize.col('QuizType.Type'), 'Type'],
    ],
    include: [{ model: QuizTypesModel, attributes: [] }],
    where: { ID: { [Op.eq]: quizId } },
  });
  if (!quiz) throw new error.BadRequestError('Quiz do not exist.');

  const questionsByQuizId = await QuestionsModel.findAll({
    attributes: [
      'ID',
      'Question',
      'Path',
      [Sequelize.col('QuestionType.Type'), 'Type'],
    ],
    include: [
      {
        model: QuestionTypesModel,
        attributes: [],
      },
    ],
    where: { QuizID: { [Op.eq]: quizId } },
  });

  const questions = [];
  for (const question of questionsByQuizId) {
    const questionId = question.ID;
    const answersForQuestion = await AnswersModel.findAll({
      attributes: ['ID', 'Answer', 'IsCorrect', 'Path'],
      where: { QuestionID: { [Op.eq]: questionId } },
    });
    questions.push({ question, answers: answersForQuestion });
  }

  quiz = {
    ...quiz.dataValues,
    isEditable: quiz.AuthorID === req.user.id,
  };
  res.json({ quiz, questions });
};

const createQuiz = async (req, res) => {
  const body = req.body;
  if (!helpers.checkIfBodyOfQuizIsCorrect(body))
    throw new error.BadRequestError('Invalid request body');

  helpers.checkQuestions(body.questions);

  const quiz = await QuizzesModel.create({
    ...body.quiz,
    AuthorID: req.user.id,
  });

  for (const data of body.questions) {
    const questionType = await QuestionTypesModel.findOne({
      attributes: ['ID'],
      where: { Type: { [Op.eq]: data.question.Type } },
    });
    if (!questionType)
      throw new error.BadRequestError('Error! Something went wrong.');

    const question = await QuestionsModel.create({
      ...data.question,
      QuizID: quiz.ID,
      TypeID: questionType.ID,
    });
    if (!question)
      throw new error.BadRequestError('Error! Something went wrong.');

    for (const answer of data.answers) {
      const created = await AnswersModel.create({
        ...answer,
        QuestionID: question.ID,
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

  if (!helpers.checkIfBodyOfQuizIsCorrect(body))
    throw new error.BadRequestError('Invalid request body');

  helpers.checkQuestions(body.questions);

  const quiz = await QuizzesModel.findOne({
    where: { ID: { [Op.eq]: quizId } },
  });
  if (!quiz) throw new error.BadRequestError('Quiz do not exists.');

  if (req.user.id !== quiz.AuthorID)
    throw new error.BadRequestError(
      'You are not authorized to update this quiz.',
    );

  await QuestionsModel.destroy({ where: { QuizID: { [Op.eq]: quizId } } });

  for (const data of body.questions) {
    const questionType = await QuestionTypesModel.findOne({
      attributes: ['ID'],
      where: { Type: { [Op.eq]: data.question.Type } },
    });
    if (!questionType)
      throw new error.BadRequestError('Error! Something went wrong.');

    const question = await QuestionsModel.create({
      ...data.question,
      QuizID: quiz.ID,
      TypeID: questionType.ID,
    });
    if (!question)
      throw new error.BadRequestError('Error! Something went wrong.');

    for (const answer of data.answers) {
      const created = await AnswersModel.create({
        ...answer,
        QuestionID: question.ID,
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
    where: { ID: { [Op.eq]: quizId } },
  });
  if (!quiz) throw new error.BadRequestError('Quiz do not exists.');

  if (quiz.AuthorID !== req.user.id)
    throw new error.BadRequestError('You cannot delete this quiz');

  await QuizzesModel.destroy({ where: { ID: { [Op.eq]: quizId } } });
  res.status(200).json({ message: `Quiz with ID ${quizId} has been deleted` });
};

module.exports = {
  getQuizzes,
  createQuiz,
  updateQuiz,
  deleteQuizById,
  getQuiz,
  getQuizByDate,
};
