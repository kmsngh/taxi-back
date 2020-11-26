const { User } = require('@models');
const { generateToken } = require('@utils/jwt');
const { hashed, getRandomString } = require('@utils/crypto');
const { checkAndGetUser } = require('@utils/auth');

exports.register = async (ctx) => {
  const { name, email, password, key } = ctx.request.body;
  const res = await User.findOne({
    where: { email },
    attributes: ['email', 'password', 'salt'],
  });
  ctx.assert(!res, 400, 'The email is already taken.');
  // Generate random string of length 16
  const salt = getRandomString(16);
  const value = hashed(password, salt);
  const newUser = await User.create({
    name,
    email,
    salt,
    password: value,
  });

  Course.findOne({ where: { code: 'CS101' } }).then(async (course) => {
    await newUser.addCourse(course);
    await newUser.save();
  });

  ctx.response.body = newUser;
};

exports.login = async (ctx) => {
  const { email, password } = ctx.request.body;
  const res = await User.findOne({
    where: { email },
    attributes: { include: ['email', 'password', 'salt'] },
  });
  ctx.assert(res, 400, 'The account does not exist.');
  const value = hashed(password, res.salt);
  ctx.assert(value === res.password, 401, 'The password is incorrect.');
  const token = await generateToken({ id: res.id });
  ctx.cookies.set(process.env.ACCESS_TOKEN, token, {
    maxAge: 1000 * 60 * 60 * 24,
    overwrite: true,
  });
  ctx.status = 204;
};

exports.check = async (ctx) => {
  ctx.assert(ctx.request.user, 401, '401: Unauthorized user');
  const { id } = ctx.request.user;
  const user = await User.findOne({
    where: { id },
    attributes: { include: ['email', 'password', 'salt'] },
  });
  ctx.assert(user, 401, '401: Unauthorized user');
  ctx.body = { id, name: user.name };
};

exports.logout = async (ctx) => {
  ctx.cookies.set(process.env.ACCESS_TOKEN, null);
  ctx.status = 204;
};

exports.passengers = async (ctx) => {
  const passengers = await User.findAll({ where: { isDriver: false } });

  ctx.body = passengers;
};

exports.drivers = async (ctx) => {
  const drivers = await User.findAll({ where: { isDriver: true } });

  ctx.body = drivers;
};

exports.arrivesAt = async (ctx) => {
  const user = await checkAndGetUser(ctx);
  const today = new Date();
  const { minutes } = ctx.request.body;
  const arrivesAt = new Date(today.getTime() + minutes * 60000);

  user.arrivesAt = arrivesAt;
  await user.save();

  ctx.body = arrivesAt;
};

exports.waitingSince = async (ctx) => {
  const user = await checkAndGetUser(ctx);
  const today = new Date();

  user.waitingSince = today;
  await user.save();

  ctx.body = waitingSince;
};

exports.updateArrivesAt = async (ctx) => {
  const user = await checkAndGetUser(ctx);

  const minutes = user.isDriver ? 30 : 10;

  const arrivesAt = new Date(user.arrivesAt + minutes * 60000);

  user.arrivesAt = arrivesAt;
  await user.save();

  ctx.body = arrivesAt;
};

exports.updateWaitingSince = async (ctx) => {
  const user = await checkAndGetUser(ctx);

  const minutes = user.isDriver ? 30 : 5;

  const waitingSince = new Date(user.waitingSince + minutes * 60000);

  user.waitingSince = waitingSince;
  await user.save();

  ctx.body = waitingSince;
};

exports.join = async (ctx) => {
  const user = await checkAndGetUser(ctx);
  const joinedId = ctx.params.userId;
  const joinedUser = await User.findOne({ where: { id: joinedId } });

  user.arrivesAt = null;
  user.waitingSince = null;
  joinedUser.arrivesAt = null;
  joinedUser.waitingSince = null;

  await user.save();
  await joinedUser.save();

  ctx.status = 204;
};
