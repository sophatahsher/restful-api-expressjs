import express from 'express';

import UserController from './UserController';
import { asyncWrapper } from '../../../utils/asyncWrapper';
import auth from '../../../middleware/auth.middleware';

const authRoutes = express.Router();

authRoutes.get('/', (req, res, next) => {
    res.json({ message: 'from index api' });
});

// Create
authRoutes.post('/register', asyncWrapper(UserController.register));

export { authRoutes };
