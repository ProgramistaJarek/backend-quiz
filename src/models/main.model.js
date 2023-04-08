const db = require('../configs/db');

class Model {
  constructor(table) {
    this.table = table;
  }

  async findAll() {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM ??', [this.table], (error, result) => {
        if (error) reject(error);

        resolve(result);
      });
    });
  }

  async findById(id) {
    return new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM ?? WHERE ID = ?',
        [this.table, id],
        (error, result) => {
          if (error) reject(error);

          if (result === undefined || result?.length === 0) {
            reject(new Error(`Item with ID ${id} not found`));
            return;
          }

          resolve(result[0]);
        },
      );
    });
  }

  async create(data) {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO ?? SET ?', [this.table, data], (error, result) => {
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
      });
    });
  }

  async update(id, data) {
    return new Promise((resolve, reject) => {
      db.query(
        'UPDATE ?? SET ? WHERE id = ?',
        [this.table, data, id],
        (error, result) => {
          if (error) reject(error);

          this.findById(id)
            .then((value) => {
              resolve(value);
            })
            .catch((error) => {
              reject(error);
            });
        },
      );
    });
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      db.query(
        'DELETE FROM ?? WHERE id = ?',
        [this.table, id],
        function (error, result) {
          if (error) reject(error);

          resolve();
        },
      );
    });
  }
}

module.exports = Model;
