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
router.post('/aquarium/:aquariumId/start-device', startDevice);
router.post('/aquarium/:aquariumId/stop-device', stopDevice);
router.get('/aquariums/:ownerId', getAllAquariumsByOwnerId);
router.post('/aquarium/link-device/:aquariumId/:deviceId', linkDeviceToAquarium);
router.delete('/aquarium/:aquariumId', deleteAquariumById);

export default router;