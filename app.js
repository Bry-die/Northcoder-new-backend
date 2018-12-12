const app = require('express')();
const bodyParser = require('body-parser');
const cors = require('cors');
const { apiRouter } = require('./routers/api_router');
const {
  handle400, handle404, handle422, handle500,
} = require('./errors');

app.use(cors());

app.use(bodyParser.json());

app.use('/api', apiRouter);

app.use('/*', (req, res, next) => next({ status: 404, msg: 'no page found' }));

// error handling

app.use(handle404);
app.use(handle400);
app.use(handle422);
app.use(handle500);


module.exports = app;
