// backend/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import fetch from 'node-fetch';

import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();
await connectDB();

const app = express();

// -------- CORS PROPERLY CONFIGURED ----------
const allowedOrigins = [
  'http://localhost:5173',
  process.env.CORS_ORIGIN, // https://codealpha-task1-flame.vercel.app
].filter(Boolean); // remove undefined

app.use(
  cors({
    origin: (origin, cb) => {
      // allow no origin (like Postman) and allowed list
      if (!origin || allowedOrigins.includes(origin)) {
        return cb(null, true);
      }
      console.warn('Blocked by CORS:', origin);
      return cb(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
// --------------------------------------------

app.use(express.json());
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

// Unsplash proxy (optional)
app.get('/img/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const w = Number(req.query.w) || 900;
    const upstream = `https://unsplash.com/photos/${id}/download?force=true&w=${w}`;
    const r = await fetch(upstream, { redirect: 'follow' });
    if (!r.ok) return res.status(502).send('Upstream error');
    res.set('Content-Type', r.headers.get('content-type') || 'image/jpeg');
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    const buf = Buffer.from(await r.arrayBuffer());
    return res.send(buf);
  } catch (e) {
    console.error('IMG proxy error:', e.message);
    return res.status(500).send('Image proxy failed');
  }
});

app.get('/', (req, res) => res.send('API is running'));

app.use('/api/users', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/upload', uploadRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
