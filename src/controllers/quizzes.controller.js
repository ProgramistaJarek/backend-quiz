const QuizzesModel = require('../models/quizzes.model');
const QuestionsModel = require('../models/questions.model');
const AnswersModel = require('../models/answers.model');

const BadRequestError = require('../errors/bad-request');

const getQuizzes = async (req, res) => {
  const model = new QuizzesModel();

  const quizzes = await model.findAll();
  res.json({ quizzes });
};

const getQuizById = async (req, res) => {
  const model = new QuizzesModel();
  const quizId = req.params.id;

  if (isNaN(quizId)) {
    throw new BadRequestError('Error! You need to provide valid id.');
  }

  const quizzes = await model.findById(quizId);
  res.json({ quizzes });
};

const createQuiz = async (req, res) => {
  const model = new QuizzesModel();
  const questionsModel = new QuestionsModel();
  const answersModel = new AnswersModel();

  let minNumberOfAnswers = 0;
  let countCorrectNumberOfAnswers = 0;

  req.body.questions.map((data) => {
    if (data.answers.length <= 1)
      throw new BadRequestError('Error! Something went wrong.');
    countCorrectNumberOfAnswers = 0;
    minNumberOfAnswers = data.question.Type === 'checkbox' ? 2 : 1;

    data.answers.map((answer) => {
      if (answer.IsCorrect >= 1) countCorrectNumberOfAnswers++;
    });

    if (!(countCorrectNumberOfAnswers >= minNumberOfAnswers))
      throw new BadRequestError('Error! Something went wrong.');
  });

  let quiz;
  quiz = await model.create({
    ...req.body.quiz,
    AuthorID: req.user.id,
  });

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
};

const updateQuiz = async (req, res) => {
  const model = new QuizzesModel();
  const quizId = req.params.id;
  const quizReq = req.body;

  if (isNaN(quizId)) {
    throw new BadRequestError('Error! You need to provide valid id.');
  }

  const quiz = await model.findById(quizId);

  await model.update(quizId, { ...quiz[0], ...quizReq });
  res.status(201).json({ message: `Quiz has been updated` });
};

const deleteQuizById = async (req, res) => {
  const model = new QuizzesModel();
  const quizId = req.params.id;

  if (isNaN(quizId)) {
    throw new BadRequestError('Error! You need to provide valid id.');
  }

  let quiz;
  quiz = await model.findById(quizId);

  if (quiz.AuthorID !== req.user.id)
    throw new Error('You cannot delete this quiz');

  await model.delete(quizId);
  res.status(200).json({ message: `Quiz with ID ${quizId} has been deleted` });
};

const getQuiz = async (req, res) => {
  const model = new QuizzesModel();
  const questionsModel = new QuestionsModel();
  const answersModel = new AnswersModel();
  const quizId = req.params.id;

  if (isNaN(quizId)) {
    throw new BadRequestError('Error! You need to provide valid id.');
  }

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
};

const getQuizByDate = async (req, res) => {
  const model = new QuizzesModel();
  const quizOrder = req.params.order;
  const quizNumber = req.params.many;

  if (quizOrder !== 'true' && quizOrder !== 'false') {
    throw new BadRequestError('Error! You need to provide true/false.');
  }

  if (isNaN(quizNumber)) {
    throw new BadRequestError('Error! You need to provide number.');
  }

  const quizzes = await model.getQuizzesByDate(
    quizOrder === 'true' ? 'DESC' : 'ASC',
    quizNumber,
  );
  res.json(quizzes);
};

module.exports = {
  getQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuizById,
  getQuiz,
  getQuizByDate,
};
