const db = require('../db/connection');

exports.getUsers = (req, res, next) => {
  db('users')
    .select()
    .then((users) => {
      res.send({ users });
    })
    .catch(next);
};

exports.getUserById = (req, res, next) => {
  const { user_id } = req.params;
  db('users')
    .select()
    .where('user_id', '=', user_id)
    .then(([user]) => {
      if (user === undefined) next({ status: 404, msg: 'no data for this endpoint...' });
      else res.send({ user });
    });
};
