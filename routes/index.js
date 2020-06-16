var express = require('express');
var router = express.Router();
var mqtt = require('mqtt');
var {createUniqueId} = require('../utilities/createId');

const connect = require('../connect/connect');


const topicGetData = "TOPIC_GET_DATA";
const topicControlDevice = "TOPIC_CONTROL_DEVICE";
const topicOffical = "Topic/Light";

// Gia su co list device
var listDevices = [
  {
    id_device: "id1",
    values: ["1","300"],
    type: "light"
  },
  {
    id_device: "id2",
    values: ["0","400"],
    type: "light"
  },
  {
    id_device: "id3",
    values: ["200"],
    type: "sensor"
  },
  {
    id_device: "id4",
    values: ["500"],
    type: "sensor"
  },
];

// var clientGetData = mqtt.connect('mqtt://broker.mqttdashboard.com');
var clientGetData = mqtt.connect('mqtt://52.240.52.68:1883');
var clientControlDevice = mqtt.connect('mqtt://broker.mqttdashboard.com');

// clientGetData.on('message', (topic,message) => {
//   var value_mes = JSON.parse( message.toString());
//   console.log(value_mes);
//   console.log(topic);
//   let query = `INSERT INTO VALUEOFDEVICE VALUES `;
//   for(let i = 0; i < value_mes.length - 1; i++){
//     const id_value = createUniqueId();
//     let time = new Date();
//     let received_time = time.getTime();

//     if(value_mes[i].values.length>1){
//       query += `('${id_value}','${value_mes[i].id_device}','${value_mes[i].values[0]}-${value_mes[i].values[1]}',${received_time}),`;
//     }else{
//       query += `('${id_value}','${value_mes[i].id_device}','${value_mes[i].values[0]}',${received_time}),`;
//     }
//   }
//   const lastDevice = value_mes.length - 1;
//   const id_value = createUniqueId();
//   let time = new Date();
//   let received_time = time.getTime();

//   if(value_mes[lastDevice].values.length>1){
//     query += `('${id_value}','${value_mes[lastDevice].id_device}','${value_mes[lastDevice].values[0]}-${value_mes[lastDevice].values[1]}',${received_time});`;
//   }else{
//     query += `('${id_value}','${value_mes[lastDevice].id_device}','${value_mes[lastDevice].values[0]}',${received_time});`;
//   }
//   connect.getConnection((error,connection) => {
//     if(error) throw error;
//     connection.query(query,(err,rows) => {
//       connection.release();
//       if(err) throw err;
//       console.log(rows);
//     });
//   });
//   console.log(query);
// });

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hello Express',listDevices: listDevices});
});

router.post('/testpublish', (req,res,next) => {
  var {id_device1,value1,id_device2,value2} = req.body;
  var result = [];

  value1 = value1.split(',');
  value2 = value2.split(',');

  var device1 = {};
  device1.id_device = id_device1;
  device1.values = value1;

  var device2 = {};
  device2.id_device = id_device2;
  device2.values = value2;

  result.push(device1);
  result.push(device2);

  res.render('index', { title: 'Hello Express',listDevices:listDevices});
});

module.exports = router;

const handleOnControl = (listDevices,device) => {
  for(let i = 0; i < listDevices.length; i++){
    if(listDevices[i].id_device === device.id_device){
      listDevices[i].values = device.values;
    }
  }
}
