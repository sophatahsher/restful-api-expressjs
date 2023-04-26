import jwt from 'jsonwebtoken';
import appConfig from '../config/config';
import { UserModel } from '../src/models/auth/UserModel';

console.log('middleware is called!');

const Auth = async (req, res, next) => {
    const accessToken = await verifyToken(req.headers['authorization']);

    if (accessToken == '')
        return res.status(401).send({ status: 'ERROR', message: 'Access token is invalid' });

    jwt.verify(accessToken, appConfig.JWT_KEY, (err, authData) => {
        if (err) {
            return res.status(401).send({ status: 'ERROR', message: 'Access token is invalid' });
        } else {
            const decode = jwt.verify(accessToken, appConfig.JWT_KEY);
            const user = UserModel.findOne({ _id: decode.sub });
            if (!user) {
                return res
                    .status(401)
                    .send({ status: 'ERROR', message: 'Access token is invalid' });
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
