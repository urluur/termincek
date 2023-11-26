const mysql = require('mysql2');

const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE
})

conn.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Database connection established!');
  }
})