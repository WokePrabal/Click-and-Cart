// frontend/src/context/CartContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem('cartItems');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(items));
    } catch {}
  }, [items]);

  const addToCart = (product, qty = 1) => {
    const normalized = {
      _id: product._id || product.product || product.id || String(Math.random()),
      name: product.name || product.title || 'Item',
      image: product.image || product.img || '/images/placeholder.png',
      price: Number(product.price || 0),
      countInStock: Number(product.countInStock || product.stock || 0)
    };

    setItems(prev => {
      const exists = prev.find(i => i._id === normalized._id);
      if (exists) {
        return prev.map(i =>
          i._id === normalized._id
            ? { ...i, qty: Math.min((i.qty || 0) + qty, normalized.countInStock || 999) }
            : i
        );
      }
      return [...prev, { ...normalized, qty: Math.max(1, qty) }];
    });
  };

  const updateQty = (id, qty) => {
    const q = Number(qty || 0);
    if (Number.isNaN(q) || q < 1) return;
    setItems(prev => prev.map(i => (i._id === id ? { ...i, qty: q } : i)));
  };

  const removeFromCart = id => {
    setItems(prev => prev.filter(i => i._id !== id));
  };

  const clearCart = () => setItems([]);

  const totalPrice = useMemo(
    () =>
      items.reduce((sum, it) => {
        const price = Number(it.price || 0);
        const qty = Number(it.qty || 0);
        if (Number.isNaN(price) || Number.isNaN(qty)) return sum;
        return sum + price * qty;
      }, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{ items, addToCart, updateQty, removeFromCart, clearCart, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

export default CartContext;
