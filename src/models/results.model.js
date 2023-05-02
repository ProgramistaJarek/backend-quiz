const Results = (sequelize, Sequelize) => {
  return sequelize.define(
    'Results',
    {
      QuizID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'Quizzes',
          key: 'ID',
        },
      },
      UserID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'Users',
          key: 'ID',
        },
      },
      PlayerName: {
        type: Sequelize.STRING(16),
        allowNull: false,
      },
      Score: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: 'Results',
      // timestamps: false,
    },
  );
};

module.exports = Results;
