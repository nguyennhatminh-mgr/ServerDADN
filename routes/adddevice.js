var express = require('express');
var router = express.Router();

//  variable connect is used to connect to database
var connect = require('../connect/connect');

router.post("/addDevice", (req,res) => {
    let myDate = new Date();
    var valueInsert = [req.body.id, req.body.type ,req.body.id_room, myDate];

    
    query = "call lightiot.insertDevice(?)";
    console.log(req.body)
    connect.getConnection((err,connection) => {
        if(err) {
            res.send("fail");
        };
        connection.query(query,[valueInsert] ,(err,rows) => {
            console.log(err);
            if(err) res.send("fail");
            else res.send("ok");
        });
      });
}); 

router.post("/addRoom", (req, res)=>{
    
    var valueInsert = [req.body.id, req.body.name];

    query = "INSERT INTO Room(id,name) VALUES (?);";
    //console.log(valueInsert);
    connect.getConnection((err,connection) => {
        if(err) res.send("fail");
        connection.query(query, [valueInsert] ,(err,rows) => {
            //connection.release();
            if(err) res.send(err);
            res.send("ok");
        });
      });
});

module.exports = router;