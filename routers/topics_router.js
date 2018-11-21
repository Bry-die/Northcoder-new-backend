const topicsRouter = require('express').Router();
const { getTopics, getArticlesBySlug } = require('../controllers/topics_controller');
const { handle405 } = require('../errors');

topicsRouter.route('/')
  .get(getTopics)
  .all(handle405);

topicsRouter.param('topic', (req, res, next, topic) => {
  if (/^[a-z]+$/gi.test(topic)) next();
  else next({ status: 400, msg: 'bad request malformed param...' });
});

topicsRouter.route('/:topic/articles')
  .get(getArticlesBySlug)
  .all(handle405);

module.exports = { topicsRouter }