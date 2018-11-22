
exports.handle404 = (err, req, res, next) => {
  // console.log(err);
  if (err.msg === 'no data for this endpoint...') res.status(404).send({ msg: err.msg });
  if (err.status === 404) res.status(404).send({ msg: 'page not found...' });
  else next(err);
};

exports.handle400 = (err, req, res, next) => {
  if (!err.code) err.code = '22P02';
  const codes = {
    AAA: 'bad request malformed param...',
    42703: 'something something something...',
    23502: 'violating not-null constraint...',
    '22P02': 'bad request, malformed body...',
  };
  if (codes[err.code]) res.status(400).send({ msg: codes[err.code] });
  else next(err);
};

exports.handle422 = (err, req, res, next) => {
  const codes = {
    23505: 'inprocessable entity...',
  };
  if (codes[err.code]) res.status(422).send({ msg: codes[err.code] });
  else next(err);
};

exports.handle500 = (err, req, res, next) => {
  res.status(500).send({ msg: 'internal server error' });
};
