const tiles = [
  { title:'Fashion', img:'https://source.unsplash.com/WZX6_tr5uLc', to:'/category/Fashion' },
  { title:'Electronics', img:'https://source.unsplash.com/LEtrhrME07g', to:'/category/Mobiles' },
  { title:'Home', img:'https://source.unsplash.com/fZuleEfeA1Q', to:'/category/Home' },
  { title:'Beauty', img:'https://source.unsplash.com/df3eG4zvamg', to:'/category/Beauty' },
];

export default function Categories(){
  return (
    <section className="grid" style={{marginTop:24}}>
      {tiles.map(t=>(
        <a key={t.title} href={t.to} className="card" style={{padding:0, overflow:'hidden', position:'relative'}}>
          <img src={t.img} alt={t.title} style={{height:180, width:'100%', objectFit:'cover'}}/>
          <div style={{position: 'absolute', inset: 'auto 12px 12px 12px', background: 'rgba(0,0,0,.55)', color: '#fff', padding: '8px 12px', borderRadius: 8}}>
            <strong>{t.title}</strong>
          </div>
        </a>
      ))}
    </section>
  );
}
