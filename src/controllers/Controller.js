import mongoose from "mongoose";

import { UserSchema } from "../models/baseModel";


const User = mongoose.model('User', UserSchema);

export const addNewUser = async (req, res)=> {

    let newUser = new User(req.body);

    await newUser.save((err, user) => {
        if(err){      
            res.send(err)
        }
        res.json(user);
    });
};