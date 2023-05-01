import jwt from 'jsonwebtoken';
import appConfig from '../../config/env.config';
import { UserModel } from '../models/auth/UserModel';
import httpStatus from '../../utils/httpStatus';

console.log('middleware is called!');

const Auth = async (req, res, next) => {
    
    const accessToken = await verifyToken(req.headers['authorization']);

    if (accessToken == '')
        return res.status(httpStatus.UNAUTHORIZED).send({ status: 'failed', message: `Access token is invalid ${err}` });
   
    jwt.verify(accessToken, appConfig.JWT_KEY, (err, decodedData) => {
        
        if (err) 
        {
            if(err.name === 'TokenExpiredError')
                return res.status(httpStatus.UNAUTHORIZED).send({ status: 'failed', keyword: 'TokenExpiredError', message: 'Access token already expired'});
            else
                return res.status(httpStatus.UNAUTHORIZED).send({ status: 'failed', keyword: 'UnknownError', message: `Access token is invalid ${err}` });
        } 
        else 
        {
            const user = UserModel.findOne({ _id: decodedData.sub });
            
            if (!user) {
                return res
                    .status(httpStatus.UNAUTHORIZED)
                    .send({ status: 'failed', message: 'Access token is invalid' });
            }

            req.token = accessToken;
            req.user = user;
            next();
        }
    });
};

/**
 * @BearerToken
 * @param {} bearerHeader
 * @returns
 */
const verifyToken = async bearerHeader => {
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];

        if (bearerToken) return bearerToken;

        return '';
    } else return '';
};

export default Auth;
