const Answers = (sequelize, Sequelize) => {
  return sequelize.define(
    'Answers',
    {
      ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      QuestionID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Questions',
          key: 'ID',
        },
      },
      Answer: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      IsCorrect: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      Path: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
    },
    {
      tableName: 'Answers',
      timestamps: false,
    },
  );
};

module.exports = Answers;
