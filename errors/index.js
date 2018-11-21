
exports.handle404 = (err, req, res, next) => {
    if (err.msg === 'no data for this endpoint...') res.status(404).send({ msg: err.msg });
    if (err.status === 404) res.status(404).send({ msg: 'page not found...' });
    else next(err);
};

exports.handle400 = (err, req, res, next) => {
    if (err.msg === 'bad request malformed param...') res.status(400).send({ msg: 'bad request malformed param...' });
    else next(err);
};

exports.handle405 = (err, req, res, next) => {
    next(err);
};

exports.handle422 = (err, req, res, next) => {
    next(err);
};

exports.handle500 = (err, req, res, next) => {
    res.status(500).send({ msg: "internal server error" });
};

