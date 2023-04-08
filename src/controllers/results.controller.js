const ResultsModel = require('../models/results.model');

const getResults = async (req, res) => {
  const model = new ResultsModel();

  try {
    const results = await model.findAll();
    res.json({ results });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};

const getResultById = async (req, res) => {
  const model = new ResultsModel();
  const resultId = req.params.id;

  try {
    const result = await model.findById(resultId);
    res.json({ result });
  } catch (error) {
    if (error?.message) {
      res.status(404).json({ error: error.message });
    } else {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  }
};

const createResult = async (req, res) => {
  const model = new ResultsModel();

  try {
    await model.create(req.body);
    res.status(201).json({ message: `Result has been created` });
  } catch (error) {
    if (error?.message) {
      res.status(404).json({ error: error.message });
    } else {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  }
};

const updateResult = async (req, res) => {
  const model = new ResultsModel();
  const resultId = req.params.id;
  const resultBody = req.body;

  try {
    const result = await model.findById(resultId);

    await model.update(resultId, { ...result[0], ...resultBody });
    res.status(201).json({ message: `Result has been updated` });
  } catch (error) {
    if (error?.message) {
      res.status(404).json({ error: error.message });
    } else {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  }
};

const deleteResultById = async (req, res) => {
  const model = new ResultsModel();
  const resultId = req.params.id;

  try {
    await model.findById(resultId);
    await model.delete(resultId);
    res
      .status(200)
      .json({ message: `Result with ID ${resultId} has been deleted` });
  } catch (error) {
    if (error?.message) {
      res.status(404).json({ error: error.message });
    } else {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  }
};

module.exports = {
  getResults,
  getResultById,
  createResult,
  updateResult,
  deleteResultById,
};
