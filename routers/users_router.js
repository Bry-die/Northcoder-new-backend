const usersRouter = require('express').Router();
const { handle405 } = require('../utils');
const { getUsers, getUserByUsername } = require('../controllers/users.controller');

usersRouter.route('/')
  .get(getUsers)
  .all(handle405);

usersRouter.route('/:username')
  .get(getUserByUsername)
  .all(handle405);

module.exports = { usersRouter };
