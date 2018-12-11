const db = require('../db/connection');

exports.getUsers = (req, res, next) => {
  db('users')
    .select()
    .then((users) => {
      res.send({ users });
    })
    .catch(next);
};

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  db('users')
    .select()
    .where('username', '=', username)
    .then(([user]) => {
      if (user === undefined) next({ status: 404, msg: 'no data for this endpoint...' });
      else res.send({ user });
    })
    .catch(next);
};
