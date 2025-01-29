import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import userRouter from './routes/user.js'
import linkRouter from './routes/link.js'

dotenv.config()

const app = express();
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.json("Server is handling get request here");
})

mongoose.connect(`${process.env.DATABASE_URL}`).then(()=> console.log("connected to mongoDB")).catch((err)=> console.log(err));
app.use('/api/v1/user', userRouter);
app.use('/api/v1/link', linkRouter);

app.listen(3000);