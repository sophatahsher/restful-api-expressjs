const prodConfig = {
    // DB
    DB_CONNECTION_STRING: process.env.MONGO_URL,
    MONGO_DEBUG: true,

    // JWT
    JWT_KEY: '0123456789',
    JWT_EXPIRATION: 360000
};
export default prodConfig;
