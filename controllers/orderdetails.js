import pgPool from '../db/pgPool.js';
import asyncHandler from '../middlewares/asyncHandler.js'
import ErrorResponse from '../utils/ErrorResponse.js'


export const getAllOrdersDetails = asyncHandler(async (req, res) => {
    const { rowCount: total, rows: orderdetails } = await pgPool.query(`
    SELECT o.product_qty AS quantity, 
    o.sub_total AS subtotal, 
    
    p.id As "productId",
    pimg.id As "productimageId",
ord.id As "orderId",
pimg.id As "pimageId",
ord.order_number AS ordernumber,
ord.order_date AS date,
ord.order_total AS total,
    p.product_name AS name, 
    p.price AS price ,
   pimg.url AS productimage

        FROM order_details AS o
        JOIN products AS p
        ON o.product_id = p.id
        JOIN product_images AS pimg
        ON p.id = pimg.product_id
JOIN orders AS ord
ON o.order_id = ord.id
        
        
`)
    res.status(201).json({ total, orderdetails });
})
export const getSingleOrderDetail = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { rows, rowCount } = await pgPool.query(`
    SELECT o.product_qty AS quantity, 
    o.sub_total AS subtotal, 
    
    p.id As "productId",
    pimg.id As "productimageId",
ord.id As "orderId",
pimg.id As "pimageId",
ord.order_number AS ordernumber,
ord.order_date AS date,
ord.order_total AS total,
    p.product_name AS name, 
    p.price AS price ,
   pimg.url AS productimage

        FROM order_details AS o
        JOIN products AS p
        ON o.product_id = p.id
        JOIN product_images AS pimg
        ON p.id = pimg.product_id
JOIN orders AS ord
ON o.order_id = ord.id
        
        
WHERE o.id=$1;`, [id])
    if (!rowCount) throw new ErrorResponse(`orderdetail with id of ${id} not found`, 404);
    res.status(200).json(rows[0]);

})
export const createOrderDetail = asyncHandler(async (req, res) => {
    const { id: user } = req.user;
    const { id } = req.params;
    const { order_id, product_id, product_qty, sub_total } = req.body;
    if (!order_id || !product_id || !product_qty || !sub_total || !user)
        throw new ErrorResponse('All fields are required', 400);
    const { rowCount: found } = await pgPool.query('SELECT * FROM orders WHERE id=$1', [id])
    if (found) throw new ErrorResponse('order_details already exists')
    const values = [order_id, product_id, product_qty, sub_total]
    const { rows } = await pgPool.query('INSERT INTO order_details(order_id, product_id, product_qty, sub_total) VALUES($1, $2, $3, $4)RETURNING *', values)


    res.status(201).json(rows[0]);

})
export const updateOrderDetail = asyncHandler(async (req, res) => {
    const { id: user } = req.user;
    const { id } = req.params;
    const { rowCount: found } = await pgPool.query('SELECT * FROM order_details WHERE id=$1', [id])
    if (!found) throw new ErrorResponse(`orderdetail with id of ${id} does't exist`)

    const { order_id, product_id, product_qty, sub_total } = req.body;
    if (!order_id || !product_id || !product_qty || !sub_total || !user)
        throw new ErrorResponse('All fields are required')
    const values = [order_id, product_id, product_qty, sub_total, id]
    const { rows } = await pgPool.query('UPDATE order_details SET order_id=$1, product_id=$2, product_qty=$3, sub_total=$4  WHERE id=$5 RETURNING *', values)
    res.status(200).json(rows[0]);

});

export const deleteOrderDetail = asyncHandler(async (req, res) => {

    const { id } = req.params;
    const { rowCount: found } = await pgPool.query('SELECT * FROM order_details WHERE id=$1', [id])
    if (!found) throw new Error(`orderdetail with id of ${id} does't exist`)

    const { rowCount: deleted } = await pgPool.query('DELETE FROM order_details WHERE id=$1 RETURNING *', [id])
    if (deleted)
        res.status(200).json({ success: true, message: `order with id of ${id} was deleted` });

})