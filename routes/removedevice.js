var express = require('express');
var router = express.Router();

//  variable connect is used to connect to database
var connect = require('../connect/connect');

router.get("/listDevice/:id_room",(req,res,next) => {
    const id_room = req.params.id_room;
    let query = `SELECT * FROM Device where id_room='${id_room}'`;

    connect.getConnection((err,connection) => {
        if(err) console.log(err);
        connection.query(query,(error,rows) => {
            connection.release(); 
            if(error) console.log(error); 
            res.send(rows);
        }); 
    });
});

router.delete("/removeDevice/:id_device",(req,res)=> {
    var query = `call lightiot.removeDevice("${req.params.id_device}");`;
    connect.getConnection((err,connection) => {
        if(err) {
            res.send("fail");
        };
        connection.query(query,(err,rows) => {
            connection.release();
            if(err) res.send("fail");
            else res.send(rows);
        });
      });
}); 


router.delete("/removeRoom/:id_room",(req,res)=> {
    var query = `call lightiot.removeRoom("${req.params.id_room}");`;
    connect.getConnection((err,connection) => {
        if(err) {
            res.send("fail");
        };
        connection.query(query,(err,rows) => {
            connection.release();
            
            if(err) res.send("fail");
            else res.send(rows);
        });
      });
}); 

module.exports = router;