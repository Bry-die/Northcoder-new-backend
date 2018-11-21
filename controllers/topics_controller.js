const db = require('../db/connection');
const { handle404 } = ('../errors');

exports.getTopics = (req, res, next) => {
  db('topics')
    .select()
    .then(topics => res.send({ topics }))
    .catch(next);
};

exports.getArticlesBySlug = (req, res, next) => {
  const { topic } = req.params;
  db('articles')
    .join('users', 'articles.user_id', 'users.user_id')
    .join('comments', 'articles.article_id', 'comments.article_id')
    .select()
    .where('topic', '=', topic)
    .then(articles => {
      if (articles.length === 0) next({ status: 404, msg: 'no data for this endpoint...' }); 
      else res.send({ articles })
    })
    .catch(next);
};