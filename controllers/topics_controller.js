const db = require('../db/connection');

exports.getTopics = (req, res, next) => {
  db('topics')
    .select()
    .then(topics => res.send({ topics }))
    .catch(next);
};

exports.getArticlesBySlug = (req, res, next) => {
  const { topic } = req.params;
  db('articles')
    .select('users.username AS author', 'articles.title', 'articles.article_id', 'articles.votes', 'articles.created_at', 'articles.topic')
    .join('comments', 'articles.article_id', 'comments.article_id')
    .join('users', 'articles.user_id', 'users.user_id')
    .where('topic', '=', topic)
    .groupBy('articles.article_id', 'users.username')
    .count('comment_id as comment_count')
    .then((articles) => {
      if (articles.length === 0) next({ status: 404, msg: 'no data for this endpoint...' });
      else res.send({ articles });
    })
    .catch(next);
};
