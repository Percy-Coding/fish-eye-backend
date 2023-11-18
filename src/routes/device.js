import express from 'express';
import { createDevice } from '../services/deviceService.js';

const router = express.Router();


router.post('/device', createDevice);

export default router;