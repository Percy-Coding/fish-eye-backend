import express from 'express';
import {registerUser, login} from '../services/userService';

const router = express.Router();

//create user
router.post('/users', registerUser);

router.post('/users/login', login);


export default router;