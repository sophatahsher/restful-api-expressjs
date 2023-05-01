import mongoose from 'mongoose';
import debug from 'debug';
import appConfig from '../env.config';

const log = debug('app');

mongoose.Promise = global.Promise;
mongoose.set('strictQuery', false);
mongoose.connection.on('connected', () => {
    log('MongoDB Connection Established');
});

mongoose.connection.on('reconnected', () => {
    log('MongoDB Connection Reestablished');
});

mongoose.connection.on('disconnected', () => {
    log('MongoDB Connection Disconnected');
});

mongoose.connection.on('close', () => {
    log('MongoDB Connection Closed');
});

mongoose.connection.on('error', error => {
    log('MongoDB ERROR: ' + error);
    process.exit(1);
});

mongoose.set('debug', appConfig.mongoDebug);

const connectMongo = async () => {
    const dbOptions = {
        autoIndex: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4,
    };
  
    let connectionURI = appConfig.DB_CONNECTION_STRING;
    await mongoose.connect(connectionURI, dbOptions).catch(err => {
       Logger.log.fata(`DATABASE - Error: ${err}`);
    });
};
export default connectMongo;
