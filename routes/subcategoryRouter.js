import { Router } from 'express';
import { createsubCategory, deletesubCategory, getAllsubCategory, getSinglesubCategory, updatesubCategory } from '../controllers/subcategories.js';
import verifyUser from '../middlewares/verifyUser.js';
const subcategoryRouter = Router();

subcategoryRouter.get('/', getAllsubCategory);
subcategoryRouter.get('/:id', getSinglesubCategory);
subcategoryRouter.post('/', verifyUser, createsubCategory);
subcategoryRouter.put('/:id', verifyUser, updatesubCategory);
subcategoryRouter.delete('/:id', verifyUser, deletesubCategory);

export default subcategoryRouter;