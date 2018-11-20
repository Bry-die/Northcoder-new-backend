
exports.up = function(knex, Promise) {
  console.log('creating table comments...');
  return knex.schema.createTable('comments', comments => {
      comments.increments('comment_id').primary();
      comments.integer('user_id').references('users.user_id');
      comments.integer('article_id').references('articles.article_id');
      comments.integer('votes').defaultTo(0);
      comments.date('created_at').defaultTo(knex.fn.now(6));
      comments.text('body').notNullable();
  });
};

exports.down = function(knex, Promise) {
  console.log('dropping table comments...');
  return knex.schema.dropTable('comments');
};
