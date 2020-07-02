var express = require('express');

var router = express.Router();

const {ID_ADMIN} = require('../utilities/constant');

//  variable connect is used to connect to database
var connect = require('../connect/connect');
const {client} = require('../connect/mqttconfig');

const {TOPIC_LIGHTD} = require('../connect/mqttconfig');
const { route } = require('./viewroom');

router.get("/listroomcontrol/:id",(req,res,next) => {
    const id = req.params.id;
    let query = "";
    if(id === ID_ADMIN){
        query = `SELECT id as id_room, name FROM Room`;
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
    let query = `SELECT Device.id,id_room,ValueOfDevice.value,received_time
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
                let query = `update lightiot.Device set value = ${value} where id = '${device_id}'`;
                connect.getConnection((err,connection) => {
                    if(err) console.log(err);
                    connection.query(query,(error,rows) => {
                        connection.release();
                        if(error) console.log(error);
                        res.send("SUCCESS");
                    });
                })
            }
        })
    })

});

router.get('/notification/:id_user',(req,res,next) => {
    let id_user = req.params.id_user;
    let query = "";
    if (id_user == ID_ADMIN){
        query = `SELECT lightiot.notification.id as id_notification,id_user,content,status,createdAt,id_room,name
        FROM lightiot.notification,lightiot.Room
        where lightiot.notification.id_room = lightiot.Room.id
        order by createdAt desc
        LIMIT 5`;
    }
    else{
        query = `SELECT lightiot.notification.id as id_notification,id_user,content,status,createdAt,id_room,name
        FROM lightiot.notification,lightiot.Room
        where id_user='${id_user}' and lightiot.notification.id_room = lightiot.Room.id
        order by createdAt desc
        LIMIT 5`;
    }
    connect.getConnection((err,connection) => {
        if(err) console.log(err);
        connection.query(query,(error,rows) => {
            connection.release();
            if(error) console.log(error);
            res.send(rows);
        });
    })
});

router.get('/allnotification/:id_user',(req,res,next) => {
    let id_user = req.params.id_user;
    let query = "";
    if (id_user == ID_ADMIN){
        query = `SELECT lightiot.notification.id as id_notification,id_user,content,status,createdAt,id_room,name
        FROM lightiot.notification,lightiot.Room
        where lightiot.notification.id_room = lightiot.Room.id
        order by createdAt desc`;
    }
    else{
        query = `SELECT lightiot.notification.id as id_notification,id_user,content,status,createdAt,id_room,name
        FROM lightiot.notification,lightiot.Room
        where id_user='${id_user}' and lightiot.notification.id_room = lightiot.Room.id
        order by createdAt desc`;
    }
    connect.getConnection((err,connection) => {
        if(err) console.log(err);
        connection.query(query,(error,rows) => {
            connection.release();
            if(error) console.log(error);
            res.send(rows);
        });
    })
});

router.get("/updatestatusnotification/:id",(req,res,next) => {
    let id = req.params.id;
    let query = `UPDATE lightiot.notification set status=1 where id=${id}`;
    connect.getConnection((err,connection) => {
        if(err) console.log(err);
        connection.query(query,(error,rows) => {
            connection.release();
            if(error) console.log(error);
            res.send("SUCCESS");
        });
    })
});

module.exports = router;