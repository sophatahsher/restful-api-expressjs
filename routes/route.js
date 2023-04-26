import express from 'express';
import httpStatus from '../utils/httpStatus';
import { asyncWrapper } from '../utils/asyncWrapper';
import Auth from '../middleware/auth.middleware';

const router = express.Router();

router.use('/api/v1', router); // apiRoutes if you want to point to Controller

// Controllers
import UserController from '../src/controllers/auth/UserController';

// Main route

router.get('/route', (req, res, next) => {
    res.status(200).send({ status: 200, message: 'Route works!' });
    //res.send(`Node and Express server is running on port ${PORT}`);
});

// Start mapping routes & controllers
router.post('/register', asyncWrapper(UserController.register));

// login
router.post('/login', asyncWrapper(UserController.login));

// get user account
router.get('/users', Auth, asyncWrapper(UserController.findAllUsers));

// update
router.put('/users/:userId', Auth, asyncWrapper(UserController.updateUserAccount));

// delete
router.delete('/users/:userId', Auth, asyncWrapper(UserController.deleteAccount));

export default router;
