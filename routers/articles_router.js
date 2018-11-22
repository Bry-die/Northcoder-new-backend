const articlesRouter = require('express').Router();
const { handle405 } = require('../utils');
const { getArticles } = require('../controllers/articles_controller');

articlesRouter.route('/')
  .get(getArticles)
  .all(handle405);

module.exports = { articlesRouter };
