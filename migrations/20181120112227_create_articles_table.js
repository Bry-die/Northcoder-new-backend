
exports.up = function(knex, Promise) {
  console.log('creating table articles...');
  return knex.schema.createTable('articles', articles => {
      articles.increments('article_id').primary();
      articles.string('title').notNullable();
      articles.text('body').notNullable();
      articles.integer('votes').defaultTo(0);
      articles.string('topic').references('topics.slug');
      articles.integer('user_id').references('users.user_id').unsigned();
      articles.date('created-at').defaultTo(knex.fn.now(6));
  });
};

exports.down = function(knex, Promise) {
  console.log('dropping table articles...');
  return knex.schema.dropTable('articles');
};
