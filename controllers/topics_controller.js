const db = require('../db/connection');

exports.getTopics = (req, res, next) => {
  db('topics')
    .select()
    .then(topics => res.send({ topics }))
    .catch(next);
};

exports.getArticlesBySlug = (req, res, next) => {
  const { topic } = req.params;
  const {
    limit = 10,
    sort_by = 'created_at',
    p = 1,
    sort_ascending = false,
  } = req.query;
  const offset = (p - 1) * limit;
  let order = 'desc';
  if (sort_ascending) order = 'asc';
  db('articles')
    .select('users.username AS author', 'articles.title', 'articles.article_id', 'articles.votes', 'articles.created_at', 'articles.topic')
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .join('users', 'articles.user_id', 'users.user_id')
    .where('topic', '=', topic)
    .groupBy('articles.article_id', 'users.username')
    .count('comment_id as comment_count')
    .limit(limit)
    .orderBy(sort_by, order)
    .offset(offset)
    .then((articles) => {
      if (articles.length === 0) next({ status: 404, msg: 'no data for this endpoint...' });
      else res.send({ articles });
    })
    .catch(next);
};

exports.postTopic = (req, res, next) => {
  const { slug, description } = req.body;
  db('topics')
    .insert({
      slug,
      description,
    })
    .returning('*')
    .then(([topic]) => {
      res.status(201).send({ topic });
    })
    .catch(next);
};
