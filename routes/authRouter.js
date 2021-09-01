import { Router } from 'express';
import { signUp, signIn, getUserInfo, updateUserInfo } from '../controllers/auth.js';
import verifyUser from '../middlewares/verifyUser.js';

const authRouter = Router();

authRouter.post('/signup', signUp);
authRouter.post('/signin', signIn);
authRouter.get('/me', verifyUser, getUserInfo);
authRouter.get('/updateme', verifyUser, updateUserInfo);

export default authRouter;
