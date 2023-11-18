import mqtt from 'mqtt';
import { mqttClients } from '../utils/mqttVariables.js';

export async function startListening(aquarium, handleSensorDataCallback) {
    // Create a new MQTT client using the broker information from the aquarium object
    let client;
    if(!mqttClients[aquarium._id]){
        client = mqtt.connect({
            host: aquarium.smartDevice.broker.host,
            port: aquarium.smartDevice.broker.port,
            username: aquarium.smartDevice.broker.accessUserName,
            password: aquarium.smartDevice.broker.accessPassword,
            protocol: aquarium.smartDevice.broker.protocol
        });

        mqttClients[aquarium._id] = client;
        const topicDeviceId = aquarium.smartDevice._id;

        console.log(`Aquarium Active Status: ${aquarium.active}`);

        if(!aquarium.active){
            // Subscribe to the appropriate MQTT topics
            console.log(`Subscribed to topic: ${topicDeviceId}/monitoring`);
            client.subscribe(`${topicDeviceId}/monitoring`);
            console.log(`Sent startMessage to topic: ${topicDeviceId}/monitoring`);
            client.publish(`${topicDeviceId}/monitoring`,'start');
        }else{
            client.publish(`${topicDeviceId}/monitoring`,'start');
            client.subscribe(`${topicDeviceId}/sensor-data`);
            console.log(`Subscribed to topic: ${topicDeviceId}/sensor-data`);
        }
        

        // Store the MQTT client object in the mqttClients map using the aquarium ID as the key

        // Set up a message handler for the MQTT client
        client.on('message', async (topic, message) => {
            // Handle incoming MQTT messages
            if(topic === `${topicDeviceId}/monitoring`){
                if(message.toString() === 'sensor data on' && !aquarium.active){
                    aquarium.active = true;
                    await aquarium.save();
                    client.subscribe(`${topicDeviceId}/sensor-data`);
                    console.log(`Subscribed to topic: ${topicDeviceId}/sensor-data`);
                }
            }

            if(topic === `${topicDeviceId}/sensor-data`){
                if(aquarium.active){
                    const sensorData = JSON.parse(message.toString());
                    console.log(message.toString());
                    handleSensorDataCallback(aquarium, sensorData);
                }
            }
        });
    }
}

export async function stopListening(aquarium) {
    if(aquarium.active){
        aquarium.active = false;
        await aquarium.save();
        const client = mqttClients[aquarium._id];
        console.log(`CLIENT NOT ACTIVE FOR aquarium ${aquarium._id}`);
        if(client?.connected){
            client.publish(`${aquarium.smartDevice._id}/monitoring`, 'stop');
            client.unsubscribe('#');
            client.end();
            mqttClients[aquarium._id] = undefined;
            console.log(`CLIENT DISCONNECTED FOR aquarium ${aquarium._id}`);
        }
    }
}