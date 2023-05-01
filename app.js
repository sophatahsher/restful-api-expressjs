import express from 'express';
import bodyParser from 'body-parser';
import cors from "cors";
import morgan from 'morgan';
import router from './src/routes/route';
import dotenv from 'dotenv';
import connectMongo from './config/databases/mongoconnect';

const app = express();

dotenv.config();

// Server Environment
const isProd = process.env.NODE_ENV === 'production';

// https debug
app.use(morgan('dev'));

// bodyParser setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// DB Connection
connectMongo();

// serving static file
app.use(express.static('public'));

// Setup Route
app.use(router);
//app.use('/', mainRouter)

const PORT = process.env.PORT || 8085;

// set port, listen for requests
app.listen(PORT, () => {
    console.log(`Server is running on isProductions => ${isProd}`);
    console.log(`Your server is running on port ${PORT}`);
});
