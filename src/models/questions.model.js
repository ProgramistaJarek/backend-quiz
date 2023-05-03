const Questions = (sequelize, Sequelize) => {
  return sequelize.define(
    'questions',
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      quizId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'quizzes',
          key: 'id',
        },
      },
      typeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'questionTypes',
          key: 'id',
        },
      },
      question: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      path: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
    },
    {
      tableName: 'questions',
      timestamps: false,
    },
  );
};

module.exports = Questions;
