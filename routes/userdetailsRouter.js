import { Router } from 'express';
import { createuserDetail, deleteuserDetail, getAllusersDetails, getSingleuserDetail, updateuserDetail } from '../controllers/userdetails.js';
import verifyUser from '../middlewares/verifyUser.js';
const userdetailsRouter = Router();

userdetailsRouter.get('/', getAllusersDetails);
userdetailsRouter.get('/:id', getSingleuserDetail);
userdetailsRouter.post('/', verifyUser, createuserDetail);
userdetailsRouter.put('/:id', verifyUser, updateuserDetail);
userdetailsRouter.delete('/:id', verifyUser, deleteuserDetail);

export default userdetailsRouter;