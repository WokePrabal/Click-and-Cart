import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaBars, FaSearch } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

export default function Navbar(){
  const { user } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const qty = items.reduce((s,i)=>s + Number(i.qty || 0), 0);
  const [q, setQ] = useState('');

  const onSearch = (e) => {
    e.preventDefault();
    const term = (q || '').trim();
    if (!term) return;
    navigate(`/search?q=${encodeURIComponent(term)}`);
    // optional: clear input -> setQ('');
  };

  return (
    <header className="site-header">
      <div className="container header-inner">
        <div className="brand">
          <Link to="/" className="brand-link">
            <span className="brand-mark">C&amp;C</span>
            <span className="brand-text">Click <strong>&amp;</strong> Cart</span>
          </Link>
        </div>

        <form className="search-wrap" onSubmit={onSearch} role="search">
          <input
            className="search-input"
            placeholder="Search products, categories..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search products"
          />
          <button className="search-btn" aria-label="Search" type="submit"><FaSearch/></button>
        </form>

        <nav className="nav-actions">
          <Link to="/cart" className="cart-btn" title="Cart">
            <FaShoppingCart/>
            <span className="cart-count">{qty}</span>
          </Link>

          {user ? (
            <>
              <Link to="/orders" className="link">{user.name.split(' ')[0]}</Link>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-outline">Login</Link>
              <Link to="/register" className="btn-primary">Create account</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
