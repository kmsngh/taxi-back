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
      readyToJoinUser: DataTypes.UUID,
      phone: DataTypes.STRING,
      password: DataTypes.STRING,
      salt: DataTypes.STRING,
      isDriver: DataTypes.BOOLEAN,
      arrivesAt: DataTypes.DATE,
      waitingSince: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      validArrivesAt: {
        type: DataTypes.VIRTUAL,
        get: function () {
          const now = new Date();
          const updatedAt = new Date(this.updatedAt);
          const arrivesAt = new Date(this.arrivesAt);
          const isPastThirtyMins =
            now.getTime() - updatedAt.getTime() > 1000 * 60 * 30;
          const isPastTenMins =
            now.getTime() - updatedAt.getTime() > 1000 * 60 * 10;
          const isPast = now.getTime() - arrivesAt.getTime() > 0;
          return isPast
            ? null
            : this.isDriver
            ? isPastThirtyMins
              ? null
              : this.arrivesAt
            : isPastTenMins
            ? null
            : this.arrivesAt;
        },
      },
      validWaitingSince: {
        type: DataTypes.VIRTUAL,
        get: function () {
          const now = new Date();
          const updatedAt = new Date(this.updatedAt);
          const isPastFiveMins =
            now.getTime() - updatedAt.getTime() > 1000 * 60 * 5;
          const isPastThirtyMins =
            now.getTime() - updatedAt.getTime() > 1000 * 60 * 30;
          return this.isDriver
            ? isPastThirtyMins
              ? null
              : this.waitingSince
            : isPastFiveMins
            ? null
            : this.waitingSince;
        },
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
      defaultScope: {
        attributes: { exclude: ['password', 'salt'] },
      },
    }
  );
  User.associate = function (models) {
    // associations can be defined here
  };
  return User;
};
