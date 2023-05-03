const QuizTypes = (sequelize, Sequelize) => {
  return sequelize.define(
    'quizTypes',
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      type: {
        type: Sequelize.STRING(32),
        allowNull: false,
      },
    },
    {
      tableName: 'quizTypes',
      timestamps: true,
    },
  );
};

module.exports = QuizTypes;
