import express from 'express';
import { connectDB } from './db/connectDB.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.route.js';



const app = express();

app.use(express.json()); //allow to parse json data
app.use(cookieParser());
dotenv.config();

const PORT = process.env.PORT|| 5001 ;




app.use("/api/auth", authRoutes);


console.log(process.env.PORT);

app.listen(PORT, () => {
        connectDB();
        console.log("Server is running on port", PORT);


  

});

//mongodb+srv://saadaouiossama11:C5y2EH03yEIG529b@cluster0.edthb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0