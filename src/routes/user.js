import express from 'express';
import {registerUser, login, getAllUsers} from '../services/userService.js';

const router = express.Router();

router.get('/users', getAllUsers);
router.post('/users', registerUser);
router.post('/users/login', login);


export default router;