// frontend/src/components/ProductCard.jsx
import { Link } from 'react-router-dom';

// runtime base (localhost vs production)
const IMG_BASE = import.meta.env.PROD
  ? 'https://click-and-cart-j738.onrender.com'
  : 'http://localhost:5000';

export default function ProductCard({ p }) {
  return (
    <article className="product-card">
      <Link to={`/product/${p._id}`} className="thumb-wrap">
        <img
          src={`${IMG_BASE}${p.image}`}
          alt={p.name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/300x300?text=No+Image';
          }}
        />
      </Link>

      <div className="card-body">
        <Link to={`/product/${p._id}`} className="product-title">
          {p.name}
        </Link>
        <div className="muted small">
          {p.brand} • {p.category}
        </div>
        <div className="card-footer">
          <div className="price">₹{p.price}</div>
          <Link to={`/product/${p._id}`} className="btn-sm">
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
