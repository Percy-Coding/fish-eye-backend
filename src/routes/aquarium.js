import express from 'express';
import { 
    createAquarium, 
    startDevice, 
    stopDevice, 
    getAllAquariumsByOwnerId, 
    linkDeviceToAquarium,
    deleteAquariumById } from '../services/aquariumService.js';

const router = express.Router();

router.post('/aquarium', createAquarium);
router.post('/aquarium/:aquariumdId/start-device', startDevice);
router.post('/aquarium/:aquariumdId/stop-device', stopDevice);
router.get('/aquariums/:ownerId', getAllAquariumsByOwnerId);
router.post('/aquarium/:aquariumId/:deviceId', linkDeviceToAquarium);
router.delete('/aquarium/:aquariumId', deleteAquariumById);

export default router;