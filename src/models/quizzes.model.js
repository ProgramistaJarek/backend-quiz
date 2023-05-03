const Quizzes = (sequelize, Sequelize) => {
  return sequelize.define(
    'quizzes',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      authorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      typeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'quizTypes',
          key: 'id',
        },
      },
      name: {
        type: Sequelize.STRING(128),
        allowNull: false,
      },
    },
    {
      tableName: 'quizzes',
    },
  );
};

module.exports = Quizzes;
