
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

export default function OrderDetails(){
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    let mounted = true;
    (async ()=>{
      try{
        const { data } = await api.get(`/orders/${id}`);
        if(!mounted) return;
        setOrder(data);
      }catch(e){ console.error(e) }
      finally{ if(mounted) setLoading(false) }
    })();
    return ()=> mounted = false;
  },[id]);

  if(loading) return <div className="container"><p>Loading...</p></div>;
  if(!order) return <div className="container"><p>Order not found</p></div>;

  return (
    <div className="container order-details">
      <h1>Order #{order._id.slice(-8)}</h1>
      <div className="row">
        <div className="col">
          <h3>Shipping</h3>
          <p>{order.shippingAddress?.fullName}</p>
          <p>{order.shippingAddress?.address}, {order.shippingAddress?.city} - {order.shippingAddress?.postalCode}</p>
          <p>{order.isDelivered? `Delivered on ${new Date(order.deliveredAt).toLocaleString()}` : 'Not delivered'}</p>
        </div>

        <div className="col">
          <h3>Payment</h3>
          <p>Method: {order.paymentMethod}</p>
          <p>{order.isPaid? `Paid on ${new Date(order.paidAt).toLocaleString()}`: 'Not paid'}</p>
        </div>

        <div className="col full">
          <h3>Items</h3>
          <div className="items-list">
            {order.orderItems.map(it=> (
              <div className="item" key={it._id || it.product}>
                <img src={it.image} alt={it.name} width={64} height={64} />
                <div className="meta">
                  <div className="name">{it.name}</div>
                  <div className="qty">Qty: {it.qty}</div>
                </div>
                <div className="price">₹{it.price}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .row{ display:grid; grid-template-columns: 1fr 1fr; gap:20px }
        .col.full{ grid-column:1 / -1 }
        .items-list .item{ display:flex; gap:12px; align-items:center; padding:10px 0; border-bottom:1px dashed #eef2f7 }
        .item img{ border-radius:8px }
      `}</style>
    </div>
  )
}