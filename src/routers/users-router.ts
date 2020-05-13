import express from 'express';
import {userService} from '../config/app';

export const UserRouter = express.Router();

const UserService = userService;

UserRouter.get('', async (req, res) => {
    try {
        let payload = await UserService.getAllUsers();
        res.status(200).json(payload);
    } catch (e) {
        res.status(e.statusCode).json(e);
    }
});