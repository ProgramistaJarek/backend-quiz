const { Op, Sequelize } = require('sequelize');
const db = require('../models');
const ResultsModel = db.results;
const Quizzes = db.quizzes;
const QuizTypes = db.quizTypes;

const error = require('../errors');
const helpers = require('../utils/helpers');

const getResults = async (req, res) => {
  const ranking = await ResultsModel.findAll({
    attributes: [
      'quizId',
      [Sequelize.col('Quiz.name'), 'name'],
      [Sequelize.col('Quiz->quizType.type'), 'type'],
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
      [Sequelize.col('Quiz.name'), 'name'],
      [Sequelize.col('Quiz.createdAt'), 'createdAt'],
      [Sequelize.col('Quiz->quizType.type'), 'type'],
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
      [Sequelize.col('Quiz.name'), 'name'],
      [Sequelize.col('Quiz->quizType.type'), 'type'],
      [Sequelize.col('Quiz.createdAt'), 'createdAt'],
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

module.exports = {
  getResults,
  createResult,
  getResultsMost,
  getResultsByUserId,
};
