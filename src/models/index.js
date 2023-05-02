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

db.quizzes.hasMany(db.results, { foreignKey: 'QuizID' });
db.results.belongsTo(db.quizzes, { foreignKey: 'QuizID' });

db.quizTypes.hasMany(db.quizzes, { foreignKey: 'TypeID' });
db.quizzes.belongsTo(db.quizTypes, { foreignKey: 'TypeID' });

db.user.hasMany(db.quizzes, { foreignKey: 'AuthorID' });
db.quizzes.belongsTo(db.user, { foreignKey: 'AuthorID' });

db.questions.belongsTo(db.quizzes, {
  foreignKey: 'QuizID',
  onDelete: 'cascade',
});
db.questions.belongsTo(db.questionTypes, { foreignKey: 'TypeID' });

db.answers.belongsTo(db.questions, {
  foreignKey: 'QuestionID',
  onDelete: 'cascade',
});
db.questions.hasMany(db.answers, { foreignKey: 'QuestionID' });

db.answers.belongsTo(db.quizzes, { foreignKey: 'QuizID', onDelete: 'cascade' });
db.quizzes.hasMany(db.answers, { foreignKey: 'QuizID' });

module.exports = db;
