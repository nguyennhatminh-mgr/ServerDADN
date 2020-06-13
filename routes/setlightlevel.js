var express = require('express');
var router = express.Router();

//  variable connect is used to connect to database
var connect = require('../connect/connect');

const SET_SUCCESS = 'SET_SUCCESS';

router.get("/setlightlevel/:value",(req,res,next) => {
    let lightlevel = req.params.value;
    let time = new Date();
    time = time.getTime();
    let query = `INSERT INTO lightlevel (value,timeset) VALUES (${lightlevel},${time})`;

    connect.getConnection((err,connection) => {
        if(err) console.log(err);
        connection.query(query,(err,rows) => {
            connection.release();
            if(err) console.log(err);
            res.send(SET_SUCCESS);
        });
    });
}); 
// Your code here

router.get("/currentlevel",(req,res,next) => {
    let query = `SELECT * FROM lightlevel ORDER BY timeset DESC LIMIT 1`;
    connect.getConnection((err,connection) => {
        if(err) console.log(err);
        connection.query(query,(err,rows) => {
            connection.release();
            if(err) console.log(err);
            res.send(rows);
        })
    })
});

module.exports = router;