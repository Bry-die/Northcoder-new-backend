const topicsRouter = require('express').Router();
const {
  getTopics,
  getArticlesBySlug,
  postTopic,
  postArticleByTopic,
} = require('../controllers/topics_controller');
const { handle405 } = require('../utils');

topicsRouter.route('/')
  .get(getTopics)
  .post(postTopic)
  .all(handle405);

topicsRouter.route('/:topic/articles')
  .get(getArticlesBySlug)
  .post(postArticleByTopic)
  .all(handle405);

module.exports = { topicsRouter };
