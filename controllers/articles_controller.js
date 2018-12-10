const db = require('../db/connection');

exports.getArticles = (req, res, next) => {
  const { limit = 10, p = 1, sort_ascending = false } = req.query;
  let {
    sort_by = 'created_at',
  } = req.query;
  const offset = (p - 1) * limit;
  let order = 'desc';
  if (sort_ascending) order = 'asc';
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

exports.getArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  db('articles')
    .select('users.username AS author', 'articles.title', 'articles.article_id', 'articles.votes', 'articles.created_at', 'articles.topic')
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .join('users', 'articles.user_id', 'users.user_id')
    .groupBy('articles.article_id', 'users.username')
    .count('comment_id as comment_count')
    .where('articles.article_id', '=', article_id)
    .then(([article]) => {
      if (article === undefined) next({ status: 404, msg: 'no data for this endpoint...' });
      else res.send({ article });
    })
    .catch(next);
};

exports.updateVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  if (!/^-?\d+$/g.test(inc_votes)) next({ code: 'AAA' });
  const int = parseInt(inc_votes, 10);
  db('articles')
    .select()
    .where('article_id', '=', article_id)
    .increment('votes', int)
    .returning('*')
    .then(([article]) => {
      console.log({ article });
      if (article === undefined) next({ status: 404, msg: 'no data for this endpoint...' });
      else res.status(200).send({ article });
    })
    .catch(next);
};

exports.deleteArticle = (req, res, next) => {
  const { article_id } = req.params;
  db('articles')
    .select()
    .del()
    .where('article_id', '=', article_id)
    .returning('*')
    .then((article) => {
      if (article.length === 0) next({ status: 404, msg: 'no data for this endpoint...' });
      res.status(204).send({});
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const {
    limit = 10,
    sort_by = 'created_at',
    p = 1,
    sort_ascending = false,
  } = req.query;
  const offset = (p - 1) * limit;
  let order = 'desc';
  if (sort_ascending) order = 'asc';
  db('comments')
    .select('comment_id', 'comments.votes', 'comments.created_at', 'username AS author', 'comments.body')
    .join('articles', 'comments.article_id', 'articles.article_id')
    .join('users', 'comments.user_id', 'users.user_id')
    .where('comments.article_id', '=', article_id)
    .limit(limit)
    .orderBy(sort_by, order)
    .offset(offset)
    .then((comments) => {
      if (comments.length === 0) next({ status: 404, msg: 'no data for this endpoint...' });
      else res.send({ comments });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const { body, user_id } = req.body;
  const { article_id } = req.params;
  const created_at = new Date(Date.now());
  if (user_id === undefined) next({ code: 'AAA' });
  db('comments')
    .insert({
      article_id,
      body,
      user_id,
      created_at,
    })
    .returning('*')
    .then(([comment]) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next({ code: 'AAA' });
    });
};