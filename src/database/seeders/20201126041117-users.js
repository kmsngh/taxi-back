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

    await queryInterface.bulkDelete('User', null, {});
    const salt = 'aaaabbbbccccdddd';
    const password = hashed('111111', salt);
    const now = new Date();
    const waitingSince = new Date(now.getTime() - 1000 * 60 * 5);
    const arrivesAt = new Date(now.getTime() + 1000 * 60 * 5);
    const updatedAt = now;
    return Promise.all([
      models.User.create({
        nickname: '넙죽이승객',
        phone: '01010001000',
        salt,
        password,
        arrivesAt,
        updatedAt,
        isDriver: false,
      }),
      models.User.create({
        nickname: '거위승객',
        phone: '01020002000',
        salt,
        password,
        arrivesAt,
        updatedAt,
        isDriver: false,
      }),
      models.User.create({
        nickname: '고양이승객',
        phone: '01030003000',
        salt,
        password,
        arrivesAt,
        updatedAt,
        isDriver: false,
      }),
      models.User.create({
        nickname: '고라니승객',
        phone: '01040004000',
        salt,
        password,
        waitingSince,
        updatedAt,
        isDriver: false,
      }),
      models.User.create({
        nickname: '까리용승객',
        phone: '01050005000',
        salt,
        password,
        waitingSince,
        updatedAt,
        isDriver: false,
      }),
      models.User.create({
        nickname: '오리승객',
        phone: '01060006000',
        salt,
        password,
        waitingSince,
        updatedAt,
        isDriver: false,
      }),
      models.User.create({
        nickname: '넙죽이기사',
        phone: '02010001000',
        salt,
        password,
        arrivesAt,
        updatedAt,
        isDriver: true,
      }),
      models.User.create({
        nickname: '거위기사',
        phone: '02020002000',
        salt,
        password,
        arrivesAt,
        updatedAt,
        isDriver: true,
      }),
      models.User.create({
        nickname: '고양이기사',
        phone: '02030003000',
        salt,
        password,
        arrivesAt,
        updatedAt,
        isDriver: true,
      }),
      models.User.create({
        nickname: '고라니기사',
        phone: '02040004000',
        salt,
        password,
        waitingSince,
        updatedAt,
        isDriver: true,
      }),
      models.User.create({
        nickname: '까리용기사',
        phone: '02050005000',
        salt,
        password,
        waitingSince,
        updatedAt,
        isDriver: true,
      }),
      models.User.create({
        nickname: '오리기사',
        phone: '02060006000',
        salt,
        password,
        waitingSince,
        updatedAt,
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
