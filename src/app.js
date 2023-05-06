import express from 'express';
import mongoose from 'mongoose';
import * as routes from './routes/index.js';
import {applyMiddlewareToRoutes} from './middlewares/routerMiddlewares.js'
import { mqttClients } from './utils/mqttVariables.js';
import dotenv from 'dotenv';
import Aquarium from './models/aquarium.js';
import Device from './models/device.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

//midddlewares
app.use(express.json())
app.use('/api', applyMiddlewareToRoutes(routes));

//routes
app.get('/', (req, res) => {
    res.send({message: 'Welcome to fishEyeDB API'});
});

//testing purposes only
app.get('/test', async (req, res) => {
    //const aquarium = await Aquarium.findById('64562e6ff97215928a63ece1');
    //const populatedAquarium = await aquarium.populate('smartDevice');
    //res.json({populatedAquarium});
    const aquarium = await Device.findById('64563216523f7419f62c3e7d');
    //const populatedAquarium = await aquarium.populate('parameters');
    res.json({aquarium});
});

//mongodb connection
mongoose
    .connect(process.env.MONGODB_ATLAS_URI)
    .then( () => console.log('Connected to mongodb atlas'))
    .catch( (err) => console.error(err));

app.listen(port, ()=>console.log(`Server listening on ${port}`));
