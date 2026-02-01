import express from 'express';

const router = express.Router();

/**
 * GET /img/:id?w=900
 * Stable Unsplash image proxy (mobile safe)
 */
router.get('/img/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const w = Number(req.query.w) || 900;

    // ✅ Official Unsplash download endpoint
    const upstream = `https://unsplash.com/photos/${id}/download?force=true&w=${w}`;

    const response = await fetch(upstream, { redirect: 'follow' });

    if (!response.ok) {
      return res.status(404).send('Image not found');
    }

    const contentType =
      response.headers.get('content-type') || 'image/jpeg';

    // 🔥 1 YEAR CACHE
    res.setHeader(
      'Cache-Control',
      'public, max-age=31536000, immutable'
    );
    res.setHeader('Content-Type', contentType);

    const buffer = Buffer.from(await response.arrayBuffer());
    res.send(buffer);
  } catch (err) {
    console.error('Image proxy error:', err);
    res.status(500).send('Image proxy failed');
  }
});

export default router;
