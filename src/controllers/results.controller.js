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
      'QuizID',
      [Sequelize.col('Quiz.Name'), 'Name'],
      [Sequelize.col('Quiz->QuizType.Type'), 'Type'],
      'PlayerName',
      'Score',
      'CreatedAt',
    ],
    include: [
      {
        model: Quizzes,
        attributes: [],
        include: {
          model: QuizTypes,
          attributes: [],
          as: 'QuizType',
        },
      },
    ],
    where: {
      Score: {
        [Op.not]: null,
      },
    },
  });

  res.json(ranking);
};

const createResult = async (req, res) => {
  console.log({
    ...req.body,
    UserID: req.user.id,
  });
  const created = await ResultsModel.create({
    ...req.body,
    UserID: req.user.id,
  });
  if (!created) throw new error.BadRequestError('Error! Something went wrong.');
  res.status(201).json({ message: `Result has been created` });
};

const getResultsMost = async (req, res) => {
  const numberToReturn = req.params.most;
  helpers.checkIfNumber(numberToReturn);

  const results = await ResultsModel.findAll({
    attributes: [
      'QuizID',
      [Sequelize.fn('COUNT', Sequelize.col('Score')), 'Count'],
      [Sequelize.col('Quiz.Name'), 'Name'],
      [Sequelize.col('Quiz.CreatedAt'), 'CreatedAt'],
      [Sequelize.col('Quiz->QuizType.Type'), 'Type'],
    ],
    where: {
      Score: { [Op.ne]: null },
    },
    group: 'QuizID',
    order: [[Sequelize.fn('COUNT', Sequelize.col('Score')), 'DESC']],
    limit: +numberToReturn,
    include: [
      {
        model: Quizzes,
        attributes: [],
        include: {
          model: QuizTypes,
          attributes: [],
          as: 'QuizType',
        },
      },
    ],
  });

  res.json(results);
};

const getResultsByUserId = async (req, res) => {
  const results = await ResultsModel.findAll({
    attributes: [
      'QuizID',
      'PlayerName',
      'Score',
      [Sequelize.col('Quiz.Name'), 'Name'],
      [Sequelize.col('Quiz->QuizType.Type'), 'Type'],
      [Sequelize.col('Quiz.CreatedAt'), 'CreatedAt'],
    ],
    where: {
      Score: { [Op.ne]: null },
      UserId: { [Op.eq]: req.user.id },
    },
    group: 'QuizID',
    include: [
      {
        model: Quizzes,
        attributes: [],
        include: {
          model: QuizTypes,
          attributes: [],
          as: 'QuizType',
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
