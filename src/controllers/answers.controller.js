const AnswersModel = require('../models/answers.model');

const getAnswers = async (req, res) => {
  const model = new AnswersModel();

  try {
    const answers = await model.findAll();
    res.json({ answers });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};

const getAnswerById = async (req, res) => {
  const model = new AnswersModel();
  const answersId = req.params.id;

  try {
    const answer = await model.findById(answersId);
    res.json({ answer });
  } catch (error) {
    if (error?.message) {
      res.status(404).json({ error: error.message });
    } else {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  }
};

const createAnswer = async (req, res) => {
  const model = new AnswersModel();

  try {
    await model.create(req.body);
    res.status(201).json({ message: `Answer has been created` });
  } catch (error) {
    if (error?.message) {
      res.status(404).json({ error: error.message });
    } else {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  }
};

const updateAnswer = async (req, res) => {
  const model = new AnswersModel();
  const answersId = req.params.id;
  const answerBody = req.body;

  try {
    const answer = await model.findById(answersId);

    await model.update(answersId, { ...answer[0], ...answerBody });
    res.status(201).json({ message: `Answer has been updated` });
  } catch (error) {
    if (error?.message) {
      res.status(404).json({ error: error.message });
    } else {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  }
};

const deleteAnswerById = async (req, res) => {
  const model = new AnswersModel();
  const answersId = req.params.id;

  try {
    await model.findById(answersId);
    await model.delete(answersId);
    res
      .status(200)
      .json({ message: `Answer with ID ${answersId} has been deleted` });
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
  getAnswers,
  getAnswerById,
  createAnswer,
  updateAnswer,
  deleteAnswerById,
};
