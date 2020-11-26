module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      nickname: DataTypes.STRING,
      phone: DataTypes.STRING,
      password: DataTypes.STRING,
      salt: DataTypes.STRING,
      isDriver: DataTypes.BOOLEAN,
      arrivesAt: DataTypes.DATE,
      waitingSince: DataTypes.DATE,
    },
    {
      freezeTableName: true,
      timestamps: false,
      defaultScope: {
        attributes: { exclude: ['id', 'phone', 'password', 'salt'] },
      },
    }
  );
  User.associate = function (models) {
    // associations can be defined here
  };
  return User;
};
