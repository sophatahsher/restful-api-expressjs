import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import router from './routes/route';
import dotenv from 'dotenv';
import connectMongo from './config/databases/mongoconnect';

const app = express();

// Server Environment
const isProd = process.env.NODE_ENV === 'production';

// https debug
app.use(morgan('dev'));

// bodyParser setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// DB Connection
connectMongo();

// serving static file
app.use(express.static('public'));

// Setup Route
app.use(router);
//app.use('/', mainRouter)

dotenv.config();
const PORT = process.env.PORT || 3000;
console.log('PORT======', process.env.PORT);
app.listen(PORT, () => {
    console.log(`Server is running on isProductions => ${isProd}`);
    console.log(`Your server is running on port ${PORT}`);
});
