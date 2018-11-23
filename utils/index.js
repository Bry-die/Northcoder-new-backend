
exports.checkParam = (req, res, next, endpoint) => {
  if (/^\d+$/.test(endpoint)) next();
  else next({ code: '22P02' });
};

exports.handle405 = (req, res, next) => {
  res.status(405).send({ msg: 'method not allowed...' });
};

exports.apiObj = {
  routes: {
    '/api/topics': {
      methods: ['GET', 'POST'],
      '/api/topics/:slug/atricle_id': {
        methods: ['GET', 'POST'],
      },
    },
    '/api/articles': {
      methods: ['GET'],
      '/api/articles/:article_id': {
        methods: ['GET', 'PATCH', 'DELETE'],
        '/api/articles/:article_id/comments': {
          methods: ['GET', 'POST'],
        },
      },
    },
    '/api/comments': {
      '/api/comments/:comment_id': {
        methods: ['PATCH', 'DELETE'],
      },
    },
    '/api/users': {
      methods: ['GET'],
      '/api/users/user_id': {
        methods: ['GET'],
      },
    },
  },
};
