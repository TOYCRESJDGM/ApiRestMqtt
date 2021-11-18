const router = require('express').Router();
const dataRouter = require("./api/data");
const alertRouter = require("./api/alert");
const UsersRouter = require('./api/user');

router.use('/data', dataRouter);
router.use('/alert', alertRouter);
router.use('/user', UsersRouter);

module.exports = router