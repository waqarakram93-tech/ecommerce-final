import pool from '../db/mysql.js';


export const getAllCategories = async (req, res) => {
    const { rowCount: total, rows: users } = await pool.query('SELECT * FROM categories;')
    res.status(200).json({ total, users });
}
export const getSingleCategory = (req, res) => res.send('hello');
export const createCategory = (req, res) => res.send('hello');
export const updateCategory = (req, res) => res.send('hello');
export const deleteCategory = (req, res) => res.send('hello');