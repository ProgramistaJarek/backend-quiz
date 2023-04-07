const mysql = require('mysql2');
const config = require('./db.config');

const connection = mysql.createConnection(config.db);

connection.connect((error) => {
  if (error) {
    console.error('Failed to connect to MySQL database:', error);
  } else {
    console.log('Connected to MySQL database');
  }
});

module.exports = connection;
