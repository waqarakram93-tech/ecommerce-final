import { Router } from 'express';
import { createCategory, deleteCategory, getAllCategories, getSingleCategory, updateCategory } from '../controllers/categories.js';
import verifyUser from '../middlewares/verifyUser.js';
const categoryRouter = Router();

categoryRouter.get('/', getAllCategories);
categoryRouter.get('/:id', getSingleCategory);
categoryRouter.post('/', verifyUser, createCategory);
categoryRouter.put('/:id', verifyUser, updateCategory);
categoryRouter.delete('/:id', verifyUser, deleteCategory);

export default categoryRouter;