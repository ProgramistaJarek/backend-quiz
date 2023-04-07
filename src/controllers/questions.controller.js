const QuestionsModel = require('../models/questions.model');

const getQuestions = async (req, res) => {
  const model = new QuestionsModel();

  try {
    const questions = await model.findAll();
    res.json({ questions });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};

const getQuestionById = async (req, res) => {
  const model = new QuestionsModel();
  const questionId = req.params.id;

  try {
    const question = await model.findById(questionId);
    res.json({ question });
  } catch (error) {
    if (error?.message) {
      res.status(404).json({ error: error.message });
    } else {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  }
};

const createQuestion = async (req, res) => {
  const model = new QuestionsModel();

  try {
    await model.create(req.body);
    res.status(201).json({ message: `Question has been created` });
  } catch (error) {
    if (error?.message) {
      res.status(404).json({ error: error.message });
    } else {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  }
};

const updateQuestion = async (req, res) => {
  const model = new QuestionsModel();
  const questionId = req.params.id;
  const questionReq = req.body;

  try {
    const question = await model.findById(questionId);

    await model.update(questionId, { ...question[0], ...questionReq });
    res.status(201).json({ message: `Question has been updated` });
  } catch (error) {
    if (error?.message) {
      res.status(404).json({ error: error.message });
    } else {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  }
};

const deleteQuestionById = async (req, res) => {
  const model = new QuestionsModel();
  const questionId = req.params.id;

  try {
    await model.findById(questionId);
    await model.delete(questionId);
    res
      .status(200)
      .json({ message: `Question with ID ${questionId} has been deleted` });
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
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestionById,
};
