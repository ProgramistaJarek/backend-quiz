const User = (sequelize, Sequelize) => {
  return sequelize.define(
    'Users',
    {
      ID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      Nickname: {
        type: Sequelize.STRING(16),
        allowNull: false,
        unique: true,
      },
      Password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
    },
    {
      tableName: 'Users',
      // timestamps: false,
    },
  );
};

module.exports = User;
