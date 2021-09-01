import { Router } from 'express';
import { createOrder, deleteOrder, getAllOrders, getSingleOrder, updateOrder } from '../controllers/orders.js';
import verifyUser from '../middlewares/verifyUser.js';

const orderRouter = Router();

orderRouter.get('/', getAllOrders);
orderRouter.get('/:id', getSingleOrder);
orderRouter.post('/', verifyUser, createOrder);
orderRouter.put('/:id', verifyUser, updateOrder);
orderRouter.delete('/:id', verifyUser, deleteOrder);

export default orderRouter;