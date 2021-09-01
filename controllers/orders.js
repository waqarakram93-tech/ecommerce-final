import pgPool from '../db/pgPool.js';
import asyncHandler from '../middlewares/asyncHandler.js'
import ErrorResponse from '../utils/ErrorResponse.js'


export const getAllOrders = asyncHandler(async (req, res) => {
    const { rowCount: total, rows: orders } = await pgPool.query('SELECT * FROM orders;')
    res.status(201).json({ total, orders });
})
export const getSingleOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { rows, rowCount } = await pgPool.query('SELECT * FROM orders WHERE id=$1;', [id])
    if (!rowCount) throw new ErrorResponse(`order with id of ${id} not found`, 404);
    res.status(200).json(rows[0]);

})
export const createOrder = asyncHandler(async (req, res) => {
    const { id: user } = req.user;
    console.log('user= ', user)
    //const userId = req.user.id
    const { id } = req.params;
    const { user_details_id, order_number, order_date, order_total } = req.body;
    if (!user_details_id || !user || !order_number || !order_date || !order_total)
        throw new ErrorResponse('All fields are required', 400);
    const { rowCount: found } = await pgPool.query('SELECT * FROM orders WHERE id=$1', [id])
    if (found) throw new ErrorResponse('order already exists')
    const values = [user_details_id, order_number, order_date, order_total]
    const { rows } = await pgPool.query('INSERT INTO orders(user_details_id, order_number, order_date, order_total) VALUES($1, $2, $3, $4)RETURNING *', values)


    res.status(201).json(rows[0]);

})
export const updateOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { id: user } = req.user;
    //console.log('user= ', user)
    const { rowCount: found } = await pgPool.query('SELECT * FROM orders WHERE id=$1', [id])
    if (!found) throw new ErrorResponse(`order with id of ${id} does't exist`)

    const { user_details_id, order_number, order_date, order_total } = req.body;
    if (!user_details_id || !user || !order_number || !order_date || !order_total)
        throw new ErrorResponse('All fields are required')
    const values = [user_details_id, order_number, order_date, orderTotal, id]
    const { rows } = await pgPool.query('UPDATE orders SET user_details_id=$1, order_number=$2, order_date=$3, order_total=$4  WHERE id=$5 RETURNING *', values)
    res.status(200).json(rows[0]);

});

export const deleteOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;
    //const { id: user } = req.user;
    //console.log('user= ', user)
    const { rowCount: found } = await pgPool.query('SELECT * FROM orders WHERE id=$1', [id])
    if (!found) throw new Error(`order with id of ${id} does't exist`)

    const { rowCount: deleted } = await pgPool.query('DELETE FROM orders WHERE id=$1 RETURNING *', [id])
    if (deleted)
        res.status(200).json({ success: true, message: `order with id of ${id} was deleted` });

})