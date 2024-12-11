const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'localhost',
  port: 3308,
  user: 'mommom_food',
  password: '1',
  database: 'mommom_food'
});

// Test connection
db.getConnection()
  .then(connection => {
    console.log('Database connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('Error connecting to the database:', err);
  });

module.exports = db;