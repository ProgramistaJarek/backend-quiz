const Questions = (sequelize, Sequelize) => {
  return sequelize.define(
    'Questions',
    {
      ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      QuizID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Quizzes',
          key: 'ID',
        },
      },
      TypeID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'QuestionTypes',
          key: 'ID',
        },
      },
      Question: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      Path: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
    },
    {
      tableName: 'Questions',
      timestamps: false,
    },
  );
};

module.exports = Questions;
