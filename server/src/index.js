import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import path from 'path';
import router from './routes/index.js'
import * as url from 'url'


mongoose.connect(
    'mongodb+srv://admin:admin@cluster0.wosf0.mongodb.net/tender?retryWrites=true&w=majority'
).then(() => {console.log('connect')}).catch(err => console.log('error connecting to server' + err));

const PORT = process.env.PORT || 6000; 

const app = express();
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
// const corsOptions = {
//     origin: 'http://localhost:3000',
//     optionsSuccessStatus: 200,
//   }

app.use(express.json());
app.use(cors());
app.use('/static', express.static(path.join(__dirname, 'upload')))
app.use(fileUpload())
app.use('/api', router)

const start = () => {
    app.listen(PORT, ()=> console.log('Server started on port '+PORT))
}

start();

















