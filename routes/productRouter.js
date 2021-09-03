import { Router } from 'express';
import { createProduct, deleteProduct, getAllProducts, getSingleProduct, updateProduct, addImageToProduct } from '../controllers/products.js';
import verifyUser from '../middlewares/verifyUser.js';
import uploadHandler from '../middlewares/uploadHandler.js';
import checkUpload from '../middlewares/checkUpload.js';
const productRouter = Router();

productRouter.get('/', getAllProducts);
productRouter.get('/:id', getSingleProduct);
productRouter.post('/', verifyUser, createProduct);
productRouter.put('/:id', verifyUser, updateProduct);
productRouter.delete('/:id', verifyUser, deleteProduct);
productRouter.put('/:id/image', verifyUser, uploadHandler.single('image'), checkUpload, addImageToProduct);

export default productRouter;