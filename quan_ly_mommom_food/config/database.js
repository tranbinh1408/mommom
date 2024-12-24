const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'mysql.railway.internal',
  port: 3306,
  user: 'root',
  password: 'oWNPK1SixOPZyqDKNM1OrYXbFYWsGRXb',
  database: 'railway'
});

module.exports = db;   