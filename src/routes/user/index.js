const Router = require('koa-router');

const userRouter = new Router();

const user = require('./user');

userRouter.post('/register', user.register);
userRouter.post('/login', user.login);
userRouter.get('/check', user.check);
userRouter.get('/logout', user.logout);

userRouter.get('/passengers', user.passengers);
userRouter.get('/drivers', user.drivers);

userRouter.post('/arrivesAt', user.arrivesAt);
userRouter.post('/waitingSince', user.waitingSince);

userRouter.patch('/arrivesAt', user.updateArrivesAt);
userRouter.patch('/waitingSince', user.updateWaitingSince);

userRouter.patch('/:userId', user.join);

module.exports = userRouter;
