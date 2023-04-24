const db = require('../configs/db');
const Model = require('./main.model');

class Questions extends Model {
  constructor() {
    super('Questions');
  }

  getQuestionsWithTypeByQuizId(id) {
    return new Promise((resolve, reject) => {
      db.query(
        'SELECT q.ID, q.QuizID, q.Question, q.Path, t.Type FROM ?? q INNER JOIN QuestionTypes t ON q.TypeID = t.ID WHERE q.QuizID = ?;',
        [this.table, id],
        (error, result) => {
          if (error) reject(error);

          resolve(result);
        },
      );
    });
  }
}

module.exports = Questions;
