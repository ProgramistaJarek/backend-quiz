const Questions = (sequelize, Sequelize) => {
  return sequelize.define(
    'Questions',
    {
      ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      QuizID: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      TypeID: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
