var express = require('express');
const mqtt = require('mqtt');

var router = express.Router();

const {ID_ADMIN} = require('../utilities/constant');

//  variable connect is used to connect to database
var connect = require('../connect/connect');

const TOPIC_LIGHTD = "Topic/LightD";
let client = mqtt.connect('tcp://13.76.250.158:1883',
    {
        username:"BKvm2",
        password:"Hcmut_CSE_2020"
    }
);

router.get("/listroomcontrol/:id",(req,res,next) => {
    const id = req.params.id;
    let query = "";
    if(id === ID_ADMIN){
        query = `SELECT id as id_room,name FROM Room`;
    }
    else{
        query = `SELECT id_user,id_room,name 
        FROM AdminRoom,Room
        where id_user='${id}' and id_room=id`;
    }

    connect.getConnection((err,connection) => {
        if(err) console.log(err);
        connection.query(query,(error,rows) => {
            connection.release();
            if(error) console.log(error);
            res.send(rows);
        });
    });
}); 

router.get("/listlight/:id_room",(req,res,next) => {
    const id_room = req.params.id_room;
    // let query = `SELECT Device.id,id_room,id_device,value,received_time
    //         FROM lightiot.Device,lightiot.ValueOfDevice
    //         where id_room='${id_room}' and type='light' and Device.id=id_device
    //         order by received_time desc
    //         limit 1`;
    let query = `SELECT * FROM Device where id_room='${id_room}' and type='light'`;

    connect.getConnection((err,connection) => {
        if(err) console.log(err);
        connection.query(query,(error,rows) => {
            connection.release(); 
            if(error) console.log(error); 
            res.send(rows);
        }); 
    });
});

router.get("/getlight/:id_light",(req,res,next) => {
    const id_light = req.params.id_light;
    let query = `SELECT Device.id,id_room,value,received_time
        FROM lightiot.Device,lightiot.ValueOfDevice 
        where Device.id='${id_light}' and type='light' and Device.id=ValueOfDevice.id_device
        order by received_time desc
        limit 1;`;

    connect.getConnection((err,connection) => {
        if(err) console.log(err);
        connection.query(query,(error,rows) => {
            connection.release(); 
            if(error) console.log(error); 
            res.send(rows);
        }); 
    });
});

router.post("/controllight",(req,res,next) => {
    let {device_id,value} = req.body;
    let status = 0;
    if (value > 0){
        status = 1;
    }
    let message = [{device_id: device_id, values: [status.toString(), value.toString()] }];
    message = JSON.stringify(message);

    client.publish(TOPIC_LIGHTD,message);

    let date = new Date();
    let query = `INSERT INTO ValueOfDevice(id_device, value, received_time) Values (?)`;
    let valueInsert = [device_id,value,date];

    connect.getConnection((error,connection) => {
        if(error) console.log(error);

        connection.query(query,[valueInsert],(err,rows) => {
            connection.release();
            if(err) console.log(err);
            else{
                res.send("SUCCESS");
            }
        })
    })

});

module.exports = router;