const db = require('../configs/db');
const Model = require('./main.model');

class User extends Model {
  constructor() {
    super('Users');
  }

  async findByUsername(username) {
    return new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM ?? WHERE Nickname = ?',
        [this.table, username],
        (error, result) => {
          if (error) reject(error);

          resolve(result[0]);
        },
      );
    });
  }

  async signUp(username, password) {
    return new Promise((resolve, reject) => {
      db.query(
        'INSERT INTO ?? (Nickname, Password) VALUES (?, ?)',
        [this.table, username, password],
        (error, result) => {
          if (error) reject(error);

          if (result) {
            this.findById(result.insertId)
              .then((value) => {
                resolve(value);
              })
              .catch((error) => {
                reject(error);
              });
          }
        },
      );
    });
  }
}

module.exports = User;
