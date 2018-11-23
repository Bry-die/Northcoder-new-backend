const commentsRouter = require('express').Router();
const { handle405 } = require('../utils');
const { incrementVotes, deleteComment } = require('../controllers/comments_controller');

commentsRouter.route('/:comment_id')
  .patch(incrementVotes)
  .delete(deleteComment)
  .all(handle405);

module.exports = { commentsRouter };
