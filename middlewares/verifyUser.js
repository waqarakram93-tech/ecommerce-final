import jwt from 'jsonwebtoken';
import pgPool from '../db/pgPool.js';
import asyncHandler from './asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';

const verifyUser = asyncHandler(async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) throw new ErrorResponse('Unauthorized', 401);
    const { id } = jwt.verify(authorization, process.env.JWT_SECRET);
    const { rowCount, rows } = await pgPool.query(`SELECT  u.id, u.role, ud.first_name AS firstname,  ud.last_name AS lastname, u.email, ud.address, ud.postcode, ud.city, ud.phone
                                                  FROM users AS u
                                                  LEFT JOIN user_details AS ud
                                                  ON u.id = ud.user_id
                                                  WHERE u.id = $1
                                                  `, [id])
    if (!rowCount) throw new ErrorResponse('User does not exist', 404);
    req.user = rows[0];

    next();
});

export default verifyUser;