import { Router } from 'express';
import { createCategory, deleteCategory, getAllCategories, getSingleCategory, updateCategory } from '../controllers/categories.js';

const categoryRouter = Router();

categoryRouter.get('/', getAllCategories);
categoryRouter.get('/:id', getSingleCategory);
categoryRouter.post('/', createCategory);
categoryRouter.put('/:id', updateCategory);
categoryRouter.delete('/:id', deleteCategory);

export default categoryRouter;