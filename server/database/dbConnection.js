const pgp = require('pg-promise')();
const db = pgp({
  host: 'localhost',
  port: 5432,
  database: 'darkstore',
  user: 'darkstoreroot',
  password: 'test'
});

module.exports = db;
