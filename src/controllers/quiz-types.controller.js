const QuizTypesModel = require('../models/quiz-types.model');

const getQuizTypes = async (req, res) => {
  const model = new QuizTypesModel();

  try {
    const quizTypes = await model.findAll();
    res.json({ quizTypes });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};

const getQuizTypeById = async (req, res) => {
  const model = new QuizTypesModel();
  const quizTypeId = req.params.id;

  try {
    const quizType = await model.findById(quizTypeId);
    res.json({ quizType });
  } catch (error) {
    if (error?.message) {
      res.status(404).json({ error: error.message });
    } else {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  }
};

const createQuizType = async (req, res) => {
  const model = new QuizTypesModel();

  try {
    await model.create(req.body);
    res.status(201).json({ message: `Quiz type has been created` });
  } catch (error) {
    if (error?.message) {
      res.status(404).json({ error: error.message });
    } else {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  }
};

const updateQuizType = async (req, res) => {
  const model = new QuizTypesModel();
  const quizTypeId = req.params.id;
  const quizTypeBody = req.body;

  try {
    const quizTyp = await model.findById(quizTypeId);

    await model.update(quizTypeId, { ...quizTyp[0], ...quizTypeBody });
    res.status(201).json({ message: `Quiz typw has been updated` });
  } catch (error) {
    if (error?.message) {
      res.status(404).json({ error: error.message });
    } else {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  }
};

const deleteQuizTypeById = async (req, res) => {
  const model = new QuizTypesModel();
  const quizTypeId = req.params.id;

  try {
    await model.findById(quizTypeId);
    await model.delete(quizTypeId);
    res
      .status(200)
      .json({ message: `Quiz type with ID ${quizTypeId} has been deleted` });
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
  getQuizTypes,
  getQuizTypeById,
  createQuizType,
  updateQuizType,
  deleteQuizTypeById,
};
