import Aquarium from '../models/aquarium.js';
import {startListening, stopListening} from './mqttSuscriberService.js';

export async function createAquarium(req,res) {
    const aquarium = new Aquarium({
        name: req.body.name,
        owner: req.body.owner,
        smartDevice: req.body.smartDevice
    });

    aquarium.save()
        .then((data) => {
            res.status(201).json({
                message: 'Aquarium created successfully',
                aquarium: data
            })
        })
        .catch((err) => res.json({ message: err }));
}

export async function startDevice(req, res) {
    const { aquariumId } = req.params;
    const aquarium = await Aquarium.findOne({_id: aquariumId}).populate('smartDevice');
    if(aquarium) {
        startListening(aquarium, handleSensorDataCallback);
        res.send(`AQUARIUM WITH ID ${aquarium._id} LISTENING FOR CHANGES`);
    }
}

export async function stopDevice(req, res) {
    const { aquariumId } = req.params;
    const aquarium = await Aquarium.findOne({_id: aquariumId}).populate('smartDevice');
    if(aquarium) {
        stopListening(aquarium);
        res.send(`AQUARIUM WITH ID ${aquarium._id} STOPPED`);
    }
    
}

export async function getAllAquariumsByOwnerId(req, res){
    try{
        const ownerId = req.params.ownerId;
        const aquariums = await Aquarium.find({owner: ownerId})

        if(aquariums.length === 0) 
            return res.status(204).json({empty: `The owner with id ${ownerId} does not exist or has no aquiarums`})
        
        res.status(200).json({aquariums})
    }catch(err){
        res.status(500).json({message: err.message});
    }
}

export async function linkDeviceToAquarium(req, res){
    const { aquariumId, deviceId } = req.params;

    try {
        const updatedAquarium = await Aquarium.findByIdAndUpdate(
        aquariumId,
        { smartDevice: deviceId },
        { new: true } // Return the updated document
        );



        res.status(200).json(updatedAquarium);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

export async function deleteAquariumById(req, res){
    const {aquariumId } = req.params;
    try{
        const result = await Aquarium.deleteOne({_id: aquariumId});
        console.log(result);
        if(result.deletedCount !== 1) return res.status(500).json({message: 'Something went wrong'});
        res.status(200).json({ message: `aquarium with id ${aquariumId} deleted successfully` });
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

async function handleSensorDataCallback(sensorData){
    console.log("SENSOR DATA TYPE: " + typeof sensorData)
    console.log("Temperature: ",sensorData.temperature);
    console.log("pH: ",sensorData.pH);
    console.log("turbidity: ",sensorData.turbidity);
    console.log("tds: ",sensorData.tds);
    
}

function linkDeviceParameters(){

}