import mqtt from 'mqtt';

async function startListening(aquarium){
    // Create a new MQTT client using the broker information from the aquarium object
    const client = mqtt.connect({
        host: aquarium.smartDevice.broker.host,
        port: aquarium.smartDevice.broker.port,
        username: aquarium.smartDevice.broker.accessUsername,
        password: aquarium.smartDevice.broker.accessPassword,
        protocol: aquarium.smartDevice.broker.protocol
    });

    // Subscribe to the appropriate MQTT topics
    client.subscribe(`monitoring/activate`);
    console.log('Subscribed to topic: monitoring/activate');
    const startData = {command: 'start', aquariumId: aquarium._id};
    client.publish(`monitoring/activate`, JSON.stringify(startData));
    console.log('Sent startMessage to topic: monitoring/activate');

    // Store the MQTT client object in the mqttClients map using the aquarium ID as the key
    mqttClients.set(aquarium._id, client);

    // Set up a message handler for the MQTT client
    client.on('message', (topic, message) => {
        // Handle incoming MQTT messages
        if(topic === 'monitoring/activate'){
            if(message.toString() === 'sensor data on'){
                aquarium.active = true;
                client.subscribe(`${aquarium._id}/sensor-data`);
                console.log(`Subscribed to topic: ${aquarium._id}/sensor-data`);
            }
        }

        if(topic === `${aquarium._id}/sensor-data`){
            if(aquarium.active){
                const sensorData = JSON.parse(message.toString());
            }
        }

    });
}