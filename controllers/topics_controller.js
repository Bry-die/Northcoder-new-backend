const db = require('../db/connection');

exports.getTopics = (req, res, next) => {
  db('topics')
    .select()
    .then(topics => res.send({ topics }))
    .catch(next);
};