import pgPool from '../db/pgPool.js';
import asyncHandler from '../middlewares/asyncHandler.js'
import ErrorResponse from '../utils/ErrorResponse.js'


export const getAllProducts = asyncHandler(async (req, res) => {
    const { text, cat } = req.query
    // http://localhost:5000/products?text=64gb&cat=smartphones
    const search = []
    if (text) {
        search.push(`p.product_name LIKE '${text} OR p.product_description LIKE '%${text}%'`)
    }
    if (cat) {
        search.push(`cat.name = ${cat} OR sub.name = '${cat}`)
    }

    console.log(search)

    // convert serach array into a valid WHERE statement

    /* 
    [
    "p.product_name LIKE '%64gb%' OR p.product_description LIKE '%64gb%'",
    "cat.name = smartphones OR sub.name = 'smartphones"
    ]
    */
    // WHERE p.product_name LIKE '64gb OR p.product_description LIKE '%64gb%' AND smartphones OR sub.name = 'smartphones
    const { rowCount: total, rows: products } = await pgPool.query(`
                                                                    SELECT p.product_name AS name, 
                                                                    p.product_description AS description, 
                                                                    p.price, 
                                                                    p.stock,
                                                                    sub.id As "subcategoryId",
                                                                    cat.id As "categoryId",
                                                                    sub.name AS subcategory, 
                                                                    cat.name AS category ,
                                                                    pimg.id As "pimageId",
                                                                    pimg.url AS productimage
                                                                        FROM products AS p
                                                                        JOIN subcategories AS sub
                                                                        ON p.subcat_id = sub.id
                                                                        JOIN categories AS cat
                                                                        ON sub.category_id = cat.id
                                                                        LEFT JOIN product_images AS pimg
                                                                        ON p.id = pimg.product_id
                                                                        
                                                                `)
    res.status(201).json({ total, products });
})
export const getSingleProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    console.log(id)
    const { rows, rowCount } = await pgPool.query(
        `SELECT p.product_name AS name, 
    p.product_description AS description, 
    p.price, 
    p.stock,
    sub.id As "subcategoryId",
    cat.id As "categoryId",
    sub.name AS subcategory, 
    cat.name AS category ,
    pimg.id As "pimageId",
    pimg.url AS productimage
        FROM products AS p
        JOIN subcategories AS sub
        ON p.subcat_id = sub.id
        JOIN categories AS cat
        ON sub.category_id = cat.id
        LEFT JOIN product_images AS pimg
        ON p.id = pimg.product_id 
        WHERE p.id=$1;`, [id])
    if (!rowCount) throw new ErrorResponse(`product with id of ${id} not found`, 404);
    res.status(200).json(rows[0]);

})
export const createProduct = asyncHandler(async (req, res) => {

    const { role } = req.user;
    if (role !== 'admin') throw new ErrorResponse('Unauthorized', 401)
    const { subcat_id, product_name, product_description, price, stock } = req.body;
    if (!subcat_id || !product_name || !product_description || !price || !stock)
        throw new ErrorResponse('All fields are required', 400);
    const { rowCount: found } = await pgPool.query('SELECT * FROM products WHERE product_name=$1', [product_name])
    if (found) throw new ErrorResponse('product already exists')
    const values = [subcat_id, product_name, product_description, price, stock]
    const { rowCount: confirmInsert, rows } = await pgPool.query('INSERT INTO products(subcat_id, product_name, product_description, price, stock) VALUES($1, $2, $3, $4, $5)RETURNING *', values)
    if (confirmInsert) {
        const { rows: newProduct } = await pgPool.query(
            `SELECT p.product_name AS name, 
        p.product_description AS description, 
        p.price, 
        p.stock,
        sub.id As "subcategoryId",
        cat.id As "categoryId",
        sub.name AS subcategory, 
        cat.name AS category ,
        pimg.id As "pimageId",
        pimg.url AS productimage
            FROM products AS p
            JOIN subcategories AS sub
            ON p.subcat_id = sub.id
            JOIN categories AS cat
            ON sub.category_id = cat.id
            LEFT JOIN product_images AS pimg
            ON p.id = pimg.product_id 
            WHERE p.id=$1;`, [rows[0].id])
        res.status(201).json(newProduct[0]);
    }
})

export const updateProduct = asyncHandler(async (req, res) => {
    const { role } = req.user;
    if (role !== 'admin') throw new ErrorResponse('Unauthorized', 401)
    const { id } = req.params;
    const { rowCount: found } = await pgPool.query('SELECT * FROM products WHERE id=$1', [id])
    if (!found) throw new ErrorResponse(`product with id of ${id} does't exist`)
    const { subcat_id, product_name, product_description, price, stock } = req.body;
    if (!subcat_id || !product_name || !product_description || !price || !stock)
        throw new ErrorResponse('All fields are required', 400);
    const values = [subcat_id, product_name, product_description, price, stock]
    const { rowCount: confirmInsert, rows } = await pgPool.query('INSERT INTO products(subcat_id, product_name, product_description, price, stock) VALUES($1, $2, $3, $4, $5)RETURNING *', values)
    if (confirmInsert) {
        const { rows: newProduct } = await pgPool.query(
            `SELECT p.product_name AS name, 
        p.product_description AS description, 
        p.price, 
        p.stock,
        sub.id As "subcategoryId",
        cat.id As "categoryId",
        sub.name AS subcategory, 
        cat.name AS category ,
        pimg.id As "pimageId",
        pimg.url AS productimage
            FROM products AS p
            JOIN subcategories AS sub
            ON p.subcat_id = sub.id
            JOIN categories AS cat
            ON sub.category_id = cat.id
            LEFT JOIN product_images AS pimg
            ON p.id = pimg.product_id 
            WHERE p.id=$1;`, [rows[0].id])
        res.status(201).json(newProduct[0]);
    }

});

export const deleteProduct = asyncHandler(async (req, res) => {
    const { role } = req.user;
    if (role !== 'admin') throw new ErrorResponse('Unauthorized', 401)
    const { id } = req.params;
    const { rowCount: found } = await pgPool.query('SELECT * FROM products WHERE id=$1', [id])
    if (!found) throw new Error(`products with id of ${id} does't exist`)

    const { rowCount: deleted } = await pgPool.query('DELETE FROM products WHERE id=$1 RETURNING *', [id])
    if (deleted)
        res.status(200).json({ success: true, message: `product with id of ${id} was deleted` });

})