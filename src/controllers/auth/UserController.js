import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import httpStatus from '../../../utils/httpStatus';
import appConfig from '../../../config/env.config';
import userAgent from 'express-useragent';
import { UserModel, RecoveryTokenModel, UserSessionLogModel, UserActivityLogModel} from '../../models/auth/UserModel';

const UserController = {};
console.log('UserController is called!');

UserController.register = async (req, res, next) => {
    try {
        const { username, password, email, firstname, lastname, address, phone, status } = req.body;

        if (username && email) 
        {
            // check exists account
            const existingAccount = await UserModel.find({ email: email }).exec();

            if (existingAccount.length > 0) {
                return res.status(httpStatus.CONFLICT).json({ message: 'Mail already exists!' });
            } else {
                const user = new UserModel(req.body);

                if (req.body.password) {
                    user.hash = bcrypt.hashSync(req.body.password, 10);
                }

                user.password = user.hash;

                let result = await user.save();
                console.log('result save: ', result);
                return res.status(httpStatus.CREATED).json({ data: { user } });
            }
        } else {
            // error validation
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'ERROR',
                message: 'Bad Request',
            });
        }
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'ERROR',
            message: e.message,
        });
    }
};

// Login user
UserController.login = async (req, res, next) => {
    try 
    {
        console.log('User-Agent=========', req.get('User-Agent'));
        //console.log('User-Agent=========', req.get('User-Agent'));
        console.log('headers=========', req.headers['host']);
        console.log('useragent=========', userAgent.getBrowser);
        // req.session.useragent = {
        //     browser: req.useragent.browser || '',
        //     version: req.useragent.version  || '',
        //     os: req.useragent.os  || '',
        //     platform: req.useragent.platform  || ''
        //  }
        // console.log('useragent==========', req.session.useragent);


        const loginUrl = req.headers['host'];
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email: email });

        if (user && bcrypt.compareSync(password, user.password)) 
        {
            let curDate = new Date();

            // ACCESS_TOKEN::Revoke lifetime with 5 minute access token as JWT (self-contained, don't need to store it anywhere).
            let accessTokenExpiration = new Date(curDate.setMinutes(curDate.getMinutes()+5));

            const accessToken = jwt.sign({ sub: user.id }, appConfig.JWT_KEY, {
                expiresIn: 300,
            });
           
            // Keep authorizatio information in DB
            const userLoginData = {
                username: user.username,
                login_type: "",
                token: accessToken,
                token_expiration: accessTokenExpiration,
                login_url: loginUrl,
                ip_address: '',
                user_agent: [],
                status: "success"
            };

            // LOG: Login Sessions
            await funcLogLoginSessions(userLoginData);
            
            // REFRESH_TOKEN::Revoke lifetime with 7 days
            let refreshTokenExpiration = new Date(curDate.setMinutes(curDate.getMinutes()+10080));

            // 7 day refresh token for one-time usage: generate random secret (don't need to sign it/encrypt it), store it in Redis with a 7 day TTL (or MySQL with a valid_until timestamp). On /refresh_token validate the provided token (check if it's in Redis/MySQL) and delete it. Generate a new access and refresh token pair. (I like to rotate refresh tokens as well, it makes it a bit more secure: it's probably already rotated=invalid if stolen)
            const refreshToken = jwt.sign({ sub: user.id }, appConfig.JWT_KEY, {
                expiresIn: 604800,
            });
            
            // Keep recovery token (RefreshToken)
            await funcRevokeToken({user_id: user.id, recovery_token: refreshToken, expiration: refreshTokenExpiration});
            
            // Keep authorizatio information in DB
            const userLogActivityData = {
                username: user.username,
                act_type: "LOGIN",
                login_type: "",
                token: accessToken,
                token_expiration: accessTokenExpiration,
                login_url: loginUrl,
                ip_address: '',
                user_agent: [],
                status: "success"
            };

            // LOG:User's activities
            await funcLogUserActivity(userLogActivityData);

            // HTTPRESPONSE::Success
            return res.status(httpStatus.OK).json({
                accessToken: accessToken,
                refreshToken: refreshToken,
                token_type: 'Bearer',
                expires: 300
            });

        } else 
        {
            return res.status(httpStatus.UNAUTHORIZED).json({
                message: 'Auth failed!',
            });
        }
    } catch (e) 
    {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'ERROR',
            message: e.message,
        });
    }
};

// Request revoke for new accessToken by refreshToken
UserController.revoke = async (req, res, next) => {
    try 
    {
        const {refresh_token, grant_type, client_id, client_secret} = req.body;

        const user = await UserModel.findOne({ refreshToken: refreshToken });

        console.log('user============', user);
        return res.status(200).json({});

        if (user) 
        {
            const accessToken = jwt.sign({ sub: user.id }, appConfig.JWT_KEY, {
                expiresIn: 30,
            });

            const refreshToken = jwt.sign({ sub: user.id }, appConfig.JWT_KEY, {
                expiresIn: '2m',
            });

            return res.status(httpStatus.OK).json({
                accessToken: accessToken,
                refreshToken: refreshToken,
                token_type: 'Bearer',
                expires: 60
            });
        } 
        else 
        {
            return res.status(httpStatus.UNAUTHORIZED).json({message: 'Auth failed!',});
        }
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'ERROR',
            message: e.message,
        });
    }
};

/**
 * @FindAllCreatedUsers
 */
UserController.findAllUsers = async (req, res, next) => {
    try {
        let user = await UserModel.find();
        return res.status(httpStatus.CREATED).json({ data: user });
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'ERROR',
            message: e.message,
        });
    }
};

// Update UserByID
UserController.updateUserAccount = async (req, res) => {
    try {
        let user = await UserModel.findById(req.params.userId);

        if (!user) {
            return res.status(httpStatus.BAD_REQUEST).json({ message: 'User not found' });
        }

        Object.assign(user, req.body);
        await user.save();
        return res
            .status(httpStatus.OK)
            .json({ status: 'success', message: 'Update user successfully' });
    } catch (error) {
        return res.status(500).json({ error: error.toString() });
    }
};

// Delete UserByID
UserController.deleteAccount = async (req, res) => {
    try {
        let user = await UserModel.findByIdAndRemove(req.params.userId);

        if (!user) {
            return res.status(httpStatus.BAD_REQUEST).json({ message: 'User not found' });
        }

        return res
            .status(httpStatus.OK)
            .json({ status: 'success', message: 'User deleted successfully!' });
    } catch (error) {
        return res.status(500).json({ error: error.toString() });
    }
};

//------------------------------------------------------------------------------------------------

/**
 * @Protected
 * @SaveNewRefreshTokenIfNotExistElseUpdate
 * @param {*} data 
 */
const funcRevokeToken = async (data) => {
  
    // create a new Date object, using the adjusted time
    const recoveryTokenData = {
        user_id: data.user_id,
        token: data.recovery_token,
        expiration: data.expirations
    };

    const existingRefreshToken = await RecoveryTokenModel.find({ user_id: data.user_id }).exec();

    if ( existingRefreshToken.length > 0 ) 
    {
        await RecoveryTokenModel.updateOne({ user_id: data.id}, recoveryTokenData);
    }
    else
    {
        const responseToken = new RecoveryTokenModel(recoveryTokenData);
        await responseToken.save();
    }
}; 

/**
 * @Protected
 * @LogSessionUserLogin
 * @param {*} data 
 */
const funcLogLoginSessions = async (data) => {
  
    const existingSessionLogin = await UserSessionLogModel.find({username: data.username}).exec();

    if ( existingSessionLogin.length > 0 ) 
    {
        await UserSessionLogModel.updateOne({ username:data.username}, data);
    }
    else
    {
        const loggedInSession = new UserSessionLogModel(data);
        await loggedInSession.save();
    }
}; 

/**
 * @Protected
 * @LogUserActivites
 * @param {*} data 
 */
const funcLogUserActivity = async (data) => {
    const logUserActivity = new UserActivityLogModel(data);
    await logUserActivity.save();
}; 

export default UserController;
