import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import asyncHandler from '../middlewares/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import pgPool from '../db/pgPool.js';

const generateToken = (data, secret) => jwt.sign(data, secret, { expiresIn: '1800s' });

export const signUp = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        throw new ErrorResponse('All fields are required', 400);
    const found = await pgPool.query('SELECT email FROM users WHERE email= $1', [email])
    if (found.rows.length > 0) throw new ErrorResponse('Email is already taken', 403);
    const hashPassword = await bcrypt.hash(password.toString(), 5);
    const { rows } = await pgPool.query('INSERT INTO users (email, password) VALUES($1, $2)RETURNING * ', [email, hashPassword])
    const token = generateToken({ id: rows[0].id }, process.env.JWT_SECRET);
    res.status(200).json({ token });
});

export const signIn = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) throw new ErrorResponse('Email and password are required', 400);
    const found = await pgPool.query('SELECT * FROM users WHERE email= $1', [email])
    if (!found.rows.length) throw new ErrorResponse('User does not exist', 404);
    const match = await bcrypt.compare(password, found.rows[0].password);
    if (!match) throw new ErrorResponse('Password is not correct', 401);
    const token = generateToken({ id: found.rows[0].id }, process.env.JWT_SECRET);
    res.status(200).json({ token });
});

export const getUserInfo = asyncHandler(async (req, res) => res.status(200).json(req.user));

//export const updateUserInfo = asyncHandler(async (req, res) => res.status(200).json(req.user));


export const updateUserInfo = asyncHandler(async (req, res) => {
    const { user } = req
    const { firstname, lastname, address, postcode, city, phone } = req.body;
    if (!firstname || !lastname || !address || !postcode || !city || !phone)
        throw new ErrorResponse('All fields are required', 400);
    const values = [user.id, firstname, lastname, address, postcode, city, phone]
    await pgPool.query('DELETE FROM user_details WHERE user_id = $1', [user.id])
    const { rows } = await pgPool.query('INSERT INTO user_details(user_id, first_name , last_name, address, postcode, city, phone) VALUES($1, $2, $3, $4, $5, $6, $7)RETURNING *', values)

    res.status(200).json(rows[0]);
});

