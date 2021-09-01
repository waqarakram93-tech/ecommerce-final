import { Router } from 'express';
import { createOrderDetail, deleteOrderDetail, getAllOrdersDetails, getSingleOrderDetail, updateOrderDetail } from '../controllers/orderdetails.js';
import verifyUser from '../middlewares/verifyUser.js';
const orderdetailsRouter = Router();

orderdetailsRouter.get('/', getAllOrdersDetails);
orderdetailsRouter.get('/:id', getSingleOrderDetail);
orderdetailsRouter.post('/', verifyUser, createOrderDetail);
orderdetailsRouter.put('/:id', verifyUser, updateOrderDetail);
orderdetailsRouter.delete('/:id', verifyUser, deleteOrderDetail);

export default orderdetailsRouter;