const mqtt = require('mqtt');
var connect = require('../connect/connect');

const {controlAuto} = require('./controlauto');

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
        let mydate = new Date();
        query = "INSERT INTO ValueOfDevice(id_device, value, received_time) Values (?);";
        // valueInsert = [message[0].device_id, message[0].values, mydate];
        valueInsert = message.map(item => [item.device_id, item.values, mydate])
        connect.getConnection((err,connection) => {
            if(err) console.log(err);
            connection.query(query, valueInsert ,(err, result)=> {
              if(err) console.log(err);
            });  
          });  
        
        console.log(message);
        
        // Minh add
        for(let i=0; i < message.length; i++){
          controlAuto(message[i].device_id, message[i].values[0]);
        }
        // end Minh add

      }else if (topic == "Topic/LightD"){
        console.log(topic);
        console.log(message.toString());
      }  
    })

    client.on('connect', ()=>{
        client.subscribe("Topic/Light");  
        client.subscribe("Topic/LightD");
        // client.publish("Topic/LightD",'[{ "device_id": "LightD","values": ["1", "100"]}]');
    });

};

module.exports = listenLight;
