
exports.up = function(knex, Promise) {
  return knex.schema.createTable('articles', articles => {
      articles.increments('article_id').primary().unsigned();
      articles.string('title').notNullable();
      articles.text('body').notNullable();
      articles.integer('votes').defaultTo(0);
      articles.string('topic').references('topics.slug');
      articles.integer('user_id').references('users.user_id').unsigned();
      articles.date('created_at').defaultTo(knex.fn.now(6));
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('articles');
};
