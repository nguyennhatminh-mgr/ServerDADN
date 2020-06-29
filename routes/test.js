const mqtt = require('mqtt');

const topic_gps = "Topic/GPS";
const topic_temp_humi = "Topic/TempHumi";
const topic_light = "Topic/Light";
const topic_lightd = "Topic/LightD";
const topic_speaker = "Topic/Speaker";

const subscribeLightD = () => {

    var clientOfficial = mqtt.connect('tcp://13.76.250.158:1883',{username: "BKvm2", password: "Hcmut_CSE_2020"});
    
    clientOfficial.subscribe(topic_light);  
    
    // clientOfficial.on("message",(topic,message) => {
    //     console.log(topic);
    //     console.log(message.toString());
    // });      

    clientOfficial.on('connect',() => {  
        // clientOfficial.publish(topic_light,'[{ "device_id": "Light","values": ["800"]},{ "device_id": "Light12","values": ["600"]}]');
    });  
    // clientOfficial.subscribe(topic_speaker);    
    
}  

module.exports = {
    subscribeLightD
}