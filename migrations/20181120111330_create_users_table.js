
exports.up = function(knex, Promise) {
  console.log('creating table users...');
  return knex.schema.createTable('users', users => {
      users.increments('user_id').primary();
      users.string('username').notNullable();
      users.string('avatar_url');
      users.string('name').notNullable();
  });
};

exports.down = function(knex, Promise) {
  console.log('dropping table users...');
  return knex.schema.dropTable('users');
};
