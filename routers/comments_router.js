const commentsRouter = require('express').Router();
const { handle405 } = require('../utils');
const { incrementVotes } = require('../controllers/comments_controller');

commentsRouter.route('/:comment_id')
  .patch(incrementVotes)
  .all(handle405);

module.exports = { commentsRouter };
