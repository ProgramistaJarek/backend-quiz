const db = require('../configs/db');
const Model = require('./main.model');

class Quizzes extends Model {
  constructor() {
    super('Quizzes');
  }

  getQuizzesByDate(orderBy, number) {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT q.ID, q.AuthorID, q.Name, t.Type, q.CreatedAt FROM ?? q INNER JOIN QuizTypes t ON q.TypeID = t.ID ORDER BY q.CreatedAt ${orderBy} LIMIT ${number};`,
        [this.table],
        (error, result) => {
          if (error) reject(error);

          resolve(result);
        },
      );
    });
  }
}

module.exports = Quizzes;
