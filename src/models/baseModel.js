import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const UserSchema = new Schema({

    username: {
        type: String,
        require: true,
        //message: 'Enter Account Username'
    },
    password: {
        type: String,
        require: true,
        //require: 'Enter Account Password'
    },
    firstname: {
        type: String,
        require: true,
        //require: 'Enter your FirstName'
    },
    lastname: {
        type: String,
        require: true,
        //require: 'Enter your LastName'
    },
    email: {
        type: String,
        require: true,
        //require: 'Enter your email address'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});