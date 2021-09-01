import { Router } from 'express';
import { createProduct, deleteProduct, getAllProducts, getSingleProduct, updateProduct } from '../controllers/products.js';
import verifyUser from '../middlewares/verifyUser.js';
const productRouter = Router();

productRouter.get('/', getAllProducts);
productRouter.get('/:id', getSingleProduct);
productRouter.post('/', verifyUser, createProduct);
productRouter.put('/:id', verifyUser, updateProduct);
productRouter.delete('/:id', verifyUser, deleteProduct);

export default productRouter;