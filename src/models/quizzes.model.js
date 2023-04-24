const db = require('../configs/db');
const Model = require('./main.model');

class Quizzes extends Model {
  constructor() {
    super('Quizzes');
  }
}

module.exports = Quizzes;
