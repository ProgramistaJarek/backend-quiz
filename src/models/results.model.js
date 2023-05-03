const Results = (sequelize, Sequelize) => {
  return sequelize.define(
    'results',
    {
      quizId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'quizzes',
          key: 'id',
        },
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      playerName: {
        type: Sequelize.STRING(16),
        allowNull: false,
      },
      score: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: 'results',
      timestamps: true,
    },
  );
};

module.exports = Results;
