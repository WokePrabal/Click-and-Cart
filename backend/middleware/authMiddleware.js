// backend/middleware/authMiddleware.js (modify protect)
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;
  const auth = req.headers.authorization || req.headers.Authorization;
  console.debug('[protect] Authorization header:', auth); // << DEBUG

  if (auth && auth.startsWith('Bearer ')) {
    token = auth.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.debug('[protect] decoded token id:', decoded.id); // << DEBUG
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        console.error('[protect] user not found for id', decoded.id);
        res.status(401);
        throw new Error('User not found');
      }
      next();
    } catch (err) {
      console.error('[protect] token verify error:', err.message);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    console.warn('[protect] no token provided');
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});
