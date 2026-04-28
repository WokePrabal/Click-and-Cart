import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

// runtime base (localhost vs production)
const IMG_BASE = import.meta.env.PROD
  ? 'https://click-and-cart-j738.onrender.com'
  : 'http://localhost:5000';

export default function Wishlist(){
  const [items, setItems] = useState([]);
  const { user } = useAuth();
  const { addToCart } = useCart();

  useEffect(()=>{ if (!user) return; (async ()=>{
    const { data } = await api.get('/wishlist');
    setItems(data);
  })(); }, [user]);

  const remove = async (id) => {
    await api.delete(`/wishlist/${id}`);
    setItems(items.filter(i=>i.product._id !== id));
  };

  const moveToCart = async (id) => {
    const { data } = await api.post('/wishlist/move-to-cart', { productId: id });
    // data.product is product object; add to cart
    addToCart(data.product, 1);
    // remove locally
    setItems(items.filter(i=>i.product._id !== id));
  };

  if (!user) return <div className="container"><p>Please login to view wishlist.</p></div>;
  if (!items.length) return <div className="container"><p>No items in wishlist.</p></div>;

  return (
    <div className="container">
      <h2>My Wishlist</h2>
      <div className="grid">
        {items.map(i => {
          const p = i.product;
          return (
            <div key={p._id} className="product-card">
              <a href={`/product/${p._id}`}>
                <img
                  src={p.image && (p.image.startsWith('http') ? p.image : `${IMG_BASE}${p.image}`)}
                  alt={p.name}
                  style={{height:180,objectFit:'cover',width:'100%'}}
                  onError={(e)=>{ e.currentTarget.src = 'https://via.placeholder.com/300x300?text=No+Image'; }}
                />
              </a>
              <div style={{padding:12}}>
                <h4>{p.name}</h4>
                <div style={{display:'flex',gap:8,marginTop:8}}>
                  <button className="btn-primary" onClick={()=>moveToCart(p._id)}>Move to cart</button>
                  <button className="btn-outline" onClick={()=>remove(p._id)}>Remove</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
