import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import  {UserModel}  from "../../models/auth/UserModel"
import httpStatus from "../../../utils/httpStatus"
import appConfig from "../../../config/config";

const UserController = {};
console.log('UserController is called!');

UserController.register = async (req, res, next) => {
    try 
    {
        const { 
            username, 
            password, 
            email,
            firstname,
            lastname,
            address,
            phone, 
            status 
        } = req.body;

        if ( username && email )
        {
            // check exists account
            const existingAccount = await UserModel.find({email: email}).exec();

            if ( existingAccount.length > 0 ) {
                return res.status(httpStatus.CONFLICT).json({ message: "Mail already exists!" });
            }
            else 
            {
                const user = new UserModel(req.body);
            
                if (req.body.password) {
                    user.hash = bcrypt.hashSync(req.body.password, 10);
                }

                user.password = user.hash;

                let result = await user.save();
                console.log('result save: ', result);
                return res.status(httpStatus.CREATED).json({ data: { user } });
            }
        }
        else
        {
            // error validation
            return res.status(httpStatus.BAD_REQUEST).json({
                status: "ERROR",
                message: "Bad Request",
            });
        }
    } catch (e) 
    {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: "ERROR",
            message: e.message,
        });
    }
}

// Login user
UserController.login = async (req, res, next) => {
    try 
    {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email: email });

        if (user && bcrypt.compareSync(password, user.password)) 
        {
            const accessToken = jwt.sign({ sub: user.id }, appConfig.JWT_KEY, {
                expiresIn: "7d",
            });

            const refreshToken = jwt.sign({ sub: user.id }, appConfig.JWT_KEY, {
               expiresIn: "2m",
            });

            return res.status(httpStatus.OK).json({
                accessToken: accessToken,
                refreshToken: refreshToken
            });
        } 
        else 
        {
            return res.status(httpStatus.UNAUTHORIZED).json({
                message: "Auth failed!",
            });
        }
    } catch (e) 
    {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: "ERROR",
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
    }
    catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: "ERROR",
            message: e.message,
        });
    }
}

// Update UserByID
UserController.updateUserAccount = async (req, res) => {
    try 
    {
        let user = await UserModel.findById(req.params.userId);

        if (!user) 
        {
            return res.status(httpStatus.BAD_REQUEST).json({ message: "User not found" });
        }

        Object.assign(user, req.body);
        await user.save();
        return res.status(httpStatus.OK).json({status: 'success', message: "Update user successfully"});

    } catch (error) {
        return res.status(500).json({ error: error.toString() });
    }
};

// Delete UserByID
UserController.deleteAccount = async (req, res) => {
    try 
    {
        let user = await UserModel.findByIdAndRemove(req.params.userId);

        if (!user) 
        {
            return res.status(httpStatus.BAD_REQUEST).json({ message: "User not found" });
        }

        return res.status(httpStatus.OK).json({ status: 'success', message: "User deleted successfully!" });
    }
    catch (error) 
    {
        return res.status(500).json({ error: error.toString() });
    }
};
export default UserController;

