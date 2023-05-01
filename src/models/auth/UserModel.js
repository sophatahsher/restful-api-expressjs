import {mongoose, Types} from 'mongoose';
const schema = mongoose.Schema;

// setting schema options
const UserSchema = new schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create RecoveryTokenSchema
const RecoveryTokenSchema = new schema({
    user_id: {
        type: Types.ObjectId,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    expiration: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create UserLoggedInSchema
const UserSessionLogSchema = new schema({
    username: {
        type: String,
        required: true
    },
    login_type: {
        type: String,
        required: false
    },
    token: {
        type: String,
        required: true
    },
    token_expiration: {
        type: Date,
        required: true
    },
    login_url: { 
        type: String
    },
    ip_address: {
        type: String,
        required: false
    },
    user_agent: {
        type: [],
        required: false
    },
    status: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create UserActivityLogSchema
const UserActivityLogSchema = new schema({
    username: {
        type: String,
        required: true,
    },
    act_type: {
        type: String,
        required: true
    },
    login_type: {
        type: String
    },
    token: {
        type: String,
        required: true
    },
    token_expiration: {
        type: Date,
        required: true
    },
    login_url: { 
        type: String
    },
    ip_address: {
        type: String
    },
    user_agent: {
        type: []
    },
    status: {},
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const UserModel             = mongoose.model('users', UserSchema);
const RecoveryTokenModel    = mongoose.model('recovery_tokens', RecoveryTokenSchema);
const UserSessionLogModel   = mongoose.model('login_sessions', UserSessionLogSchema);
const UserActivityLogModel  = mongoose.model('login_history', UserActivityLogSchema);

export { UserModel, RecoveryTokenModel, UserSessionLogModel, UserActivityLogModel };
//console.log('Username => ', UserModel.path('username'));
