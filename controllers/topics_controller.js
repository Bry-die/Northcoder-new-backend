const db = require('../db/connection');

exports.getTopics = (req, res, next) => {
  db('topics')
    .select()
    .then(topics => res.send({ topics }))
    .catch(next);
};

exports.getArticlesBySlug = (req, res, next) => {
  const { topic } = req.params;
  const { limit = 10, p = 1, sort_ascending = false } = req.query;
  let {
    sort_by = 'created_at',
  } = req.query;
  const offset = (p - 1) * limit;
  let order = 'desc';
  const columns = ['author', 'title', 'article_id', 'votes', 'created_at', 'topic', 'comment_count'];
  let count = 0;
  columns.forEach((column) => {
    if (sort_by === column) count += 1;
  });
  if (count === 0) sort_by = 'created_at';
  if (sort_ascending) order = 'asc';
  if (isNaN(limit)) next({ code: 'AAA' });
  if (isNaN(p)) next({ code: 'AAA' });
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

exports.postArticleByTopic = (req, res, next) => {
  const { title, body, user_id } = req.body;
  const { topic } = req.params;
  const created_at = new Date(Date.now());
  db('articles')
    .insert({
      title,
      body,
      user_id,
      topic,
      created_at,
    })
    .returning('*')
    .then(([article]) => {
      res.status(201).send({ article });
    })
    .catch(next);
};
