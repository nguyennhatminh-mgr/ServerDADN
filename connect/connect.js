const mysql = require('mysql');

const pool = mysql.createPool({
    host:"localhost",
    user:"phpmyadmin",
    password:"Hoanglongle2402@",
    database:"lightiot"
});

module.exports = pool;