const mqtt = require('mqtt');

const connect = require('../connect/connect');

var client = mqtt.connect('tcp://13.76.250.158:1883',
    {
      username:"BKvm2",
      password:"Hcmut_CSE_2020"
    }
);

const TOPIC = 'Topic/LightD';

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

            if(value_of_device > light_level){
                valueInsert = [device_id,0,date]
            }
            else{
                let light = 255 - Math.round(value_of_device / 4);
                valueInsert = [device_id,light,date];
            }

            connect.getConnection((err,connection) => {
                if (err) console.log(err);
                connection.query(queryControl,[valueInsert],(error,rows) => {
                    connection.release();
                    if(error) console.log(error);
                    // console.log("CALL Success");
                    let query_getListDevice = `select id,type,Device.id_room
                    from (SELECT id_room FROM lightiot.Device where id='${device_id}'  and type='sensor') as temp, lightiot.Device
                    where temp.id_room = Device.id_room and type='light'`;
        
                    connect.getConnection((err,connection) => {
                        if (err) console.log(err);
                        connection.query(query_getListDevice,(error,rows) => {
                            connection.release();
                            if(error) console.log(error);
                            let listDevice = rows;
                            // console.log("Here");
                            // console.log(listDevice); 
                            let message = [];
                            for(let i = 0; i < listDevice.length; i++){
                                message.push({device_id: listDevice[i].id, values: ["1",valueInsert[1].toString()]});
                            }
                            if(message.length > 0){
                                message = JSON.stringify(message);
                                client.publish(TOPIC,message);
                            }
                        });
                    }); 
                });
            });
            
        });
    })

    
}

module.exports = {
    controlAuto
}