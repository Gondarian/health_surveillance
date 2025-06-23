const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',  // MAMP default
  database: process.env.DB_NAME || 'health_db',
  port: process.env.DB_PORT || 5000             // MAMP default MySQL port
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    return;
  }
  console.log('✅ MySQL connected to MAMP server');
});

module.exports = connection;
