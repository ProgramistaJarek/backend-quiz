const QuestionTypes = (sequelize, Sequelize) => {
  return sequelize.define(
    'questionTypes',
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      type: {
        type: Sequelize.STRING(32),
        allowNull: false,
      },
    },
    {
      tableName: 'questionTypes',
      timestamps: true,
    },
  );
};

module.exports = QuestionTypes;
