import { Router } from 'express';
import { createCheckoutSession } from '../controllers/payments.js';
import verifyUser from '../middlewares/verifyUser.js';

const paymentsRouter = Router();

paymentsRouter.post('/', createCheckoutSession);

export default paymentsRouter;
