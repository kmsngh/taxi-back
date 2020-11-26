const models = require('../models');
const { hashed, getRandomString } = require('../../utils/crypto');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const salt = getRandomString(16);
    const password = hashed('aaaaaa', salt);
    return Promise.all([
      models.User.create({
        nickname: 'passenger1',
        phone: '01010001000',
        salt,
        password,
        isDriver: false,
      }),
      models.User.create({
        nickname: 'passenger2',
        phone: '01020002000',
        salt,
        password,
        isDriver: false,
      }),
      models.User.create({
        nickname: 'passenger3',
        phone: '01030003000',
        salt,
        password,
        isDriver: false,
      }),
      models.User.create({
        nickname: 'passenger4',
        phone: '01040004000',
        salt,
        password,
        isDriver: false,
      }),
      models.User.create({
        nickname: 'passenger5',
        phone: '01050005000',
        salt,
        password,
        isDriver: false,
      }),
      models.User.create({
        nickname: 'driver1',
        phone: '02010001000',
        salt,
        password,
        isDriver: true,
      }),
      models.User.create({
        nickname: 'driver2',
        phone: '02020002000',
        salt,
        password,
        isDriver: true,
      }),
      models.User.create({
        nickname: 'driver3',
        phone: '02030003000',
        salt,
        password,
        isDriver: true,
      }),
      models.User.create({
        nickname: 'driver4',
        phone: '02040004000',
        salt,
        password,
        isDriver: true,
      }),
      models.User.create({
        nickname: 'driver5',
        phone: '02050005000',
        salt,
        password,
        isDriver: true,
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('User', null, {});
  },
};
