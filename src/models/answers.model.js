const Answers = (sequelize, Sequelize) => {
  return sequelize.define(
    'answers',
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      answerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      questionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'questions',
          key: 'id',
        },
      },
      quizId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'quizzes',
          key: 'id',
        },
      },
      answer: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      isCorrect: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      path: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
    },
    {
      tableName: 'answers',
      timestamps: false,
    },
  );
};

module.exports = Answers;
