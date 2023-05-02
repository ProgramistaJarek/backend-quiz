const Results = (sequelize, Sequelize) => {
  return sequelize.define(
    'Results',
    {
      QuizID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      UserID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
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
      timestamps: true,
    },
  );
};

module.exports = Results;
