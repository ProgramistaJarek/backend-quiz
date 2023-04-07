const db = require('../configs/db');
const Model = require('./main.model');

class User extends Model {
  constructor() {
    super('Users');
  }

  /* static async findAll() {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM Users', (error, results) => {
        if (error) {
          reject(error);
        }

        if (results) {
          const user = results.map(
            (result) => new User(result.ID, result.Nickname, result.Password),
          );
          resolve(user);
        }
      });
    });
  }

  static async findById(id) {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM Users WHERE ID = ?', [id], (error, results) => {
        if (error) {
          reject(error);
        }

        if (results.length === 0) {
          reject(new Error(`User with ID ${id} not found`));
        }

        if (results.length >= 1) {
          const user = results.map(
            (result) => new User(result.ID, result.Nickname, result.Password),
          );
          resolve(user);
        }
      });
    });
  } */

  /* static async createUser({ nickname, password }) {
    return new Promise((resolve, reject) => {
      db.query(
        'INSERT INTO Users (Nickname, Password) VALUES (?, ?)',
        [nickname, password],
        (error, results) => {
          if (error) {
            reject(error);
          }

          if (!results?.affectedRows) {
            reject(new Error(`User cannot be created`));
          } else {
            resolve();
          }
        },
      );
    });
  }

  static async updateUser(id, { Nickname, Password }) {
    return new Promise((resolve, reject) => {
      db.query(
        'UPDATE Users SET Nickname = ?, Password = ? WHERE ID = ?',
        [Nickname, Password, id],
        (error, results) => {
          if (error) {
            reject(error);
          }

          if (results.affectedRows === 0) {
            reject(new Error(`User with ID ${id} not found`));
          } else {
            resolve(results);
          }
        },
      );
    });
  }

  static async deleteUser(id) {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM Users WHERE ID = ?', [id], (error, results) => {
        if (error) {
          reject(error);
        }

        if (results.affectedRows === 0) {
          reject(new Error(`User with ID ${id} not found`));
        }

        if (results.affectedRows) {
          resolve();
        }
      });
    });
  } */
}

module.exports = User;
