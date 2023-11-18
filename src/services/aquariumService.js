import Aquarium from '../models/aquarium.js';
import {startListening, stopListening} from './mqttSuscriberService.js';

export async function createAquarium(req,res) {
    try{
        const aquarium = new Aquarium({
            name: req.body.name,
            owner: req.body.owner,
            smartDevice: req.body.smartDevice
        });
    
        const populatedAquarium = await aquarium.populate('smartDevice');
        for (const parameterId of populatedAquarium.smartDevice.parameters) {
            populatedAquarium.readings.push({
                parameter: parameterId,
                values: []
            })
        }
    
        populatedAquarium.save()
            .then((data) => {
                res.status(201).json({
                    message: 'Aquarium created successfully',
                    aquarium: data,
                    success: true
                })
            })
            .catch((err) => res.json({ 
                message: err.message,
                success: false
            }));
    }catch(err){
        res.status(500).json({ 
            message: err.message,
            success: false
        })
    }
    
}

export async function getAquariumById(req, res){
    const { aquariumId } = req.params;
    try{
        const aquarium = await Aquarium.findOne({_id: aquariumId});
        if(aquarium) {
            res.status(200).json({
                message: `AQUARIUM WITH ID ${aquarium._id} found`,
                success: true,
                aquarium: aquarium
            });
        }
        else{
            res.status(404).json({
                message: `AQUARIUM WITH ID ${aquarium._id} NOT FOUND`,
                success: false
            });
        }
    }catch(err){
        res.status(500).json({
            message: err.message,
            success: false
        });
    }
}

export async function startDevice(req, res) {
    const { aquariumId } = req.params;
    try{
        const aquarium = await Aquarium.findOne({_id: aquariumId}).populate('smartDevice');
        if(aquarium) {
            startListening(aquarium, handleSensorDataCallback);
            res.status(200).json({
                message: `AQUARIUM WITH ID ${aquarium._id} LISTENING FOR CHANGES`,
                success: true
            });
        }
        else{
            res.status(404).json({
                message: `AQUARIUM WITH ID ${aquarium._id} NOT FOUND`,
                success: false
            });
        }
    }catch(err){
        res.status(500).json({
            message: err.message,
            success: false
        });
    }
    
}

export async function stopDevice(req, res) {
    const { aquariumId } = req.params;
    try{
        const aquarium = await Aquarium.findOne({_id: aquariumId}).populate('smartDevice');
        if(aquarium) {
            stopListening(aquarium);
            res.status(200).json({
                message: `AQUARIUM WITH ID ${aquarium._id} STOPPED`,
                success: true
            });
        }
        else {
            res.status(404).json({
            message: `AQUARIUM WITH ID ${aquarium._id} NOT FOUND`,
            success: false
            })
        };
    }catch(err){
        res.status(500).json({
            message: err.message,
            success: false
            })
    }
    
    
}

export async function getAllAquariumsByOwnerId(req, res){
    try{
        const ownerId = req.params.ownerId;
        const aquariums = await Aquarium.find({owner: ownerId})

        if(aquariums.length === 0) 
            return res.status(200).json({
                message: `The owner with id ${ownerId} does not exist or has no aquariums`,
                success: false
            })
        
        res.status(200).json({
            aquariums: aquariums,
            success: true
        })
    }catch(err){
        res.status(500).json({
            message: err.message,
            success: false
        });
    }
}

export async function linkDeviceToAquarium(req, res){
    const { aquariumId, deviceId } = req.params;

    try {
        const updatedAquarium = await Aquarium.findByIdAndUpdate(
        aquariumId,
        { smartDevice: deviceId },
        { new: true }
        );
        
        const populatedAquarium = await updatedAquarium.populate('smartDevice');
        for (const parameterId of populatedAquarium.smartDevice.parameters) {
            populatedAquarium.readings.push({
                parameter: parameterId,
                values: []
            })
        }

        await populatedAquarium.save();

        res.status(200).json({
            aquarium: populatedAquarium,
            success: true
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false,
            message: 'Server error' 
        });
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

async function handleSensorDataCallback(aquarium, sensorData){
    const sensorDataMap = new Map();
    sensorDataMap.set('pH',sensorData.pH);
    sensorDataMap.set('Temperature',sensorData.temperature);
    sensorDataMap.set('Turbidity',sensorData.turbidity);
    sensorDataMap.set('Total dissolved solids', sensorData.tds);

    const populatedAquarium = await aquarium
                                .populate({
                                    path: 'readings', 
                                    populate: {
                                        path: 'parameter',
                                        model: 'Parameter'
                                    }
                                });
                                            
    for (const reading of populatedAquarium.readings) {
        const readingValue = sensorDataMap.get(reading.parameter.name);
        reading.values.push({value: readingValue, timestamp: Date.now() })
    }

    await populatedAquarium.save();
    //console.log(`Reading sent : ${JSON.stringify(aquarium.readings)}`);
        
}

function getParameterStatus(value, idealRange){
    const {min, max} = idealRange;
    const midValue = (min + max)/2;
    const rangeSeparator = (max - min)/3;
    //Green Range
    if(value >= midValue - rangeSeparator && value <= midValue + rangeSeparator) return 'green';
    //Yellow Range
    else if((value >= midValue - 2*rangeSeparator 
        && value < midValue + rangeSeparator) || 
        (value > midValue + rangeSeparator 
        && value <= midValue + 2*rangeSeparator)) return 'yellow';
    //Red Range
    else return 'red';
}

function mapSensorData(readings) {
    const sensorData = [];
    let value, timestamp;
    for (const reading of readings) {
        const parameterName = reading.parameter.name;
        if(reading.values.length === 0) {
            value = null;
            timestamp = null;
        }
        else{
            const lastValueRead = reading.values[reading.values.length - 1];
            value = lastValueRead.value;
            timestamp = lastValueRead.timestamp;
        }

        sensorData.push({
            name: parameterName,
            value: value, 
            unit: reading.parameter.unit,
            timestamp: timestamp,
            statusColor: getParameterStatus(value, reading.parameter.idealRange)
        });
    }
  
    return sensorData;
  }

export async function getSensorData(req, res) {
    try{
        const aquariumId = req.params.aquariumId;
        const aquarium = await Aquarium.findOne({_id: aquariumId})
                                       .populate({
                                            path: 'readings', 
                                            populate: {
                                                path: 'parameter',
                                                model: 'Parameter'
                                            }
                                        });

        if(!aquarium) 
            return res.status(404).json({
                message: `The aquarium with id ${aquariumId} does not exist`,
                success: false
            })
        
        const mappedReadingsToSensorData = mapSensorData(aquarium.readings); 
        
        res.status(200).json({
            sensorData: mappedReadingsToSensorData,
            success: true
        })
    }catch(err){
        res.status(500).json({
            message: err.message,
            stack: err.stack,
            success: false
        });
    }
}