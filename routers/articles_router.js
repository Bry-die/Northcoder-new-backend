const articlesRouter = require('express').Router();
const { handle405, checkParam } = require('../utils');
const { commentsRouter } = require('./comments_router');

const {
  getArticles,
  getArticlesById,
  updateVotes,
  deleteArticle,
  getCommentsByArticleId,
  postCommentByArticleId,
} = require('../controllers/articles_controller');

articlesRouter.route('/')
  .get(getArticles)
  .all(handle405);

articlesRouter.param('article_id', (req, res, next, article_id) => {
  checkParam(req, res, next, article_id);
});

articlesRouter.route('/:article_id')
  .get(getArticlesById)
  .patch(updateVotes)
  .delete(deleteArticle)
  .all(handle405);

articlesRouter.route('/:article_id/comments')
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId)
  .all(handle405);

articlesRouter.use('/:article_id/comments/comment_id', commentsRouter);

module.exports = { articlesRouter };
