const User = (sequelize, Sequelize) => {
  return sequelize.define(
    'users',
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      username: {
        type: Sequelize.STRING(16),
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
    },
    {
      tableName: 'users',
    },
  );
};

module.exports = User;
