var express = require('express');
var router = express.Router();
const adminID = require('../utilities/constant');

//  variable connect is used to connect to database
var connect = require('../connect/connect');

router.get("/viewHistory/:id_user",(req,res) => {
    // Your code here
    var query = "";
    if(req.params.id_user == adminID.ID_ADMIN) query = `SELECT Room.id,Room.name,myuser.realname as owner FROM Room JOIN AdminRoom ON Room.id = AdminRoom.id_room JOIN myuser ON AdminRoom.id_user = myuser.id;`;
    else query = `SELECT Room.id,Room.name,myuser.realname as owner FROM Room JOIN AdminRoom ON Room.id = AdminRoom.id_room JOIN myuser ON AdminRoom.id_user = myuser.id where myuser.id="${req.params.id_user}";`;
    // console.log(query);
    connect.getConnection((err,connection) => {
        if(err) {res.send("fail");
        console.log("connect fail");
    }
        console.log("ok");
        connection.query(query,(err,result) => {
            //connection.release();
            console.log(err)
            if(err) res.send(err);
            //res.send("ok");
            res.send(result);
        });
    });
}); 


router.get("/viewSensorHistory/:id_room",(req,res) => {
    var query = `Select * from Device where id_room="${req.params.id_room}" AND type="sensor";`;
    connect.getConnection((err,connection) => {
        if(err) {
            res.send("fail");
        };
        connection.query(query, (err,rows) => {
            if(err) res.send("fail");
            else res.send(rows);
        });
      });
});

router.get("/viewLightHistory/:id_room",(req,res) => {
    var query = `Select * from Device where id_room="${req.params.id_room}" AND type="light";`;
    connect.getConnection((err,connection) => {
        if(err) {
            res.send("fail");
        };
        connection.query(query, (err,rows) => {
            if(err) res.send("fail");
            else res.send(rows);
        });
      });
}); 
// Your code here
router.get("/getDataHistory/:id_device/:time",(req,res)=>{
    id_device = req.params.id_device;
    time = req.params.time;
    query = `Select value, received_time as time from ValueOfDevice where id_device="`
     + `${id_device}" AND (received_time between "${time}`
     +` 00:00:00" AND `
     +`"${time}`+` 23:59:59")`
     +` order by received_time desc limit 5;`;
    connect.getConnection((err,connection) => {
        if(err) {
            res.send("connect fail");
        };
        connection.query(query, (err,rows) => {
            if(err) res.send("query fail");
            else res.send(rows);
        });
      });
})

module.exports = router;