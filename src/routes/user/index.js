const Router = require('koa-router');

const userRouter = new Router();

const user = require('./user');

userRouter.post('/register', user.register);
userRouter.post('/login', user.login);
userRouter.get('/check', user.check);
userRouter.get('/logout', user.logout);

userRouter.get('/other/:userId', user.other);

userRouter.get('/passengers', user.passengers);
userRouter.get('/drivers', user.drivers);

userRouter.post('/arrivesAt', user.arrivesAt);
userRouter.post('/waitingSince', user.waitingSince);

userRouter.patch('/update', user.update);
userRouter.patch('/', user.cancel);

userRouter.patch('/arrivesAt', user.updateArrivesAt);
userRouter.patch('/waitingSince', user.updateWaitingSince);

userRouter.patch('/try/:userId', user.tryJoin);
userRouter.patch('/accept', user.acceptJoin);
userRouter.patch('/cancel', user.cancelJoin);

module.exports = userRouter;
