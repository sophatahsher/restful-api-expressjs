import express from "express";
import route from "./src/routes/route";
import mongoose from "mongoose";
import bodyParser from "body-parser";

const app = express();
const PORT = 3000;

//mongoose Connection
mongoose.set("strictQuery", false);
//mongoose.Promise = global.Promise;
//process.env.MONGO_URL
mongoose.connect("mongodb://localhost:27017/buildme_profesonal_db", {useNewUrlParser: true});
// mongoose.connect('mongodb://localhost:27017/buildme_profesonal_db', () => {
//     console.log('Connected to MongoDB');
// });

// bodyParser setup
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// serving static file
app.use(express.static('public'));

// config route
route(app);

app.get('/', (req, res) => {
    res.send(`Node and Express server is running on port ${PORT}`);
});

app.listen(PORT, ()=> {
    console.log(`Your server is running on port ${PORT}`)
});