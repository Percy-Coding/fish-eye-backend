import mqtt from 'mqtt';
import { mqttClients } from '../utils/mqttVariables.js';

export async function startListening(aquarium, handleSensorDataCallback) {
    // Create a new MQTT client using the broker information from the aquarium object
    const client = mqtt.connect({
        host: aquarium.smartDevice.broker.host,
        port: aquarium.smartDevice.broker.port,
        username: aquarium.smartDevice.broker.accessUserName,
        password: aquarium.smartDevice.broker.accessPassword,
        protocol: aquarium.smartDevice.broker.protocol
    });
    console.log(aquarium.active);
    if(!aquarium.active){
        // Subscribe to the appropriate MQTT topics
        client.subscribe(`monitoring/activate`);
        console.log('Subscribed to topic: monitoring/activate');
        const startData = {command: 'start', aquariumId: aquarium._id};
        client.publish(`monitoring/activate`, JSON.stringify(startData));
        console.log('Sent startMessage to topic: monitoring/activate');
    }else{
        client.subscribe(`${aquarium._id}/sensor-data`);
        console.log(`Subscribed to topic: ${aquarium._id}/sensor-data`);
    }
    

    // Store the MQTT client object in the mqttClients map using the aquarium ID as the key

    // Set up a message handler for the MQTT client
    client.on('message', async (topic, message) => {
        // Handle incoming MQTT messages
        if(topic === 'monitoring/activate'){
            if(message.toString() === 'sensor data on'){
                aquarium.active = true;
                await aquarium.save();
                client.subscribe(`${aquarium._id}/sensor-data`);
                console.log(`Subscribed to topic: ${aquarium._id}/sensor-data`);
            }
        }

        if(topic === `${aquarium._id}/sensor-data`){
            if(aquarium.active){
                const sensorData = JSON.parse(message.toString());
                console.log(message.toString());
                handleSensorDataCallback(sensorData);
            }
        }
    });

    mqttClients[aquarium._id] =  client;
}

export async function stopListening(aquarium) {
    if(aquarium.active){
        aquarium.active = false;
        await aquarium.save();
        const client = mqttClients[aquarium._id];
        console.log(`CLIENT NOT ACTIVE FOR aquarium ${aquarium._id}`);
        if(client?.connected){
            client.publish(`monitoring/activate`, 'stop');
            client.unsubscribe('#');
            client.end();
            mqttClients[aquarium._id] = undefined;
            console.log(`CLIENT DISCONNECTED FOR aquarium ${aquarium._id}`);
        }
    }
}