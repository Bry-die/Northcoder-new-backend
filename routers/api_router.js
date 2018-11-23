const apiRouter = require('express').Router();
const { topicsRouter } = require('./topics_router');
const { articlesRouter } = require('./articles_router');
const { commentsRouter } = require('./comments_router');
const { usersRouter } = require('./users_router');
const { handle405, apiObj } = require('../utils');

apiRouter.use('/topics', topicsRouter);

apiRouter.use('/articles', articlesRouter);

apiRouter.use('/comments', commentsRouter);

apiRouter.use('/users', usersRouter);

apiRouter.route('/')
  .get((req, res, next) => {
    res.status(200).send(apiObj);
  })
  .all(handle405);

module.exports = { apiRouter };
