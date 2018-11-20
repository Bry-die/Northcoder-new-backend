const app = require('express')();
const bodyParser = require('body-parser');
const { apiRouter } = require('./routers/api_router');

app.use(bodyParser.json());

app.use('/api', apiRouter);

app.use('/*', (req, res, next) => next({ status: 404, msg: "no page found" }));

//error handling

module.exports = app;