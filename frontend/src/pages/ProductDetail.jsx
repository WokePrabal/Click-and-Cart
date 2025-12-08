// // frontend/src/pages/ProductDetail.jsx
// import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import api from '../api/axios';
// import { useCart } from '../context/CartContext';
// import { useAuth } from '../context/AuthContext';

// export default function ProductDetail(){
//   const { id } = useParams();
//   const { addToCart } = useCart();
//   const { user } = useAuth();

//   const [p, setP] = useState(null);
//   const [qty, setQty] = useState(1);
//   const [loading, setLoading] = useState(true);

//   // review form state
//   const [formRating, setFormRating] = useState('');
//   const [formComment, setFormComment] = useState('');
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState('');

//   // fetch product (and reviews)
//   const fetchProduct = async () => {
//     try {
//       setLoading(true);
//       const { data } = await api.get(`/products/${id}`);
//       setP(data);
//       setQty(data.countInStock > 0 ? 1 : 0);
//     } catch (err) {
//       console.error('Product fetch error', err);
//       setP(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(()=>{
//     let mounted = true;
//     (async ()=>{
//       if (!mounted) return;
//       await fetchProduct();
//     })();
//     return ()=> mounted = false;
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [id]);

//   const onAdd = () => {
//     if (!p) return;
//     if (p.countInStock === 0) return alert('Out of stock');
//     addToCart(p, qty);
//     alert('Added to cart');
//   };

//   const submitReview = async (e) => {
//     e.preventDefault();
//     if (!user) return alert('Please login to submit a review');
//     if (!formRating) return alert('Please select a rating');
//     setSubmitting(true);
//     setError('');
//     try {
//       await api.post(`/products/${id}/reviews`, { rating: formRating, comment: formComment });
//       // clear form
//       setFormRating('');
//       setFormComment('');
//       // refresh product data to get updated reviews & rating
//       await fetchProduct();
//       alert('Review submitted');
//     } catch (err) {
//       console.error('Review submit error', err);
//       setError(err.response?.data?.message || 'Failed to submit review');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) return <div className="container"><p>Loading...</p></div>;
//   if (!p) return <div className="container"><p>Product not found.</p></div>;

//   // Helpers
//   const avgRating = p.rating ? Number(p.rating).toFixed(1) : '0.0';
//   const canReview = user && !(p.reviews || []).some(r => r.user && r.user.toString() === user._id);

//   return (
//     <div className="container product-detail-page">
//       <div className="detail">
//         <div className="gallery">
//           <div className="main-img">
//             <img src={p.image} alt={p.name} loading="lazy"/>
//           </div>

//           <div className="thumbs">
//             <button className="thumb active">
//               <img src={p.image} alt={p.name} loading="lazy" />
//             </button>
//           </div>
//         </div>

//         <div className="info">
//           <h1 className="product-name">{p.name}</h1>
//           <div className="muted small">{p.brand} • {p.category}</div>

//           <div style={{display:'flex', alignItems:'center', gap:12, margin:'8px 0'}}>
//             <div style={{fontSize:20, fontWeight:700, color:'var(--primary)'}}>₹{p.price}</div>
//             <div className="muted small">• {p.countInStock ? `${p.countInStock} in stock` : 'Out of stock'}</div>
//             <div style={{marginLeft:8, background:'#fff', padding:'6px 8px', borderRadius:8, border:'1px solid #eee', display:'flex', alignItems:'center', gap:8}}>
//               <strong>{avgRating}★</strong>
//               <span className="muted small">({(p.numReviews||0)})</span>
//             </div>
//           </div>

//           <p className="product-desc">{p.description}</p>

//           <div className="buy-row" style={{marginTop:12}}>
//             <div className="qty">
//               <label>Qty</label>
//               <div className="qty-controls">
//                 <button onClick={()=>setQty(q=>Math.max(1, q-1))} disabled={qty<=1}>−</button>
//                 <input type="number" value={qty} min="1" max={p.countInStock} onChange={e=>{
//                   const v = parseInt(e.target.value||'0',10);
//                   if (!v) return setQty(1);
//                   setQty(Math.min(Math.max(1,v), p.countInStock));
//                 }} />
//                 <button onClick={()=>setQty(q=>Math.min(p.countInStock, q+1))} disabled={qty>=p.countInStock}>+</button>
//               </div>
//             </div>

//             <div className="actions" style={{marginLeft:20}}>
//               <button className="btn-primary big" onClick={onAdd} disabled={p.countInStock===0}>Add to cart</button>
//               <button className="btn-outline" onClick={()=>{ navigator.clipboard?.writeText(window.location.href); alert('Product link copied'); }}>Share</button>
//             </div>
//           </div>

//           <div className="more-info" style={{marginTop:20}}>
//             <h4>Product details</h4>
//             <ul>
//               <li>Category: {p.category}</li>
//               <li>Brand: {p.brand}</li>
//               <li>Stock: {p.countInStock}</li>
//               <li>SKU: {p._id}</li>
//             </ul>
//           </div>

//           {/* ---------- Reviews ---------- */}
//           <section className="reviews" style={{marginTop:18}}>
//             <h3>Reviews ({p.numReviews || 0}) • Avg: {avgRating}★</h3>

//             {(p.reviews && p.reviews.length) ? (
//               <ul style={{listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:12}}>
//                 {p.reviews.map(r => (
//                   <li key={r._id || r.createdAt} style={{background:'#fff', padding:12, borderRadius:8, boxShadow:'var(--shadow)'}}>
//                     <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:12}}>
//                       <strong>{r.name}</strong>
//                       <span className="muted small">{new Date(r.createdAt).toLocaleString()}</span>
//                     </div>
//                     <div style={{marginTop:6}}><strong>{r.rating}★</strong></div>
//                     {r.comment && <p style={{marginTop:8}}>{r.comment}</p>}
//                   </li>
//                 ))}
//               </ul>
//             ) : <p className="muted">No reviews yet — be the first to review.</p>}

//             <div style={{marginTop:16}}>
//               {user ? (
//                 canReview ? (
//                   <form onSubmit={submitReview} style={{display:'flex', flexDirection:'column', gap:8, marginTop:8}}>
//                     <label>
//                       Rating
//                       <select value={formRating} onChange={e=>setFormRating(e.target.value)}>
//                         <option value="">Select rating</option>
//                         {[5,4,3,2,1].map(v => <option key={v} value={v}>{v} ★</option>)}
//                       </select>
//                     </label>

//                     <label>
//                       Comment
//                       <textarea value={formComment} onChange={e=>setFormComment(e.target.value)} placeholder="Write a short review..." />
//                     </label>

//                     {error && <div className="error">{error}</div>}

//                     <div style={{display:'flex', gap:8}}>
//                       <button className="btn-outline" type="button" onClick={()=>{ setFormRating(''); setFormComment(''); }}>Clear</button>
//                       <button className="btn-primary" type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Review'}</button>
//                     </div>
//                   </form>
//                 ) : (
//                   <p className="muted">You have already reviewed this product.</p>
//                 )
//               ) : (
//                 <p className="muted">Please login to leave a review.</p>
//               )}
//             </div>
//           </section>
//         </div>
//       </div>
//     </div>
//   );
// }


// new code


import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import RatingSelect from '../components/RatingSelect';

export default function ProductDetail(){
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { addToCart } = useCart();

  useEffect(()=>{
    let mounted = true;
    (async ()=>{
      try {
        const { data } = await api.get(`/products/${id}`);
        if(!mounted) return;
        setP(data);
        setQty(data.countInStock > 0 ? 1 : 0);
      } catch(err) {
        console.error('Product fetch error', err);
      } finally {
        if(mounted) setLoading(false);
      }
    })();
    return ()=> mounted = false;
  }, [id]);

  const onAdd = () => {
    if (!p) return;
    if (p.countInStock === 0) return alert('Out of stock');
    addToCart(p, qty);
    alert('Added to cart');
  };

  const submitReview = async () => {
    if(!reviewText.trim()) return alert('Write a review first');
    try{
      setSubmitting(true);
      await api.post(`/products/${id}/reviews`, { rating, comment: reviewText });
      alert('Thanks! Review submitted');
      // refresh product
      const { data } = await api.get(`/products/${id}`);
      setP(data);
      setReviewText(''); setRating(5);
    }catch(e){
      console.error(e);
      alert(e?.response?.data?.message || 'Could not submit review');
    }finally{ setSubmitting(false) }
  }

  if (loading) return <div className="container"><p>Loading...</p></div>;
  if (!p) return <div className="container"><p>Product not found.</p></div>;

  return (
    <div className="container product-detail-page">
      <div className="detail">
        <div className="gallery">
          <div className="main-img"><img src={p.image} alt={p.name} loading="lazy"/></div>
        </div>

        <div className="info">
          <h1 className="product-name">{p.name}</h1>
          <div className="muted small">{p.brand} • {p.category}</div>
          <p className="product-desc">{p.description}</p>

          <div className="price-row">
            <div className="price">₹{p.price}</div>
            <div className={`stock ${p.countInStock ? 'in' : 'out'}`}>
              {p.countInStock ? `${p.countInStock} in stock` : 'Out of stock'}
            </div>
          </div>

          <div className="buy-row">
            <div className="qty">
              <label>Qty</label>
              <div className="qty-controls">
                <button onClick={()=>setQty(q=>Math.max(1, q-1))} disabled={qty<=1}>−</button>
                <input type="number" value={qty} min="1" max={p.countInStock} onChange={e=>{
                  const v = parseInt(e.target.value||'0',10);
                  if (!v) return setQty(1);
                  setQty(Math.min(Math.max(1,v), p.countInStock));
                }} />
                <button onClick={()=>setQty(q=>Math.min(p.countInStock, q+1))} disabled={qty>=p.countInStock}>+</button>
              </div>
            </div>

            <div className="actions">
              <button className="btn-primary big" onClick={onAdd} disabled={p.countInStock===0}>Add to cart</button>
              <button className="btn-outline" onClick={()=>{ navigator.clipboard?.writeText(window.location.href); alert('Product link copied'); }}>Share</button>
            </div>
          </div>

          <div className="more-info">
            <h4>Product details</h4>
            <ul>
              <li>Category: {p.category}</li>
              <li>Brand: {p.brand}</li>
              <li>Stock: {p.countInStock}</li>
              <li>SKU: {p._id}</li>
            </ul>
          </div>

          <div className="reviews-panel">
            <h3>Reviews ({p.reviews?.length || 0}) • Avg: {(p.rating||0).toFixed(1)}★</h3>

            <div className="existing-reviews">
              {(p.reviews||[]).map(r=> (
                <div className="review" key={r._id}>
                  <div className="meta">{r.name} • {new Date(r.createdAt).toLocaleDateString()}</div>
                  <div className="stars">{Array.from({length: r.rating}).map((_,i)=>(<span key={i}>★</span>))}</div>
                  <div className="comment">{r.comment}</div>
                </div>
              ))}
            </div>

            <div className="write-review">
              <h4>Write a review</h4>
              <RatingSelect value={rating} onChange={setRating} />
              <textarea placeholder="Your review" value={reviewText} onChange={e=>setReviewText(e.target.value)} rows={4} />
              <div style={{marginTop:10}}>
                <button className="btn-primary" onClick={submitReview} disabled={submitting}>{submitting? 'Posting...':'Submit Review'}</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .reviews-panel{ margin-top:24px; border-top:1px solid #eef2f7; padding-top:18px }
        .existing-reviews .review{ padding:12px; border:1px solid #f1f5f9; border-radius:8px; margin-bottom:10px }
        .existing-reviews .stars{ color:#f59e0b }
        .write-review textarea{ width:100%; padding:10px; border-radius:8px; border:1px solid #e2e8f0 }
      `}</style>
    </div>
  );
}
