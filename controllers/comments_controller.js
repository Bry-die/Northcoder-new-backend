const db = require('../db/connection');

exports.incrementVotes = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  if (!/^-?\d+$/g.test(inc_votes)) next({ code: 'AAA' });
  const int = parseInt(inc_votes, 10);
  db('comments')
    .select()
    .where('comment_id', '=', comment_id)
    .increment('votes', int)
    .returning('*')
    .then(([comment]) => {
      if (comment === undefined) next({ status: 404, msg: 'no data for this endpoint...' });
      else res.status(201).send({ comment });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  db('comments')
    .select()
    .del()
    .where('comment_id', '=', comment_id)
    .then(() => {
      res.status(202).send({});
    })
    .catch(next);
};
