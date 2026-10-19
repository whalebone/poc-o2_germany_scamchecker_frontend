// o2 Website — Product cards strip
const TariffCard = ({name, badge, badgeColor, data, price, oldPrice, highlight}) => (
  <div style={{
    background: highlight ? 'linear-gradient(180deg,#00008C 0%, #0050FF 100%)' : '#fff',
    color: highlight ? '#fff' : '#00001E',
    borderRadius:18, padding:'24px 24px 28px',
    boxShadow: highlight ? '0 18px 36px rgba(0,0,80,.22)' : '0 4px 16px rgba(0,0,30,.08)',
    border: highlight ? '0' : '1px solid #F3F3F5',
    display:'flex', flexDirection:'column', gap:14, position:'relative'
  }}>
    {badge && <span style={{
      alignSelf:'flex-start', background: highlight ? '#fff' : (badgeColor || '#0050FF'),
      color: highlight ? '#0050FF' : '#fff',
      fontWeight:700, fontSize:11, padding:'5px 10px', borderRadius:999, letterSpacing:'.04em', textTransform:'uppercase'
    }}>{badge}</span>}
    <div style={{fontWeight:700, fontSize:22, lineHeight:1.1}}>{name}</div>
    <ul style={{margin:0, padding:0, listStyle:'none', display:'flex', flexDirection:'column', gap:8}}>
      {data.map((d,i)=>(
        <li key={i} style={{display:'flex', alignItems:'center', gap:10, fontSize:14, opacity: highlight?.9:1}}>
          <img src="../../assets/icons/Tick_solid.svg" style={{width:18, height:18, filter: highlight?'brightness(0) invert(1)':'none'}}/>
          {d}
        </li>
      ))}
    </ul>
    <div style={{marginTop:'auto', display:'flex', alignItems:'baseline', gap:8}}>
      {oldPrice && <span style={{fontSize:14, textDecoration:'line-through', opacity:.55}}>{oldPrice}</span>}
      <span style={{fontWeight:900, fontSize:34, lineHeight:1}}>{price}</span>
      <span style={{fontSize:13, opacity: highlight?.75:.6}}>/Monat</span>
    </div>
    <button style={{
      background: highlight ? '#fff' : '#0050FF',
      color: highlight ? '#0050FF' : '#fff',
      border:0, padding:'14px 20px', borderRadius:999, fontFamily:'inherit',
      fontWeight:700, fontSize:15, cursor:'pointer', marginTop:6
    }}>Jetzt buchen</button>
  </div>
);

const O2Tariffs = () => (
  <section style={{background:'#F3F3F5', padding:'72px 32px'}}>
    <div style={{maxWidth:1280, margin:'0 auto'}}>
      <h2 style={{fontSize:42, fontWeight:900, margin:'0 0 12px', color:'#00001E', lineHeight:1}}>
        can do mehr Tarif.
      </h2>
      <p style={{fontSize:18, color:'#3C3C46', margin:'0 0 36px', maxWidth:640}}>
        {'Drei Tarife. Ein Netz. Du wählst, wie viel du brauchst — und wechselst jederzeit.'}
      </p>
      <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:20}}>
        <TariffCard
          name={'O₂ Mobile S'} data={['10 GB Daten','5G inklusive','Allnet-Flat','EU-Roaming']}
          price={'14,99 €'} oldPrice={'24,99 €'} badge={'−40 %'} badgeColor="#F65D7C"/>
        <TariffCard
          name={'O₂ Mobile L'} badge="Bestseller" data={['40 GB Daten','5G inklusive','Allnet-Flat','+ 1 Premium-Partner']}
          price={'34,99 €'}/>
        <TariffCard
          name={'O₂ Mobile Unlimited Max'} badge={'Neu · 5G Plus'} data={['Unlimited Daten','5G Plus','Allnet & SMS','3 Premium-Partner']}
          price={'59,99 €'} highlight/>
      </div>
    </div>
  </section>
);
window.O2Tariffs = O2Tariffs;
window.TariffCard = TariffCard;
