const usersRouter = require('express').Router();
const { handle405 } = require('../utils');
const { getUsers, getUserById } = require('../controllers/users.controller');

usersRouter.route('/')
  .get(getUsers)
  .all(handle405);

usersRouter.route('/:user_id')
  .get(getUserById)
  .all(handle405);

module.exports = { usersRouter };
