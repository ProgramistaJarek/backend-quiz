const Quizzes = (sequelize, Sequelize) => {
  return sequelize.define(
    'Quizzes',
    {
      ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      AuthorID: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      TypeID: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Name: {
        type: Sequelize.STRING(128),
        allowNull: false,
      },
    },
    {
      tableName: 'Quizzes',
    },
  );
};

module.exports = Quizzes;
