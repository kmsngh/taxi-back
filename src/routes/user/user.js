require('module-alias/register');
const models = require('@models');
const { generateToken } = require('@utils/jwt');
const { hashed, getRandomString } = require('@utils/crypto');
const { checkAndGetUser } = require('@utils/auth');

exports.register = async (ctx) => {
  const { nickname, phone, password } = ctx.request.body;
  const phoneUser = await models.User.findOne({
    where: { phone },
    attributes: ['phone'],
  });
  ctx.assert(!phoneUser, 400, '이미 사용중인 전화번호입니다.');
  const nicknameUsesr = await models.User.findOne({
    where: { nickname },
  });
  ctx.assert(!nicknameUsesr, 400, '이미 사용중인 닉네임입니다.');
  // Generate random string of length 16
  const salt = getRandomString(16);
  const value = hashed(password, salt);
  const newUser = await models.User.create({
    nickname,
    phone,
    salt,
    password: value,
  });

  ctx.status = 204;
};

exports.login = async (ctx) => {
  const { nickname, password } = ctx.request.body;
  const user = await models.User.findOne({
    where: { nickname },
    attributes: { include: ['password', 'salt'] },
  });
  ctx.assert(user, 400, 'The account does not exist.');
  const value = hashed(password, user.salt);
  ctx.assert(value === user.password, 401, 'The password is incorrect.');
  const token = await generateToken({ id: user.id });
  ctx.cookies.set(process.env.ACCESS_TOKEN, token, {
    maxAge: 1000 * 60 * 60 * 24,
    overwrite: true,
  });
  ctx.status = 204;
};

exports.check = async (ctx) => {
  ctx.assert(ctx.request.user, 401, '401: Unauthorized user');
  const { id } = ctx.request.user;
  const user = await models.User.findOne({
    where: { id },
    attributes: { include: ['phone'] },
  });
  ctx.assert(user, 401, '401: Unauthorized user');
  ctx.body = user;
};

exports.logout = async (ctx) => {
  ctx.cookies.set(process.env.ACCESS_TOKEN, null);
  ctx.status = 204;
};

exports.other = async (ctx) => {
  const otherId = ctx.params.userId;
  const otherUser = await models.User.findOne({
    where: { id: otherId },
  });

  ctx.body = otherUser;
};

exports.passengers = async (ctx) => {
  const passengers = await models.User.findAll({
    where: { isDriver: false },
  });

  ctx.body = passengers;
};

exports.drivers = async (ctx) => {
  const drivers = await models.User.findAll({ where: { isDriver: true } });

  ctx.body = drivers;
};

exports.arrivesAt = async (ctx) => {
  const user = await checkAndGetUser(ctx);
  const now = new Date();
  const { minutes } = ctx.request.body;
  const arrivesAt = new Date(now.getTime() + minutes * 60000);

  user.arrivesAt = arrivesAt;
  user.waitingSince = null;
  user.updatedAt = now;
  await user.save();

  ctx.body = arrivesAt;
};

exports.waitingSince = async (ctx) => {
  const user = await checkAndGetUser(ctx);
  const now = new Date();

  user.waitingSince = now;
  user.updatedAt = now;
  await user.save();

  ctx.body = user.waitingSince;
};

exports.update = async (ctx) => {
  const user = await checkAndGetUser(ctx);

  if (!user.validWaitingSince) user.waitingSince = null;
  if (!user.validArrivesAt) user.arrivesAt = null;
  user.updatedAt = new Date();

  await user.save();

  ctx.status = 204;
};

exports.cancel = async (ctx) => {
  const user = await checkAndGetUser(ctx);

  user.updatedAt = new Date();
  user.waitingSince = null;
  user.arrivesAt = null;

  await user.save();

  ctx.status = 204;
};

exports.updateArrivesAt = async (ctx) => {
  const user = await checkAndGetUser(ctx);

  const minutes = user.isDriver ? 30 : 10;

  const now = new Date();

  const arrivesAt = new Date(now.getTime() + minutes * 60000);

  user.arrivesAt = arrivesAt;
  user.updatedAt = now;
  await user.save();

  ctx.body = arrivesAt;
};

exports.updateWaitingSince = async (ctx) => {
  const user = await checkAndGetUser(ctx);

  user.updatedAt = new Date();
  await user.save();

  ctx.body = waitingSince;
};

exports.tryJoin = async (ctx) => {
  const user = await checkAndGetUser(ctx);
  const joinId = ctx.params.userId;
  const joinUser = await models.User.findOne({
    where: { id: joinId },
  });

  joinUser.readyToJoinUser = user.id;

  await joinUser.save();

  ctx.status = 204;
};

exports.acceptJoin = async (ctx) => {
  const user = await checkAndGetUser(ctx);
  const joinId = user.readyToJoinUser;
  const joinUser = await models.User.findOne({
    where: { id: joinId },
  });

  joinUser.arrivesAt = null;
  joinUser.waitingSince = null;
  joinUser.readyToJoinUser = null;
  user.arrivesAt = null;
  user.waitingSince = null;
  user.readyToJoinUser = null;

  await user.save();
  await joinUser.save();

  ctx.status = 204;
};

exports.cancelJoin = async (ctx) => {
  const user = await checkAndGetUser(ctx);

  user.readyToJoinUser = null;

  await user.save();

  ctx.status = 204;
};
