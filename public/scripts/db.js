const mysql = require('mysql2');


const db = mysql.createConnection(
    {
      host: '127.0.0.1',
      user: 'root',
      password: 'password1',
      database: 'business_db'
    },
    console.log(`Connected to the business_db database.`)
);
  
module.exports = db;