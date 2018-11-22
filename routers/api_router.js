const apiRouter = require('express').Router();
const { topicsRouter } = require('./topics_router');
const { articlesRouter } = require('./articles_router');

apiRouter.use('/topics', topicsRouter);

apiRouter.use('/articles', articlesRouter);

module.exports = { apiRouter };
