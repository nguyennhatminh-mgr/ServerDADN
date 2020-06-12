const mqtt = require('mqtt');
var connect = require('../connect/connect');

function listenLight() {
    // var client = mqtt.connect('mqtt://52.240.52.68:1883');
    var client = mqtt.connect('tcp://13.76.250.158:1883',
    {
      username:"BKvm2",
      password:"Hcmut_CSE_2020"
    }
    );
    client.on('message' , (topic, message)=>{
      if(topic == "Topic/Light"){
        message = JSON.parse(message.toString());
        mydate = new Date();
        query = "INSERT INTO ValueOfDevice(id_device, value, received_time) Values (?);";
        valueInsert = [message[0].device_id, message[0].values, mydate];
        connect.getConnection((err,connection) => {
            if(err) console.log(err);
            connection.query(query, [valueInsert] ,(err, result)=> {
              if(err) console.log(err);
            });
          });
      }else if (topic == "Light"){
        console.log(topic);
      }
    })

    client.on('connect', ()=>{
        client.subscribe("Topic/Light"); 
    })
};

module.exports = listenLight;
