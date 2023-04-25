const db = require('../configs/db');
const Model = require('./main.model');

class Answers extends Model {
  constructor() {
    super('Answers');
  }

  getAnswersForQuestion(id) {
    return new Promise((resolve, reject) => {
      db.query(
        'SELECT ID, Answer, IsCorrect, Path FROM ?? WHERE QuestionID = ?;',
        [this.table, id],
        (error, result) => {
          if (error) reject(error);

          resolve(result);
        },
      );
    });
  }
}

module.exports = Answers;
