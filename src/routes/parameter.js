import express from 'express';
import { createParameter, getAllParameters, editParameter,getParameterById } from '../services/parameterService.js';

const router = express.Router();

router.get('/parameters', getAllParameters);
router.post('/parameter', createParameter);
router.put('/parameter/:parameterId', editParameter);
router.get('/parameter/:parameterId', getParameterById);

export default router;