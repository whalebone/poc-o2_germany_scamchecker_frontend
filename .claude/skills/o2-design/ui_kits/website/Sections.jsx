// o2 Website — secondary sections: testimonial + CTA strip
const O2Testimonial = () => (
  <section style={{background:'#fff', padding:'72px 32px'}}>
    <div style={{maxWidth:980, margin:'0 auto', textAlign:'center'}}>
      <div style={{
        display:'inline-block', background:'#0050FF', color:'#fff', fontWeight:700, fontSize:12,
        padding:'5px 12px', borderRadius:999, letterSpacing:'.04em', textTransform:'uppercase', marginBottom:24
      }}>Connect Testsieger 2026</div>
      <blockquote style={{
        margin:0, fontWeight:700, fontSize:42, lineHeight:1.15, color:'#00001E', letterSpacing:'-.005em'
      }}>
        {'„Das O₂ Netz überzeugt mit dem besten Preis-Leistungs-Verhältnis und einer hervorragenden Sprachqualität."'}
      </blockquote>
      <div style={{marginTop:24, fontSize:14, color:'#73737D'}}>{'connect Mobilfunknetztest · Heft 01/2026'}</div>
    </div>
  </section>
);

const O2CTA = () => (
  <section style={{
    background:'linear-gradient(180deg, #00008C, #0050FF)', color:'#fff',
    padding:'64px 32px', position:'relative', overflow:'hidden'
  }}>
    <div style={{maxWidth:1280, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', gap:32, flexWrap:'wrap', position:'relative', zIndex:2}}>
      <div>
        <h3 style={{fontWeight:900, fontSize:36, margin:'0 0 8px', lineHeight:1}}>can do Wechsel.</h3>
        <p style={{margin:0, fontSize:18, opacity:.9, maxWidth:540}}>
          {'100 € Wechselbonus sichern, Rufnummer mitnehmen, alten Vertrag vergessen.'}
        </p>
      </div>
      <button style={{
        background:'#fff', color:'#0050FF', border:0, padding:'18px 32px', borderRadius:999,
        fontFamily:'inherit', fontWeight:700, fontSize:17, cursor:'pointer'
      }}>Jetzt wechseln</button>
    </div>
  </section>
);
window.O2Testimonial = O2Testimonial;
window.O2CTA = O2CTA;
