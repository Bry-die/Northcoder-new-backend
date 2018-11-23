
exports.checkParam = (req, res, next, endpoint) => {
  if (/^\d+$/.test(endpoint)) next();
  else next({ code: '22P02' });
};

exports.handle405 = (req, res, next) => {
  res.status(405).send({ msg: 'method not allowed...' });
};
