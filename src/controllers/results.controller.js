const { Op, Sequelize } = require('sequelize');
const db = require('../models');
const ResultsModel = db.results;
const Quizzes = db.quizzes;
const QuizTypes = db.quizTypes;

const AnswersModel = db.answers;
const QuestionsModel = db.questions;
const QuestionTypesModel = db.questionTypes;

const error = require('../errors');
const helpers = require('../utils/helpers');

const getResults = async (req, res) => {
  const ranking = await ResultsModel.findAll({
    attributes: [
      'quizId',
      [Sequelize.col('quiz.name'), 'name'],
      [Sequelize.col('quiz->quizType.type'), 'type'],
      'playerName',
      'score',
      'createdAt',
    ],
    include: [
      {
        model: Quizzes,
        attributes: [],
        include: {
          model: QuizTypes,
          attributes: [],
          as: 'quizType',
        },
      },
    ],
    where: {
      score: {
        [Op.not]: null,
      },
    },
  });

  res.json(ranking);
};

const createResult = async (req, res) => {
  const created = await ResultsModel.create({
    ...req.body,
    userId: req.user.id,
  });
  if (!created) throw new error.BadRequestError('Error! Something went wrong.');
  res.status(201).json({ message: `Result has been created` });
};

const getResultsMost = async (req, res) => {
  const numberToReturn = req.params.most;
  helpers.checkIfNumber(numberToReturn);

  const results = await ResultsModel.findAll({
    attributes: [
      'quizId',
      [Sequelize.fn('COUNT', Sequelize.col('score')), 'Count'],
      [Sequelize.col('quiz.name'), 'name'],
      [Sequelize.col('quiz.createdAt'), 'createdAt'],
      [Sequelize.col('quiz->quizType.type'), 'type'],
    ],
    where: {
      score: { [Op.ne]: null },
    },
    group: 'quizId',
    order: [[Sequelize.fn('COUNT', Sequelize.col('score')), 'DESC']],
    limit: +numberToReturn,
    include: [
      {
        model: Quizzes,
        attributes: [],
        include: {
          model: QuizTypes,
          attributes: [],
          as: 'quizType',
        },
      },
    ],
  });

  res.json(results);
};

const getResultsByUserId = async (req, res) => {
  const results = await ResultsModel.findAll({
    attributes: [
      'quizId',
      'playerName',
      'score',
      [Sequelize.col('quiz.name'), 'name'],
      [Sequelize.col('quiz->quizType.type'), 'type'],
      [Sequelize.col('quiz.createdAt'), 'createdAt'],
    ],
    where: {
      score: { [Op.ne]: null },
      UserId: { [Op.eq]: req.user.id },
    },
    group: 'quizId',
    include: [
      {
        model: Quizzes,
        attributes: [],
        include: {
          model: QuizTypes,
          attributes: [],
          as: 'quizType',
        },
      },
    ],
  });

  res.json(results);
};

const getQeustions = async (id, userId) => {
  const quizId = id;

  let quiz = await Quizzes.findOne({
    attributes: ['id', 'authorId'],
    where: { id: { [Op.eq]: quizId } },
  });
  if (!quiz) throw new error.BadRequestError('Quiz do not exist.');

  if (quiz.authorId === userId)
    throw new error.BadRequestError('nie możesz wypełnić tego quizu');

  const questionsByQuizId = await QuestionsModel.findAll({
    attributes: ['id', 'questionId'],
    include: [
      {
        model: QuestionTypesModel,
        attributes: ['type'],
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
  return questions;
};

const returnScore = async (req, res) => {
  const { quiz, questions, playerName } = req.body;
  const userId = req.user.id;

  const quizQuestions = await getQeustions(quiz.id, userId);
  const score = calculateScore(quizQuestions, questions);

  const created = await ResultsModel.create({
    quizId: quiz.id,
    playerName: playerName
      ? playerName
      : req.user.username
      ? req.user.username
      : 'No name',
    score: score ? score : 0,
    userId: userId ? userId : 1,
  });
  if (!created) throw new error.BadRequestError('Error! Something went wrong.');

  res.status(201).json({ message: `Result has been created`, score });
};

const calculateScore = (quizQuestions, userQuestions) => {
  let score = 0;

  for (const [index, question] of quizQuestions.entries()) {
    const questionId = question.question.id;
    const userQuestion = userQuestions[index];

    if (userQuestion.question.id !== questionId) return;

    for (const answer of question.answers) {
      const answerId = answer.answerId;

      if (typeof userQuestion.answers !== 'string') {
        if (
          answer.isCorrect &&
          userQuestion.answers.some((answer) => answer.answerId === answerId)
        ) {
          score++;
        } else if (
          !answer.isCorrect &&
          userQuestion.answers.some((answer) => answer.answerId === answerId)
        ) {
          score--;
        }
      } else {
        if (answer.answer === userQuestion.answers) score++;
      }
    }
  }

  return ((score / maxScore(quizQuestions)) * 100).toFixed(2);
};

const maxScore = (quizQuestions) => {
  let score = 0;

  for (const question of quizQuestions) {
    if (question.question.questionType.type === 'open') {
      score++;
    } else for (const answer of question.answers) if (answer.isCorrect) score++;
  }

  return score;
};

module.exports = {
  getResults,
  createResult,
  getResultsMost,
  getResultsByUserId,
  returnScore,
};
