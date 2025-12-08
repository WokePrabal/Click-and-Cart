// frontend/src/pages/Orders.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // api.get will automatically attach token from localStorage (see api/axios.js)
      const { data } = await api.get('/orders/myorders');
      // Normalize to array if server used a wrapper
      const items = Array.isArray(data) ? data : (Array.isArray(data?.orders) ? data.orders : []);
      setOrders(items);
    } catch (err) {
      console.error("[Orders] fetch error:", err);
      const status = err?.response?.status;
      if (status === 401) {
        // token missing/invalid — user must re-login
        try { localStorage.removeItem('user'); } catch {}
        // navigate to login (replace) so back button doesn't return to protected page
        navigate('/login', { replace: true });
        return;
      }
      alert('Could not fetch orders. See console for details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!mounted) return;
      await fetchOrders();
    })();
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <div className="container"><p>Loading orders...</p></div>;

  return (
    <div className="container orders-list">
      <h1>Your Orders</h1>
      <div className="grid-orders">
        {Array.isArray(orders) && orders.length === 0 && <p>No orders found.</p>}
        {Array.isArray(orders) && orders.map((o) => (
          <div className="order-card" key={o._id}>
            <div className="top">
              <div className="id">Order #{o._id?.slice(-6)}</div>
              <div className="status">{o.isPaid ? 'Paid' : 'Processing'}</div>
            </div>
            <div className="items">Items: {o.orderItems?.length || 0}</div>
            <div className="total">₹{o.totalPrice}</div>
            <div className="actions">
              <button className="btn-outline" onClick={() => navigate(`/orders/${o._id}`)}>View details</button>
              <button className="btn-danger" onClick={() => {
                if (!confirm('Cancel this order permanently?')) return;
                api.delete(`/orders/${o._id}`).then(() => {
                  setOrders(prev => prev.filter(x => x._id !== o._id));
                  alert('Order cancelled');
                }).catch(e => {
                  console.error('[Orders] cancel error', e);
                  if (e?.response?.status === 401) {
                    try { localStorage.removeItem('user'); } catch {}
                    navigate('/login', { replace: true });
                    return;
                  }
                  alert('Could not cancel order');
                });
              }}>Cancel</button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .grid-orders{ display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:14px }
        .order-card{ border:1px solid #e6edf3; padding:14px; border-radius:10px }
        .top{ display:flex; justify-content:space-between; align-items:center }
        .status{ background:#fff7ed; padding:6px 10px; border-radius:8px }
        .actions{ display:flex; gap:8px; margin-top:12px }
        .btn-outline{ padding:8px 10px; border-radius:8px; border:1px solid #cbd5e1 }
        .btn-danger{ background:#ef4444; color:white; padding:8px 10px; border-radius:8px; border:0 }
      `}</style>
    </div>
  );
}
