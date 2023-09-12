import express from 'express';
import { 
    createAquarium, 
    startDevice, 
    stopDevice, 
    getAllAquariumsByOwnerId, 
    linkDeviceToAquarium,
    deleteAquariumById,
    getSensorData,
    getAquariumById } from '../services/aquariumService.js';

const router = express.Router();

router.post('/aquarium', createAquarium);
router.post('/aquarium/:aquariumId/start-device', startDevice);
router.post('/aquarium/:aquariumId/stop-device', stopDevice);
router.get('/aquariums/:ownerId', getAllAquariumsByOwnerId);
router.post('/aquarium/link-device/:aquariumId/:deviceId', linkDeviceToAquarium);
router.delete('/aquarium/:aquariumId', deleteAquariumById);
router.get('/aquarium/:aquariumId/sensor-data', getSensorData);
router.get('/aquarium/:aquariumId',getAquariumById);

export default router;