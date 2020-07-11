
const connect = require('../connect/connect');
const {client,transporter} = require('../connect/mqttconfig');

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

            connect.getConnection((err,connection) => {
                if (err) console.log(err);
                connection.query(queryNotification,(error,rows) => {
                    connection.release();
                    if(error) console.log(error);
                    
                    let queryInsertNotification = `Insert into notification (id_user,content,status,createdAt,id_room) values (?)`;
                    
                    let room_name = rows[0].name;
                    let id_user = rows[0].id_user;
                    let id_room = rows[0].id_room;
                    let contentNotification = "";
                    if(value_of_device < light_level){
                        contentNotification = `Light intensity of room ${room_name} is ${value_of_device}, which is lower than threshold`;
                        let date = new Date();
                        let valueInsert = [id_user,contentNotification,0,date,id_room];
                        connect.getConnection((err,connection) => {
                            if(err) console.log(err);
                            connection.query(queryInsertNotification,[valueInsert],(error,rows) => {
                                connection.release();
                                if (error) console.log(error);
                                console.log("Add notification successfully, file controlauto.js");
                            });
                        });

                        // Send email
                        let queryGetUserInfo = `SELECT * FROM myuser WHERE id = '${id_user}'`;
                        connect.getConnection((err,connection) => {
                            if(err) console.log(err);
                            connection.query(queryGetUserInfo,(error,rows) => {
                                connection.release();
                                if (error) console.log(error);
                                else{
let contentEmail = `
    Dear ${rows[0].realname},\n
    ${contentNotification}.\n
    Please adjust to be more suitable.\n
    Best regards,
    DAND2020
`;
                                    const mailOptions = {
                                        from : "dadn2020lightiot@gmail.com",
                                        to : rows[0].username,
                                        subject: "NOTIFICATION ABOUT THRESHOLD OF LIGHT LEVEL",
                                        text: contentEmail
                                    };
            
                                    transporter.sendMail(mailOptions,(err,info) => {
                                        if(err){
                                            console.log(err);
                                        }
                                        else{
                                            console.log("Send email : " + info.response);
                                        }
                                    });
                                }
                            });
                        });
                    }
                });
            });
            
        });
    })

    
}

module.exports = {
    controlAuto
}