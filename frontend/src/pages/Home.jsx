import { useEffect, useState } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import Hero from '../components/Hero';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError('');

        const { data } = await api.get('/api/products');

        if (mounted) {
          setProducts(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Failed to load products:', err);
        if (mounted) {
          setError('Failed to load products. Please try again.');
          setProducts([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <Hero />

      <div id="catalog" className="grid">
        {loading && <p>Loading products...</p>}

        {!loading && error && (
          <p className="error-text">{error}</p>
        )}

        {!loading && !error && products.length === 0 && (
          <p>No products available.</p>
        )}

        {!loading && !error &&
          products.map((p) => (
            <ProductCard key={p._id} p={p} />
          ))
        }
      </div>
    </>
  );
}
