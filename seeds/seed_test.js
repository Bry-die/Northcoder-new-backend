const { articleData, userData, commentData, topicData } = require('../db/data/test-data');
const { createRef, formatArticle, formatComments } = require('../utils');


exports.seed = function(knex, Promise) {
  return knex('topics').insert(topicData)
    .then(() => {
      return knex('users').insert(userData).returning('*');
    })
    .then(usersRows => {
      const usersRef = createRef(usersRows, 'username', 'user_id');
      const formattedArticles = formatArticle(articleData, usersRef);
      return knex('articles').insert(formattedArticles).returning('*');
    })
    .then(articleRows => {
      const articleRef = createRef(articleRows, 'title', 'article_id');
      let format = formatComments(commentData, articleRef);
      return knex('comments').insert(format);
    });
};
