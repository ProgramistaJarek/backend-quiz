const QuizTypes = (sequelize, Sequelize) => {
  return sequelize.define(
    'QuizTypes',
    {
      ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      Type: {
        type: Sequelize.STRING(32),
        allowNull: false,
      },
    },
    {
      tableName: 'QuizTypes',
    },
  );
};

module.exports = QuizTypes;
