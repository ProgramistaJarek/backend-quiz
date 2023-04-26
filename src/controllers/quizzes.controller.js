const QuizzesModel = require('../models/quizzes.model');
const QuestionsModel = require('../models/questions.model');
const AnswersModel = require('../models/answers.model');

const CustomAPIError = require('../errors/custom-api');
const BadRequestError = require('../errors/bad-request');

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

const createQuiz = async (req, res, next) => {
  const model = new QuizzesModel();
  const questionsModel = new QuestionsModel();
  const answersModel = new AnswersModel();

  try {
    let minNumberOfAnswers = 0;
    let countCorrectNumberOfAnswers = 0;

    req.body.questions.map((data) => {
      if (data.answers.length <= 1) throw new Error();
      countCorrectNumberOfAnswers = 0;
      minNumberOfAnswers = data.question.Type === 'checkbox' ? 2 : 1;

      data.answers.map((answer) => {
        if (answer.IsCorrect >= 1) countCorrectNumberOfAnswers++;
      });

      if (!(countCorrectNumberOfAnswers >= minNumberOfAnswers))
        throw new Error();
    });
  } catch (err) {
    const error = new BadRequestError('Error! Something went wrong.');
    return next(error);
  }

  let quiz;
  try {
    quiz = await model.create({
      ...req.body.quiz,
      AuthorID: req.user.id,
    });
    // res.status(201).json({ message: `Quiz has been created` });
  } catch (error) {
    if (error?.message) {
      const err = new BadRequestError(error.message);
      return next(err);
    } else {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  }

  try {
    let question;
    let questionType;
    req.body.questions.map(async (data) => {
      if (data.question.Type === 'checkbox') questionType = 1;
      else if (data.question.Type === 'radio') questionType = 2;
      else if (data.question.Type === 'boolean') questionType = 3;
      delete data.question['Type'];
      question = await questionsModel.create({
        ...data.question,
        QuizID: quiz.ID,
        TypeID: questionType,
      });

      data.answers.map(async (answer) => {
        answersModel.create({ ...answer, QuestionID: question.ID });
      });
    });
    res.status(201).json({ message: `Quiz has been created` });
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

const deleteQuizById = async (req, res, next) => {
  const model = new QuizzesModel();
  const quizId = req.params.id;

  let quiz;
  try {
    quiz = await model.findById(quizId);

    if (quiz.AuthorID !== req.user.id)
      throw new Error('You cannot delete this quiz');
  } catch (error) {
    if (error?.message) {
      const err = new BadRequestError(error.message);
      return next(err);
    } else {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  }

  try {
    await model.delete(quizId);
    res
      .status(200)
      .json({ message: `Quiz with ID ${quizId} has been deleted` });
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

const getQuiz = async (req, res) => {
  const model = new QuizzesModel();
  const questionsModel = new QuestionsModel();
  const answersModel = new AnswersModel();
  const quizId = req.params.id;

  try {
    let quiz = await model.findById(quizId);
    const questionsByQuizId = await questionsModel.getQuestionsWithTypeByQuizId(
      quizId,
    );
    const questions = [];
    for (const question of questionsByQuizId) {
      const questionId = question.ID;
      const answersForQuestion = await answersModel.getAnswersForQuestion(
        questionId,
      );
      questions.push({ question, answers: answersForQuestion });
    }

    quiz = {
      ...quiz,
      isEditable: quiz.AuthorID === req.user.id,
    };
    res.json({ quiz, questions });
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
  getQuiz,
};
