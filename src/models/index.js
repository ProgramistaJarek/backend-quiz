const config = require('../configs/db.config.js');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  config.db.database,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    dialect: 'mysql',
    timezone: '+02:00',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.questionTypes = require('./question-types.model.js')(sequelize, Sequelize);
db.quizTypes = require('./quiz-types.model.js')(sequelize, Sequelize);
db.results = require('./results.model.js')(sequelize, Sequelize);
db.quizzes = require('./quizzes.model.js')(sequelize, Sequelize);
db.user = require('./user.model.js')(sequelize, Sequelize);
db.answers = require('./answers.model.js')(sequelize, Sequelize);
db.questions = require('./questions.model.js')(sequelize, Sequelize);

db.answers.belongsTo(db.questions, {
  foreignKey: 'questionId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
db.answers.belongsTo(db.quizzes, {
  foreignKey: 'quizId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
db.questions.belongsTo(db.quizzes, {
  foreignKey: 'quizId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
db.questions.belongsTo(db.questionTypes, {
  foreignKey: 'typeId',
  onDelete: 'NO ACTION',
  onUpdate: 'CASCADE',
});
db.quizzes.belongsTo(db.user, {
  foreignKey: 'authorId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
db.quizzes.belongsTo(db.quizTypes, {
  foreignKey: 'typeId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
db.results.belongsTo(db.quizzes, {
  foreignKey: 'quizId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
db.results.belongsTo(db.user, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

module.exports = db;
