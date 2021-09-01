import pgPool from '../db/pgPool.js';
import asyncHandler from '../middlewares/asyncHandler.js'
import ErrorResponse from '../utils/ErrorResponse.js'


export const getAllsubCategory = asyncHandler(async (req, res) => {
    const { rowCount: total, rows: subcategories } = await pgPool.query('SELECT * FROM subcategories;')
    res.status(201).json({ total, subcategories });
})

export const getSinglesubCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { rows, rowCount } = await pgPool.query('SELECT * FROM subcategories WHERE id=$1;', [id])
    if (!rowCount) throw new ErrorResponse(`subcategory with id of ${id} not found`, 404);
    res.status(200).json(rows[0])
})

export const createsubCategory = asyncHandler(async (req, res) => {
    const { role } = req.user;
    if (role !== 'admin') throw new ErrorResponse('Unauthorized', 401)
    const { category_id, name } = req.body;
    if (!name || !category_id)
        throw new ErrorResponse('All fields are required', 400);
    const { rowCount: found } = await pgPool.query('SELECT * FROM subcategories WHERE name=$1', [name])
    if (found) throw new ErrorResponse('Subcategory already exists')
    const values = [category_id, name]
    const { rows } = await pgPool.query('INSERT INTO subcategories(category_id,name) VALUES($1, $2)RETURNING *', values)
    res.status(201).json(rows[0]);

})

export const updatesubCategory = asyncHandler(async (req, res) => {
    const { role } = req.user;
    if (role !== 'admin') throw new ErrorResponse('Unauthorized', 401)
    const { id } = req.params;
    const { rowCount: found } = await pgPool.query('SELECT * FROM subcategories WHERE id=$1', [id])
    if (!found) throw new ErrorResponse(`Subcategory with id of ${id} does't exist`)
    const { name, category_id } = req.body;
    if (!name || !category_id)
        throw new ErrorResponse('All fields are required')
    const values = [category_id, name, id]
    const { rows } = await pgPool.query('UPDATE subcategories SET category_id=$1, name=$2 WHERE id=$3 RETURNING *', values)
    res.status(200).json(rows[0]);

});

export const deletesubCategory = asyncHandler(async (req, res) => {
    const { role } = req.user;
    if (role !== 'admin') throw new ErrorResponse('Unauthorized', 401)
    const { id } = req.params;
    const { rowCount: found } = await pgPool.query('SELECT * FROM subcategories WHERE id=$1', [id])
    if (!found) throw new Error(`subcategories with id of ${id} does't exist`)

    const { rowCount: deleted } = await pgPool.query('DELETE FROM subcategories WHERE id=$1 RETURNING *', [id])
    if (deleted)
        res.status(200).json({ success: true, message: `subcategory with id of ${id} was deleted` });
})