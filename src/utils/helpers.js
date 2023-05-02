const error = require('../errors/');

const validQuestionTypes = ['checkbox', 'radio', 'boolean', 'text', 'image'];
const numberOfAnswers = {
  checkbox: 2,
  radio: 1,
  boolean: 1,
  text: 1,
  image: 1,
};

const checkIfNumber = (number) => {
  if (isNaN(number)) {
    throw new error.BadRequestError('Error! You need to provide valid id.');
  }
};

const checkIfBodyOfQuizIsCorrect = (body) => {
  if (!body || typeof body !== 'object') {
    return false;
  }

  if (
    !body.quiz ||
    typeof body.quiz !== 'object' ||
    typeof body.quiz.TypeID !== 'number' ||
    typeof body.quiz.Name !== 'string' ||
    Object.keys(body.quiz).length !== 2
  ) {
    return false;
  }

  if (
    !body.questions ||
    !Array.isArray(body.questions) ||
    body.questions.length === 0
  ) {
    return false;
  }

  for (const question of body.questions) {
    if (
      !question ||
      typeof question !== 'object' ||
      !question.question ||
      typeof question.question !== 'object' ||
      typeof question.question.Question !== 'string' ||
      typeof question.question.Type !== 'string' ||
      !validQuestionTypes.includes(question.question.Type)
    ) {
      return false;
    }

    if (
      !question.answers ||
      !Array.isArray(question.answers) ||
      question.answers.length === 0
    ) {
      return false;
    }

    for (const answer of question.answers) {
      if (
        !answer ||
        typeof answer !== 'object' ||
        typeof answer.Answer !== 'string' ||
        typeof answer.IsCorrect !== 'number' ||
        (typeof answer.Path !== 'string' && answer.Path !== null)
      ) {
        return false;
      }
    }
  }

  return true;
};

const checkQuestions = (questions) => {
  for (const data of questions) {
    if (data.answers.length <= 1) {
      throw new error.BadRequestError('Error! Something went wrong.');
    }
    let countCorrectNumberOfAnswers = 0;
    const minNumberOfAnswers = data.question.Type === 'checkbox' ? 2 : 1;
    for (const answer of data.answers) {
      if (answer.IsCorrect === 1) {
        countCorrectNumberOfAnswers++;
      }
    }
    if (data.question.Type === 'checkbox') {
      if (
        countCorrectNumberOfAnswers < minNumberOfAnswers ||
        countCorrectNumberOfAnswers === 0
      ) {
        throw new error.BadRequestError(
          'Error! Amount of answers is not correct.',
        );
      }
    } else if (
      countCorrectNumberOfAnswers !== minNumberOfAnswers ||
      countCorrectNumberOfAnswers === 0
    ) {
      throw new error.BadRequestError(
        'Error! Amount of answers is not correct.',
      );
    }
  }
};

module.exports = { checkIfNumber, checkIfBodyOfQuizIsCorrect, checkQuestions };
