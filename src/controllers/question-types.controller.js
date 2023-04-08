const QuestionTypesModel = require('../models/question-types.model');

const getQuestionTypes = async (req, res) => {
  const model = new QuestionTypesModel();

  try {
    const questionTypes = await model.findAll();
    res.json({ questionTypes });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};

const getQuestionTypeById = async (req, res) => {
  const model = new QuestionTypesModel();
  const questionTypeId = req.params.id;

  try {
    const questionType = await model.findById(questionTypeId);
    res.json({ questionType });
  } catch (error) {
    if (error?.message) {
      res.status(404).json({ error: error.message });
    } else {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  }
};

const createQuestionType = async (req, res) => {
  const model = new QuestionTypesModel();

  try {
    await model.create(req.body);
    res.status(201).json({ message: `Question type has been created` });
  } catch (error) {
    if (error?.message) {
      res.status(404).json({ error: error.message });
    } else {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  }
};

const updateQuestionType = async (req, res) => {
  const model = new QuestionTypesModel();
  const questionTypeId = req.params.id;
  const questionTypeBody = req.body;

  try {
    const questionTyp = await model.findById(questionTypeId);

    await model.update(questionTypeId, {
      ...questionTyp[0],
      ...questionTypeBody,
    });
    res.status(201).json({ message: `Question typw has been updated` });
  } catch (error) {
    if (error?.message) {
      res.status(404).json({ error: error.message });
    } else {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  }
};

const deleteQuestionTypeById = async (req, res) => {
  const model = new QuestionTypesModel();
  const questionTypeId = req.params.id;

  try {
    await model.findById(questionTypeId);
    await model.delete(questionTypeId);
    res
      .status(200)
      .json({
        message: `Question type with ID ${questionTypeId} has been deleted`,
      });
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
  getQuestionTypes,
  getQuestionTypeById,
  createQuestionType,
  updateQuestionType,
  deleteQuestionTypeById,
};
