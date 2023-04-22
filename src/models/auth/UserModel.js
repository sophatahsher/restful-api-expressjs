import mongoose from "mongoose";

// setting schema options
export const UserModel = new mongoose.Schema({
    username: {
        type: String,
        //require: true,
        message: 'Enter Account Username'
    },
    password: {
        type: String,
        require: true
        //requried: [true, "Please enter password"]
        //require: 'Enter Account Password'
    },
    firstname: {
        type: String,
        require: true
        //require: 'Enter your FirstName'
    },
    lastname: {
        type: String,
        require: true
        //require: 'Enter your LastName'
    },
    email: {
        type: String,
        require: true
        //require: 'Enter your email address'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

console.log('Username => ', UserModel.path('username'));