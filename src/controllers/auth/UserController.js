////import mongoose from "mongoose";

import { userModel } from "../../models/auth/UserModel"
import httStatus from "../../../utils/httpStatus"

// create schema model with tablename
//const User = mongoose.model('User', UserModel);
const UserController = {};

UserController.register = async(req, res, next) => {
    try
    {
        userModel.find({username: req.body.username}).exec().then(result => {
            console.log('Result =======', result);
        });
        /*
        const userData = new User({
            username: req.body.username,
            password: req.body.password,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email
        });

        // Add
        const result  = await UserModel.create(userData);

        let {password, __v, ...user} = result.toObject();
        */
        // response
        //return res.status(httStatus.CREATED).json({status: 200, message: "User account has been added"});
    }
    catch(err)
    {
        console.log(err);
    }
}
/*

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

const createAccount = (req, res, next) => {
    res.json({message: "POST new account"}); // dummy function for now
}
*/
export default UserController;
//module.exports = {createAccount};

