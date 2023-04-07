const db = require('../configs/db');

class Model {
  constructor(table) {
    console.log(`Table name: ${table}`);
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

          if (result.length === 0) {
            reject(new Error(`Item with ID ${id} not found`));
          }

          resolve(result[0]);
        },
      );
    });
  }

  /* //insert data via object such as {id: 1, title: 'Hello MySQL'}
  static async create(data) {
    let _this = this;
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO ?? SET ?', [_this.table, data], (error, result) => {
        if (error) throw error;
        let data = _this.find(result.insertId);
        data
          .then(function (value) {
            myResolve(value);
          })
          .catch(function (error) {
            myReject(error);
          });
      });
    });
  }

  //update row and return new data as an object
  static async update(id, data) {
    let _this = this;
    return new Promise((resolve, reject) => {
      db.query(
        'UPDATE  ?? SET ? WHERE id = ?',
        [_this.table, data, id],
        function (error, result) {
          if (error) throw error;
          let data = _this.find(id);
          data
            .then(function (value) {
              myResolve(value);
            })
            .catch(function (error) {
              myReject(error);
            });
        },
      );
    });
  }

  static async delete(id) {
    let _this = this;
    return new Promise((resolve, reject) => {
      db.query(
        'DELETE FROM  ??  WHERE id = ?',
        [_this.table, id],
        function (error, result) {
          if (error) throw error;
          myResolve(result);
        },
      );
    });
  } */
}

module.exports = Model;
