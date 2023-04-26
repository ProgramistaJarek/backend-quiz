const QuestionTypesModel = require('../models/question-types.model');

const BadRequestError = require('../errors/bad-request');

const getQuestionTypes = async (req, res, next) => {
  const model = new QuestionTypesModel();

  try {
    const questionTypes = await model.findAll();
    res.json(questionTypes);
  } catch (error) {
    if (error?.message) {
      const err = new BadRequestError(error.message);
      return next(err);
    } else {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  }
};

const getQuestionTypeById = async (req, res, next) => {
  const model = new QuestionTypesModel();
  const questionTypeId = req.params.id;

  if (isNaN(questionTypeId)) {
    const err = new BadRequestError('Error! You need to provide valid id.');
    return next(err);
  }

  try {
    const questionType = await model.findById(questionTypeId);
    res.json({ ...questionType });
  } catch (error) {
    if (error?.message) {
      const err = new BadRequestError(error.message);
      return next(err);
    } else {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  }
};

const createQuestionType = async (req, res, next) => {
  const model = new QuestionTypesModel();

  if (!req.body.Type || Object.keys(req.body).length !== 1) {
    const err = new BadRequestError('Error! You need to provide Type.');
    return next(err);
  }

  try {
    const response = await model.findAll();
    response.forEach((e) => {
      if (
        e.Type.replace(/\s+/g, '').toLowerCase() ===
        req.body.Type.replace(/\s+/g, '').toLowerCase()
      )
        throw new Error('Type actully exist');
    });
    await model.create({ Type: req.body.Type.replace(/\s+/g, ' ') });
    res.status(201).json({ message: `Question type has been created` });
  } catch (error) {
    if (error?.message) {
      const err = new BadRequestError(error.message);
      return next(err);
    } else {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  }
};

const updateQuestionType = async (req, res, next) => {
  const model = new QuestionTypesModel();
  const questionTypeId = req.params.id;
  const questionTypeBody = req.body;

  if (isNaN(questionTypeId)) {
    const err = new BadRequestError('Error! You need to provide valid id.');
    return next(err);
  }

  if (!questionTypeBody.Type) {
    const err = new BadRequestError('Error! You need to provide Type.');
    return next(err);
  }

  try {
    await model.findById(questionTypeId);
    await model.update(questionTypeId, questionTypeBody);
    res.status(201).json({ message: `Question typw has been updated` });
  } catch (error) {
    if (error?.message) {
      const err = new BadRequestError(error.message);
      return next(err);
    } else {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  }
};

const deleteQuestionTypeById = async (req, res, next) => {
  const model = new QuestionTypesModel();
  const questionTypeId = req.params.id;

  if (isNaN(questionTypeId)) {
    const err = new BadRequestError('Error! You need to provide valid id.');
    return next(err);
  }

  try {
    await model.findById(questionTypeId);
    await model.delete(questionTypeId);
    res.status(200).json({
      message: `Question type with ID ${questionTypeId} has been deleted`,
    });
  } catch (error) {
    if (error?.message) {
      const err = new BadRequestError(error.message);
      return next(err);
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
