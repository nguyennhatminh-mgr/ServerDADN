
const connect = require('../connect/connect');
const {client} = require('../connect/mqttconfig');

const {TOPIC_LIGHTD} = require('../connect/mqttconfig'); 

const controlAuto = (device_id,value_of_device) => {
    let queryGetLightLevel = `SELECT * FROM LightLevel ORDER BY timeset DESC LIMIT 1`;

    connect.getConnection((err,connection) => {
        if(err) console.log(err);
        connection.query(queryGetLightLevel,(error,rows) => {
            connection.release();
            if(error) console.log(error);
            let light_level = rows[0].value;

            let queryControl = `call lightiot.auto_control(?)`;
            let valueInsert = null; 
            let date = new Date();
            let queryNotification = `select lightiot.Device.id_room,id_user,name
            from lightiot.Device,lightiot.AdminRoom,lightiot.Room
            where lightiot.Device.id = '${device_id}' and lightiot.Device.id_room = lightiot.AdminRoom.id_room and lightiot.AdminRoom.id_room=lightiot.Room.id`;

            // if(value_of_device > light_level){
            //     valueInsert = [device_id,0,date];
            // }
            // else{
            //     let light = 255 - Math.round(value_of_device / 4);
            //     valueInsert = [device_id,light,date];
            // }

            connect.getConnection((err,connection) => {
                if (err) console.log(err);
                connection.query(queryNotification,(error,rows) => {
                    connection.release();
                    if(error) console.log(error);
                    // console.log("CALL Success");
                    // let query_getListDevice = `select id,type,Device.id_room
                    // from (SELECT id_room FROM lightiot.Device where id='${device_id}'  and type='sensor') as temp, lightiot.Device
                    // where temp.id_room = Device.id_room and type='light'`;

                    let queryInsertNotification = `Insert into notification (id_user,content,status,createdAt) values (?)`;
                    
                    let room_name = rows[0].name;
                    let id_user = rows[0].id_user;
                    let contentNotification = "";
                    if(value_of_device < light_level){
                        contentNotification = `Light intensity of room ${room_name} is lower than threshold`;
                        let date = new Date();
                        let valueInsert = [id_user,contentNotification,0,date];
                        connect.getConnection((err,connection) => {
                            if(err) console.log(err);
                            connection.query(queryInsertNotification,[valueInsert],(error,rows) => {
                                connection.release();
                                if (error) console.log(error);
                                console.log("Add notification successfully, file controlauto.js");
                            });
                        });
                    }
                    // connect.getConnection((err,connection) => {
                    //     if (err) console.log(err);
                    //     connection.query(query_getListDevice,(error,rows) => {
                    //         connection.release();
                    //         if(error) console.log(error);
                    //         let listDevice = rows;
                    //         // console.log("Here");
                    //         // console.log(listDevice); 
                    //         let message = [];
                    //         for(let i = 0; i < listDevice.length; i++){
                    //             message.push({device_id: listDevice[i].id, values: ["1",valueInsert[1].toString()]});

                    //             let query = `update lightiot.Device set value = ${valueInsert[1]} where id = '${listDevice[i].id}'`;
                    //             connect.getConnection((err,connection) => {
                    //             if(err) console.log(err);
                    //                 connection.query(query,(error,rows) => {
                    //                     connection.release();
                    //                     if(error) console.log(error);
                    //                 });
                    //             })
                    //         }
                    //         if(message.length > 0){
                    //             message = JSON.stringify(message);
                    //             client.publish(TOPIC_LIGHTD,message);
                    //         }
                    //     });
                    // }); 
                });
            });
            
        });
    })

    
}

module.exports = {
    controlAuto
}