const mqtt = require('mqtt');
const nodeEmailer = require('nodemailer');
// const client = mqtt.connect('tcp://13.76.250.158:1883',
//     {
//       username:"BKvm2",
//       password:"Hcmut_CSE_2020"
//     }
// );
// const client = mqtt.connect('tcp://52.187.125.59:1883',
//     {
//       username:"BKvm",
//       password:"Hcmut_CSE_2020"
//     }
// );

const transporter = nodeEmailer.createTransport({
  service : "gmail",
  auth: {
    user: 'dadn2020lightiot@gmail.com',
    pass: 'dadn2020123'
  }
});

// Email for DADN
// dadn2020lightiot@gmail.com
// dadn2020123

const client = mqtt.connect('mqtt://52.240.52.68:1883');

const TOPIC_LIGHTD = "Topic/LightD";

module.exports = {
    client,
    TOPIC_LIGHTD,
    transporter
};