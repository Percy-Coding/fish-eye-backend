import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes';
require('dotenv').config();


const app = express();
const port = process.env.PORT || 3000;

//midddlewares
app.use(express.json())
app.use('/api',userRoutes);

//routes
app.get('/', (req, res) => {
    res.send({message: 'Welcome to fishEyeDB API'});
});

//mongodb connection
mongoose
    .connect(process.env.MONGODB_ATLAS_URI)
    .then( () => console.log('Connected to mongodb atlas'))
    .catch( (err) => console.error(err));

app.listen(port, ()=>console.log(`Server listening on ${port}`));
