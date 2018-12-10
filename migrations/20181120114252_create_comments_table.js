
exports.up = function (knex, Promise) {
  return knex.schema.createTable('comments', (comments) => {
    comments.increments('comment_id').primary().unsigned();
    comments.integer('user_id').references('users.user_id').notNullable();
    comments.integer('article_id').references('articles.article_id').onDelete('CASCADE');
    comments.integer('votes').defaultTo(0);
    comments.date('created_at').defaultTo(knex.fn.now(6));
    comments.text('body').notNullable();
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('comments');
};
