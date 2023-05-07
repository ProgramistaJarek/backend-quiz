const Results = (sequelize, Sequelize) => {
  return sequelize.define(
    'results',
    {
      quizId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'quizzes',
          key: 'id',
        },
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
      indexes: [
        {
          unique: false,
          fields: ['quizId'],
        },
        {
          unique: false,
          fields: ['userId'],
        },
      ],
    },
  );
};

module.exports = Results;
