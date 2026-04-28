// frontend/src/pages/Cart.jsx
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

// runtime base (localhost vs production) — used to prefix relative image paths
const IMG_BASE = import.meta.env.PROD
  ? 'https://click-and-cart-j738.onrender.com'
  : 'http://localhost:5000';

export default function Cart() {
  const { items, removeFromCart, updateQty, totalPrice } = useCart();
  const shipping = items.length > 0 ? 49 : 0;
  const total = Number(totalPrice || 0) + Number(shipping || 0);

  if (!items || items.length === 0)
    return (
      <section className="cart-empty container-sm">
        <img src="/images/empty-cart.svg" alt="Empty cart" />
        <h2>Your cart is empty</h2>
        <p>Looks like you haven’t added anything yet.</p>
        <Link to="/" className="btn-primary">Start Shopping</Link>
      </section>
    );

  return (
    <section className="cart container">
      <div className="cart-items">
        <h2>Shopping Cart</h2>
        <ul>
          {items.map((i) => (
            <li key={i._id}>
              <img
                src={i.image && (i.image.startsWith('http') ? i.image : `${IMG_BASE}${i.image}`)}
                alt={i.name}
                onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/300x300?text=No+Image'; }}
              />
              <div className="info">
                <h3>{i.name}</h3>
                <p className="muted">₹{Number(i.price || 0)} • item id: {i._id}</p>
                <button
                  className="btn-remove"
                  onClick={() => removeFromCart(i._id)}
                >
                  Remove
                </button>
              </div>
              <div className="qty-box">
                <span>Qty:</span>
                <input
                  type="number"
                  value={i.qty}
                  min="1"
                  onChange={(e) => {
                    const v = parseInt(e.target.value||'0', 10);
                    if (Number.isNaN(v) || v < 1) return;
                    updateQty(i._id, v);
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <aside className="cart-summary">
        <h3>Order Summary</h3>
        <div className="line"><span>Items:</span><span>₹{Number(totalPrice || 0).toFixed(2)}</span></div>
        <div className="line"><span>Shipping:</span><span>₹{Number(shipping).toFixed(2)}</span></div>
        <div className="line total"><span>Total:</span><span>₹{Number(total).toFixed(2)}</span></div>
        <Link to="/checkout" className="btn-primary wide">Checkout</Link>
      </aside>
    </section>
  );
}
