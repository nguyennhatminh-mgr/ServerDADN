const mysql = require('mysql');

const pool = mysql.createPool({
    host:"52.240.52.68",
    user:"root",
    password:"dadn2020",
    database:"lightiot" 
});

module.exports = pool;