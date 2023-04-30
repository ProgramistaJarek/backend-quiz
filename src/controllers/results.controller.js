const ResultsModel = require('../models/results.model');

const BadRequestError = require('../errors/bad-request');

const getResults = async (req, res) => {
  const model = new ResultsModel();

  const ranking = await model.getRanking();
  res.json(ranking);
};

const createResult = async (req, res) => {
  const model = new ResultsModel();

  await model.create(req.body);
  res.status(201).json({ message: `Result has been created` });
};

const deleteResultById = async (req, res) => {
  const model = new ResultsModel();
  const resultId = req.params.id;

  if (isNaN(resultId)) {
    throw new BadRequestError('Error! You need to provide valid id.');
  }

  await model.findById(resultId);
  await model.delete(resultId);
  res
    .status(200)
    .json({ message: `Result with ID ${resultId} has been deleted` });
};

const getResultsMost = async (req, res) => {
  const model = new ResultsModel();
  const numberToReturn = req.params.most;

  if (isNaN(numberToReturn)) {
    throw new BadRequestError('Error! You need to provide valid id.');
  }

  const results = await model.getSolvedQuizzess(numberToReturn);
  res.json(results);
};

module.exports = {
  getResults,
  createResult,
  deleteResultById,
  getResultsMost,
};
