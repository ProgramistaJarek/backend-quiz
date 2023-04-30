const db = require('../configs/db');
const Model = require('./main.model');

class Results extends Model {
  constructor() {
    super('Results');
  }

  getSolvedQuizzess(number) {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT q.ID, q.AuthorID, q.Name, t.Type, q.CreatedAt, COUNT(r.Score) as Count
        FROM ?? r 
        INNER JOIN Quizzes q
        ON r.QuizID = q.ID
        INNER JOIN QuizTypes t
        ON q.TypeID = t.ID
        WHERE r.Score IS NOT NULL
        GROUP BY QuizID
        ORDER BY Count DESC
        LIMIT ${number};`,
        [this.table],
        (error, result) => {
          if (error) reject(error);

          resolve(result);
        },
      );
    });
  }

  getRanking() {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT r.QuizID, q.Name, r.PlayerName, r.Score, r.CreatedAt
        FROM ?? r
        INNER JOIN Quizzes q
        ON r.QuizID = q.ID
        WHERE r.Score IS NOT NULL;`,
        [this.table],
        (error, result) => {
          if (error) reject(error);

          resolve(result);
        },
      );
    });
  }
}

module.exports = Results;
