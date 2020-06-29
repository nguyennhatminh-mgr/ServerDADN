
var connect = require('../connect/connect');

const {controlAuto} = require('./controlauto');
const {client} = require('../connect/mqttconfig');

function listenLight() {
    // var client = mqtt.connect('mqtt://52.240.52.68:1883');
    // var client = mqtt.connect('tcp://13.76.250.158:1883',
    // {
    //   username:"BKvm2",
    //   password:"Hcmut_CSE_2020"
    // }
    // );
    client.on('message' , (topic, message)=>{
      if(topic == "Topic/Light"){
        try{
          message = JSON.parse(message.toString());

          //validate data before insert to database
          for(let i = 0; i< message.length;i++){
            try{
              if(message[i].values[0] > 1023 || message[i].values[0] < 0) message.splice(i,1);
            }catch(err){
              message.splice(i,1);
            }finally{
              if(message.length < 1 ) return;
            }
          }
        
          mydate = new Date();


          query = `INSERT INTO ValueOfDevice(id_device, value, received_time) Values ?;`;

          var valueInsert = message.map(item=>[item.device_id, item.values[0], mydate]);

          connect.getConnection((err,connection) => {
            if(err) console.log(err);
            connection.query(query, [valueInsert] ,(err, result)=> {
              connection.release();
              if(err) console.log(err);
               // Minh add
              for(let i=0; i < message.length; i++){
                controlAuto(message[i].device_id, message[i].values[0]);
              }
              insertValueToDevice(message);
              // end Minh add
            });  
          });  
          
          console.log(message);
          
        }
        catch (err){
          console.log(err);
        }

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

const insertValueToDevice = (listDevice) => {
  for(let i = 0; i < listDevice.length; i++){
    let query = `update lightiot.Device set value = ${listDevice[i].values[0]} where id = '${listDevice[i].device_id}'`;
    connect.getConnection((err,connection) => {
      if(err) console.log(err);
      connection.query(query,(error,rows) => {
        connection.release();
        if(error) console.log(error);
      });
    })
  }
}

module.exports = listenLight;
