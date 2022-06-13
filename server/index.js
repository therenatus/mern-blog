import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import cors from 'cors';
import router from './src/routes/index.js'


mongoose.connect(
    'mongodb+srv://admin:admin@cluster0.wosf0.mongodb.net/tender?retryWrites=true&w=majority'
).then(() => {console.log('connect')}).catch(err => console.log('error connecting to server' + err));

const PORT = process.env.PORT || 6000; 

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', router)

const start = () => {
    app.listen(PORT, ()=> console.log('Server started on port '+PORT))
}

start();