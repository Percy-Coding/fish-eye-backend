import express from 'express';
import {registerUser, login, getAllUsers, registerExpoToken} from '../services/userService.js';

const router = express.Router();

router.get('/users', getAllUsers);
router.post('/users', registerUser);
router.post('/users/login', login);
router.post('/users/:userId/register-expo-token', registerExpoToken);


export default router;