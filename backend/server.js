// backend/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';

import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// 1) ENV + DB
dotenv.config();
await connectDB();

// 2) APP INIT
const app = express();
app.use(express.json());

// 3) SUPER SIMPLE CORS  ✅
// For now: allow all origins (localhost + vercel + render sab)
// later jab deployment stable ho jaye tab tighten kar sakte ho
app.use(
  cors({
    origin: true, // reflect request origin
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
    ],
  })
);
// Preflight ke liye
// app.options('*', cors());

// 4) LOGGING
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// 5) HEALTH CHECK
app.get('/', (req, res) => {
  res.send('API is running');
});

// 6) UNSPLASH IMAGE PROXY (no node-fetch import, Node 18+ global fetch use)
app.get('/img/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const w = Number(req.query.w) || 900;
    const upstream = `https://unsplash.com/photos/${id}/download?force=true&w=${w}`;

    const r = await fetch(upstream, { redirect: 'follow' });
    if (!r.ok) return res.status(502).send('Upstream error');

    const contentType = r.headers.get('content-type') || 'image/jpeg';
    res.set('Content-Type', contentType);
    res.set('Cache-Control', 'public, max-age=31536000, immutable');

    const buf = Buffer.from(await r.arrayBuffer());
    return res.send(buf);
  } catch (err) {
    console.error('IMG proxy error:', err);
    res.status(500).send('Image proxy failed');
  }
});

// 7) API ROUTES
app.use('/api/users', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);

// 8) ERROR HANDLERS
app.use(notFound);
app.use(errorHandler);

// 9) START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
