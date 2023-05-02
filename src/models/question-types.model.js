const QuestionTypes = (sequelize, Sequelize) => {
  return sequelize.define(
    'QuestionTypes',
    {
      ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      Type: {
        type: Sequelize.STRING(32),
        allowNull: false,
      },
    },
    {
      tableName: 'QuestionTypes',
      timestamps: true,
    },
  );
};

module.exports = QuestionTypes;
