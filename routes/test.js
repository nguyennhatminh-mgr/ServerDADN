const mqtt = require('mqtt');

const topic_gps = "Topic/GPS";
const topic_temp_humi = "Topic/TempHumi";
const topic_light = "Topic/Light";
const topic_lightd = "Topic/LightD";

const subscribeLightD = () => {

    var clientOfficial = mqtt.connect('tcp://13.76.250.158:1883',{username: "BKvm2", password: "Hcmut_CSE_2020"});
    
    clientOfficial.subscribe(topic_lightd);
    
    clientOfficial.on("message",(topic,message) => {
        console.log(topic);
        console.log(message.toString());
    });
}

module.exports = {
    subscribeLightD
}