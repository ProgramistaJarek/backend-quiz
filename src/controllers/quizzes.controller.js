const QuizzesModel = require('../models/quizzes.model');

const getQuizzes = async (req, res) => {
  const model = new QuizzesModel();

  try {
    const quizzes = await model.findAll();
    res.json({ quizzes });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};

const getQuizById = async (req, res) => {
  const model = new QuizzesModel();
  const quizId = req.params.id;

  try {
    const quizzes = await model.findById(quizId);
    res.json({ quizzes });
  } catch (error) {
    if (error?.message) {
      res.status(404).json({ error: error.message });
    } else {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  }
};

const createQuiz = async (req, res) => {
  const model = new QuizzesModel();

  try {
    await model.create(req.body);
    res.status(201).json({ message: `Quiz has been created` });
  } catch (error) {
    if (error?.message) {
      res.status(404).json({ error: error.message });
    } else {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  }
};

const updateQuiz = async (req, res) => {
  const model = new QuizzesModel();
  const quizId = req.params.id;
  const quizReq = req.body;

  try {
    const quiz = await model.findById(quizId);

    await model.update(quizId, { ...quiz[0], ...quizReq });
    res.status(201).json({ message: `Quiz has been updated` });
  } catch (error) {
    if (error?.message) {
      res.status(404).json({ error: error.message });
    } else {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  }
};

const deleteQuizById = async (req, res) => {
  const model = new QuizzesModel();
  const quizId = req.params.id;

  try {
    await model.findById(quizId);
    await model.delete(quizId);
    res
      .status(200)
      .json({ message: `Quiz with ID ${quizId} has been deleted` });
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
  getQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuizById,
};
