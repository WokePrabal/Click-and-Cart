import { useState } from 'react';
import { useCart } from '../context/CartContext';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Checkout(){
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [shipping, setShipping] = useState({ fullName:'', address:'', city:'', postalCode:'', country:'India', phone:'' });
  const [payment, setPayment] = useState('COD');

  const next = () => setStep(s=>Math.min(4,s+1));
  const prev = () => setStep(s=>Math.max(1,s-1));
// assume useCart gives items array and totalPrice number
const placeOrder = async () => {
  try {
    // defensive checks
    if (!items || items.length === 0) {
      return alert('Cart is empty');
    }

    // compute numeric prices on frontend (numbers only)
    const itemsPrice = Number(items.reduce((sum, it) => {
      const price = Number(it.price || 0);
      const qty = Number(it.qty || 0);
      return sum + ( (Number.isNaN(price) ? 0 : price) * (Number.isNaN(qty) ? 0 : qty) );
    }, 0));

    const shippingPrice = itemsPrice > 0 ? 49 : 0; // example
    const taxPrice = Number((itemsPrice * 0.0).toFixed(2)); // change tax percent if needed
    const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

    // build orderItems exactly as backend expects:
    // [{ name, qty, image, price, product: productId }]
    const orderItems = items.map(it => {
      // ensure id exists
      const productId = it._id || it.product || it.id;
      return {
        name: it.name || it.title || 'Item',
        qty: Number(it.qty || 1),
        image: it.image || it.img || '',
        price: Number(it.price || 0),
        product: String(productId) // MUST be product id (string)
      };
    });

    // validate before sending
    if (orderItems.some(oi => !oi.product)) {
      return alert('Order build failed: product id missing for one item.');
    }

    const body = {
      orderItems,
      shippingAddress: shipping,   // your shipping state
      paymentMethod: payment,      // your payment state
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice
    };

    // show loading/progress
    // call backend
    const { data } = await api.post('/orders', body);
    // clear local cart & navigate
    localStorage.removeItem('cartItems');
    // if you maintain cart context, call clearCart() as well
    clearCart && clearCart();
    alert('Order placed: ' + data._id);
    navigate(`/orders/${data._id}`);
  } catch (err) {
    console.error('Place order error', err);
    alert(err.response?.data?.message || err.message || 'Order failed');
  }
};


  return (
    <div className="container">
      <h2>Checkout</h2>
      <div className="checkout-steps">
        <div className={`step ${step===1? 'active':''}`}>1. Shipping</div>
        <div className={`step ${step===2? 'active':''}`}>2. Payment</div>
        <div className={`step ${step===3? 'active':''}`}>3. Summary</div>
        <div className={`step ${step===4? 'active':''}`}>4. Confirm</div>
      </div>

      {step===1 && (
        <div className="checkout-step">
          <h3>Shipping Address</h3>
          <input value={shipping.fullName} onChange={e=>setShipping({...shipping, fullName:e.target.value})} placeholder="Full name" />
          <input value={shipping.address} onChange={e=>setShipping({...shipping, address:e.target.value})} placeholder="Address" />
          <input value={shipping.city} onChange={e=>setShipping({...shipping, city:e.target.value})} placeholder="City" />
          <input value={shipping.postalCode} onChange={e=>setShipping({...shipping, postalCode:e.target.value})} placeholder="Postal Code" />
          <input value={shipping.country} onChange={e=>setShipping({...shipping, country:e.target.value})} placeholder="Country" />
          <input value={shipping.phone} onChange={e=>setShipping({...shipping, phone:e.target.value})} placeholder="Phone" />
          <div style={{marginTop:12}}>
            <button className="btn-outline" onClick={prev} disabled>Back</button>
            <button className="btn-primary" onClick={next}>Continue</button>
          </div>
        </div>
      )}

      {step===2 && (
        <div>
          <h3>Payment</h3>
          <select value={payment} onChange={e=>setPayment(e.target.value)}>
            <option>COD</option>
            <option>Card (mock)</option>
          </select>
          <div style={{marginTop:12}}>
            <button className="btn-outline" onClick={prev}>Back</button>
            <button className="btn-primary" onClick={next}>Continue</button>
          </div>
        </div>
      )}

      {step===3 && (
        <div>
          <h3>Order Summary</h3>
          <div>Items: ₹{totalPrice.toFixed(2)}</div>
          <div>Shipping: ₹{items.length? 49 : 0}</div>
          <div>Total: ₹{(totalPrice + (items.length?49:0)).toFixed(2)}</div>
          <div style={{marginTop:12}}>
            <button className="btn-outline" onClick={prev}>Back</button>
            <button className="btn-primary" onClick={()=>setStep(4)}>Place Order</button>
          </div>
        </div>
      )}

      {step===4 && (
        <div>
          <h3>Confirm & Pay</h3>
          <div>Your payment method: {payment}</div>
          <div style={{marginTop:12}}>
            <button className="btn-outline" onClick={prev}>Back</button>
            <button className="btn-primary" onClick={placeOrder}>Confirm Order</button>
          </div>
        </div>
      )}
    </div>
  );
}




// new code 


// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// export default function Checkout(){
//   const [step, setStep] = useState(1);
//   const [address, setAddress] = useState({ name:'', line:'', city:'', postal:'' });
//   const navigate = useNavigate();

//   const next = () => setStep(s => Math.min(4, s+1));
//   const back = () => setStep(s => Math.max(1, s-1));

//   return (
//     <div className="container checkout-page">
//       <h1>Checkout</h1>
//       <div className="steps">
//         <div className={`step ${step===1? 'active':''}`}>1. Shipping</div>
//         <div className={`step ${step===2? 'active':''}`}>2. Payment</div>
//         <div className={`step ${step===3? 'active':''}`}>3. Summary</div>
//         <div className={`step ${step===4? 'active':''}`}>4. Confirm</div>
//       </div>

//       <div className="panel">
//         {step===1 && (
//           <div className="shipping">
//             <label>Full name<input value={address.name} onChange={e=>setAddress({...address, name:e.target.value})} /></label>
//             <label>Address<input value={address.line} onChange={e=>setAddress({...address, line:e.target.value})} /></label>
//             <label>City<input value={address.city} onChange={e=>setAddress({...address, city:e.target.value})} /></label>
//             <label>Postal code<input value={address.postal} onChange={e=>setAddress({...address, postal:e.target.value})} /></label>
//             <div className="row-actions">
//               <button className="btn-outline" onClick={()=>navigate(-1)}>Back</button>
//               <button className="btn-primary" onClick={next}>Continue</button>
//             </div>
//           </div>
//         )}

//         {step===2 && (
//           <div className="payment">
//             <h3>Payment</h3>
//             <p>Choose payment method</p>
//             <select defaultValue="cod">
//               <option value="cod">Cash on Delivery (COD)</option>
//               <option value="razor">Razorpay (demo)</option>
//             </select>
//             <div className="row-actions">
//               <button className="btn-outline" onClick={back}>Back</button>
//               <button className="btn-primary" onClick={next}>Continue</button>
//             </div>
//           </div>
//         )}

//         {step===3 && (
//           <div className="summary">
//             <h3>Order Summary</h3>
//             <p>Items: 3</p>
//             <p>Total: ₹8999</p>
//             <div className="row-actions">
//               <button className="btn-outline" onClick={back}>Back</button>
//               <button className="btn-primary" onClick={next}>Confirm</button>
//             </div>
//           </div>
//         )}

//         {step===4 && (
//           <div className="confirm">
//             <h3>All set!</h3>
//             <p>Click place order to complete.</p>
//             <div className="row-actions">
//               <button className="btn-outline" onClick={back}>Back</button>
//               <button className="btn-primary" onClick={()=>alert('Order placed (demo)')}>Place Order</button>
//             </div>
//           </div>
//         )}
//       </div>

//       <style>{`
//         .steps{ display:flex; gap:8px; margin:12px 0 }
//         .step{ padding:8px 12px; border-radius:8px; background:#f1f5f9 }
//         .step.active{ background:linear-gradient(90deg,#60a5fa,#3b82f6); color:white; transform:translateY(-3px) }
//         .panel{ margin-top:16px; border:1px solid #eef2f7; padding:18px; border-radius:10px }
//         label{ display:block; margin-bottom:10px }
//         input, select{ width:100%; padding:8px; border-radius:8px; border:1px solid #e2e8f0 }
//         .row-actions{ display:flex; justify-content:space-between; margin-top:16px }
//         .btn-primary{ background:#06b6d4; color:white; padding:8px 14px; border-radius:8px; border:0 }
//         .btn-outline{ border:1px solid #cbd5e1; padding:8px 14px; border-radius:8px; background:white }
//       `}</style>
//     </div>
//   )
// }