const db = require('../configs/db');

class Quizzes {
  constructor(ID, AuthorID, TypeID, Name) {
    this.ID = ID;
    this.AuthorID = AuthorID;
    this.TypeID = TypeID;
    this.Name = Name;
  }

  static async findAll() {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM Quizzes', (error, results) => {
        if (error) {
          reject(error);
        }

        if (results) {
          const quizzes = results.map(
            (result) =>
              new Quizzes(
                result.ID,
                result.AuthorID,
                result.email,
                reject.Name,
              ),
          );
          resolve(quizzes);
        }
      });
    });
  }

  static async findById(id) {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM Quizzes WHERE ID = ?', [id], (error, results) => {
        if (error) {
          reject(error);
        }

        if (results.length === 0) {
          reject(new Error(`Quiz with ID ${id} not found`));
        }

        if (results) {
          const quizzes = results.map(
            (result) =>
              new Quizzes(
                result.ID,
                result.AuthorID,
                result.email,
                reject.Name,
              ),
          );
          resolve(quizzes);
        }
      });
    });
  }

  static async create({ authorID, typeID, name }) {
    return new Promise((resolve, reject) => {
      db.query(
        'INSERT INTO Quizzes (AuthorID, TypeID, Name) VALUES (?, ?, ?)',
        [authorID, typeID, name],
        (error, results) => {
          if (error) {
            reject(error);
          }

          if (!results?.affectedRows) {
            reject(new Error(`Quiz cannot be created`));
          }

          resolve();
        },
      );
    });
  }

  static async update(id, { authorID, typeID, name }) {
    return new Promise((resolve, reject) => {
      db.query(
        'UPDATE Quizzes SET AuthorID = ?, TypeID = ?, Name = ? WHERE ID = ?',
        [authorID, typeID, name, id],
        (error, results) => {
          if (error) {
            reject(error);
          }

          if (results.affectedRows === 0) {
            reject(new Error(`Quiz with ID ${id} not found`));
          } else {
            resolve(results);
          }
        },
      );
    });
  }
}

module.exports = Quizzes;
