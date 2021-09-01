import pgPool from '../db/pgPool.js';
import asyncHandler from '../middlewares/asyncHandler.js'
import ErrorResponse from '../utils/ErrorResponse.js'


export const getAllCategories = asyncHandler(async (req, res) => {
    const { rowCount: total, rows: categories } = await pgPool.query('SELECT * FROM categories;')
    res.status(201).json({ total, categories });
})
export const getSingleCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { rows, rowCount } = await pgPool.query('SELECT * FROM categories WHERE id=$1;', [id])
    if (!rowCount) throw new ErrorResponse(`Category with id of ${id} not found`, 404);
    res.status(200).json(rows[0]);

})
export const createCategory = asyncHandler(async (req, res) => {
    const { role } = req.user;
    if (role !== 'admin') throw new ErrorResponse('Unauthorized', 401)
    const { name } = req.body;
    if (!name)
        throw new ErrorResponse('Category name is required', 400);
    const { rowCount: found } = await pgPool.query('SELECT * FROM categories WHERE name=$1', [name])
    if (found) throw new ErrorResponse('Category already exists', 403)
    const values = [name]
    const { rows } = await pgPool.query('INSERT INTO categories(name) VALUES($1)RETURNING *', values)
    res.status(201).json(rows[0]);
})

export const updateCategory = asyncHandler(async (req, res) => {
    const { role } = req.user;
    if (role !== 'admin') throw new ErrorResponse('Unauthorized', 401)
    const { name } = req.body;
    if (!name)
        throw new ErrorResponse('Category name is required', 400);
    const { id } = req.params;
    const { rowCount: found } = await pgPool.query('SELECT * FROM categories WHERE id=$1', [id])
    if (!found) throw new ErrorResponse(`Category with id of ${id} doesn't exist`)
    const values = [name, id]
    const { rows } = await pgPool.query('UPDATE categories SET name=$1 WHERE id=$2 RETURNING *', values)
    res.status(200).json(rows[0]);
});

export const deleteCategory = asyncHandler(async (req, res) => {
    const { role } = req.user;
    if (role !== 'admin') throw new ErrorResponse('Unauthorized', 401)
    const { id } = req.params;
    const { rowCount: found } = await pgPool.query('SELECT * FROM categories WHERE id=$1', [id])
    if (!found) throw new Error(`Categories with id of ${id} does't exist`)
    const { rowCount: deleted } = await pgPool.query('DELETE FROM categories WHERE id=$1 RETURNING *', [id])
    if (deleted)
        res.status(200).json({ success: true, message: `Category with id of ${id} was deleted` });
})