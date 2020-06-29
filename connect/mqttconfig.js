const mqtt = require('mqtt');

// const client = mqtt.connect('tcp://13.76.250.158:1883',
//     {
//       username:"BKvm2",
//       password:"Hcmut_CSE_2020"
//     }
// );

const client = mqtt.connect('mqtt://52.240.52.68:1883');

const TOPIC_LIGHTD = "Topic/LightD";

module.exports = {
    client,
    TOPIC_LIGHTD
};