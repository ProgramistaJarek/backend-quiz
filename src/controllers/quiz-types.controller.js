const QuizTypesModel = require('../models/quiz-types.model');

const BadRequestError = require('../errors/bad-request');

const getQuizTypes = async (req, res, next) => {
  const model = new QuizTypesModel();

  try {
    const quizTypes = await model.findAll();
    res.json(quizTypes);
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

const getQuizTypeById = async (req, res, next) => {
  const model = new QuizTypesModel();
  const quizTypeId = req.params.id;

  if (isNaN(quizTypeId)) {
    const err = new BadRequestError('Error! You need to provide valid id.');
    return next(err);
  }

  try {
    const quizType = await model.findById(quizTypeId);
    res.json({ ...quizType });
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

const createQuizType = async (req, res, next) => {
  const model = new QuizTypesModel();

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
    res.status(201).json({ message: `Quiz type has been created` });
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

const updateQuizType = async (req, res, next) => {
  const model = new QuizTypesModel();
  const quizTypeId = req.params.id;
  const quizTypeBody = req.body;

  if (isNaN(quizTypeId)) {
    const err = new BadRequestError('Error! You need to provide valid id.');
    return next(err);
  }

  if (!quizTypeBody.Type || Object.keys(req.body).length !== 1) {
    const err = new BadRequestError('Error! You need to provide Type.');
    return next(err);
  }

  try {
    await model.findById(quizTypeId);
    const response = await model.findAll();
    response.forEach((e) => {
      if (
        e.Type.replace(/\s+/g, '').toLowerCase() ===
        req.body.Type.replace(/\s+/g, '').toLowerCase()
      )
        throw new Error('Type actully exist');
    });
    await model.update(quizTypeId, quizTypeBody);
    res.status(201).json({ message: `Quiz type has been updated` });
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

const deleteQuizTypeById = async (req, res, next) => {
  const model = new QuizTypesModel();
  const quizTypeId = req.params.id;

  if (isNaN(quizTypeId)) {
    const err = new BadRequestError('Error! You need to provide valid id.');
    return next(err);
  }

  try {
    await model.findById(quizTypeId);
    await model.delete(quizTypeId);
    res
      .status(200)
      .json({ message: `Quiz type with ID ${quizTypeId} has been deleted` });
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
  getQuizTypes,
  getQuizTypeById,
  createQuizType,
  updateQuizType,
  deleteQuizTypeById,
};
