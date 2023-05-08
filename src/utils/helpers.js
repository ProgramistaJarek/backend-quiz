const error = require('../errors/');

const validQuestionTypes = ['checkbox', 'radio', 'open'];

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
    typeof body.quiz.type !== 'number' ||
    typeof body.quiz.name !== 'string'
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
      typeof question.question.question !== 'string' ||
      typeof question.question.type !== 'string' ||
      !validQuestionTypes.includes(question.question.type)
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
        typeof answer.answer !== 'string' ||
        (typeof answer.isCorrect !== 'number' &&
          typeof answer.isCorrect !== 'boolean')
      ) {
        return false;
      }
    }
  }

  return true;
};

const checkQuestions = (questions) => {
  for (const data of questions) {
    if (data.answers.length < 1) {
      throw new error.BadRequestError('Error! Something went wrong.');
    }
    let countCorrectNumberOfAnswers = 0;
    let minNumberOfAnswers = 0;
    if (data.question.type === 'checkbox') minNumberOfAnswers = 2;
    else if (data.question.type === 'open') minNumberOfAnswers = 1;
    else minNumberOfAnswers = 1;

    for (const answer of data.answers) {
      if (answer.isCorrect === 1 || answer.isCorrect === true) {
        countCorrectNumberOfAnswers++;
      }
    }

    if (countCorrectNumberOfAnswers < 1) {
      console.log(countCorrectNumberOfAnswers);
      throw new error.BadRequestError(
        'Error! Amount of answers is not correct.',
      );
    }

    /* if (data.question.type === 'checkbox' || data.question.type === 'open') {
      if (
        countCorrectNumberOfAnswers < minNumberOfAnswers ||
        countCorrectNumberOfAnswers === 0
      ) {
        console.log(countCorrectNumberOfAnswers);
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
    } */
  }
};

module.exports = { checkIfNumber, checkIfBodyOfQuizIsCorrect, checkQuestions };
