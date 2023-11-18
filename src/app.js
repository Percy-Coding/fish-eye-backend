import express from 'express';
import mongoose from 'mongoose';
import * as routes from './routes/index.js';
import {applyMiddlewareToRoutes} from './middlewares/routerMiddlewares.js'
import dotenv from 'dotenv';
import Aquarium from './models/aquarium.js';

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
    const aquarium = await Aquarium.findById('64564dd2c57ce5b78d9dda43');
    aquarium.readings.forEach((reading) => {
        reading.values = reading.values.filter((value) => value.value != null);
      });
    await aquarium.save();
    res.send('eje')
});

//mongodb connection
mongoose
    .connect(process.env.MONGODB_ATLAS_URI)
    .then( () => console.log('Connected to mongodb atlas'))
    .catch( (err) => console.error(err));

app.listen(port, ()=>console.log(`Server listening on ${port}`));
