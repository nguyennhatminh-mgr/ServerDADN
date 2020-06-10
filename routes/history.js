var express = require('express');
var router = express.Router();

//  variable connect is used to connect to database
var connect = require('../connect/connect');

router.get("/viewHistory",(req,res,next) => {
    // Your code here
    query = "SELECT Room.id,Room.name,myuser.realname as owner FROM Room JOIN AdminRoom ON Room.id = AdminRoom.id_room JOIN myuser ON AdminRoom.id_user = myuser.id";
    //console.log(valueInsert);
    connect.getConnection((err,connection) => {
        if(err) res.send("fail");
        connection.query(query,(err,result) => {
            //connection.release();
            if(err) res.send(err);
            //res.send("ok");
            res.send(result)
        });
    });
}); 


router.post("/viewSensorHistory",(req,res,next) => {
    // Your code here;
    const time = req.body.time;
    const id_room = req.body.id_room;

    query = `SELECT id_device,value FROM ValueOfDevice INNER JOIN  Device ON Device.type = 'sensor' AND Device.id = ValueOfDevice.id_device AND Device.id_room = "${id_room}" Where HOUR(TIMEDIFF("${time}",ValueOfDevice.received_time)) < 1;`;
    connect.getConnection((err,connection) => {
        if(err) res.send("fail");
        connection.query(query,(err,result)=> {
            console.log(err);
            if(err) res.send(err);
            res.send(result);
        });
    });
});

router.post("/viewLightHistory",(req,res,next) => {
    // Your code here;
    const time = req.body.time;
    const id_room = req.body.id_room;
    query = `SELECT id_device,value FROM ValueOfDevice INNER JOIN Device ON Device.type = 'light' AND Device.id = ValueOfDevice.id_device AND Device.id_room = "${id_room}" Where HOUR(TIMEDIFF("${time}",ValueOfDevice.received_time)) < 1;`;
    console.log(query)
    connect.getConnection((err,connection) => {
        if(err) res.send("fail");
        connection.query(query,(err,result)=> {
            console.log(err);
            if(err) res.send(err);
            res.send(result);
        });
    });
}); 
// Your code here

module.exports = router;