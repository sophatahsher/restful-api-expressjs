import mongoose from "mongoose";

import { UserModel } from "../../models/auth/UserModel"

// create schema model with tablename
const User = mongoose.model('User', UserModel);
//const User = mongoose.model('User', UserModel);

export const createUserAccount = async(req, res) => {
        try
        {
            const userObject = new User({
                username: req.body.username,
                password: req.body.password,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email
            });

            // Add
            userObject.save() 

            // response
            res.json({status: 200, message: "User account has been added"});
        }
        catch(err)
        {
            console.log(err);
        }
    }

export const getUserAccountInfo = async(req, res) =>
{
    try
    {
        // retrived data of user account
        
        User.find({}, (err, data) => 
        {
            if(err)
                res.send({status: 400, message: `${err}`})

            // response
            res.json({status: 200, data});
        });
    }
    catch(err)
    {
        console.log(err.message);
    }
}

export const getUserAccountById = async(req, res) =>
{
    try
    {
        // retrived data of user account
        
        User.findById(req.params.userId, (err, data) => 
        {
            if(err)
                res.send({status: 400, message: `${err}`})

            // response
            res.json({status: 200, data});
        });
    }
    catch(err)
    {
        console.log(err.message);
    }
}


export const updateAccountSetting = async(req, res) =>
{
    try
    {
        // retrived data of user account
        
        User.findOneAndUpdate({_id: req.params.userId}, req.body, {new: true},  (err, data) => 
        {
            if(err)
                res.send({status: 400, message: `${err}`})

            // response
            res.json({status: 200, data});
        });
    }
    catch(err)
    {
        console.log(err.message);
    }
}


export const deleteAccount = async(req, res) =>
{
    try
    {
        // retrived data of user account
        User.remove({_id: req.params.userId},  (err, data) => 
        {
            if(err)
                res.send({status: 400, message: `${err}`})

            // response
            res.json({status: 200, data});
        });
    }
    catch(err)
    {
        console.log(err.message);
    }
}

