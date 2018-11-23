const {
  articleData, userData, commentData, topicData,
} = require('../db/data/');
const { createRef, formatArticle, formatComments } = require('../db/utils');


exports.seed = function (knex, Promise) {
  return knex('topics').insert(topicData)
    .then(() => knex('users').insert(userData).returning('*'))
    .then((usersRows) => {
      const usersRef = createRef(usersRows, 'username', 'user_id');
      const formattedArticles = formatArticle(articleData, usersRef);
      return Promise.all([knex('articles').insert(formattedArticles).returning('*'), usersRows]);
    })
    .then(([articleRows, usersRows]) => {
      const articleRef = createRef(articleRows, 'title', 'article_id');
      const usersRef = createRef(usersRows, 'username', 'user_id');
      const format = formatComments(commentData, articleRef, usersRef);
      return knex('comments').insert(format);
    });
};
