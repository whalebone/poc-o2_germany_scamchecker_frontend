// o2 Website — Hero with bubble
const O2Hero = () => (
  <section style={{
    background: 'linear-gradient(180deg, #00008C 0%, #0050FF 60%, #2B7BFF 100%)',
    color:'#fff', position:'relative', overflow:'hidden'
  }}>
    <div style={{maxWidth:1280, margin:'0 auto', padding:'72px 32px 96px', display:'grid', gridTemplateColumns:'1.1fr .9fr', gap:48, alignItems:'center', position:'relative', zIndex:2}}>
      <div>
        <div style={{
          display:'inline-block', background:'#fff', color:'#0050FF', fontWeight:700, fontSize:13,
          padding:'6px 14px', borderRadius:999, letterSpacing:'.02em', marginBottom:24
        }}>{'Neu · O₂ Mobile Unlimited Max'}</div>
        <h1 style={{
          fontWeight:900, fontSize:72, lineHeight:.95, letterSpacing:'-.01em', margin:'0 0 20px'
        }}>can do<br/>unlimited 5G.</h1>
        <p style={{fontSize:20, lineHeight:1.4, maxWidth:520, opacity:.92, margin:'0 0 32px'}}>
          {'Mit O₂ Mobile Unlimited Max surfst du im preisgekrönten Netz ohne Limit. Inklusive 5G Plus.'}
        </p>
        <div style={{display:'flex', gap:14}}>
          <button style={{
            background:'#fff', color:'#0050FF', fontFamily:'inherit', fontWeight:700, fontSize:16,
            padding:'16px 28px', borderRadius:999, border:0, cursor:'pointer'
          }}>Tarif sichern</button>
          <button style={{
            background:'transparent', color:'#fff', fontFamily:'inherit', fontWeight:700, fontSize:16,
            padding:'14px 26px', borderRadius:999, border:'2px solid #fff', cursor:'pointer'
          }}>Mehr erfahren</button>
        </div>
        <div style={{marginTop:36, fontSize:13, opacity:.78}}>
          {'59,99 €/Monat · 24 Monate · ohne Anschlusspreis'}
        </div>
      </div>
      <div style={{position:'relative', minHeight:420, display:'flex', alignItems:'center', justifyContent:'center'}}>
        <div style={{
          background:'#fff', color:'#00001E', borderRadius:24, padding:'36px 40px', boxShadow:'0 28px 60px rgba(0,0,30,.22)',
          minWidth:260, textAlign:'center'
        }}>
          <div style={{fontSize:14, color:'#73737D', fontWeight:600, textTransform:'uppercase', letterSpacing:'.04em'}}>nur</div>
          <div style={{fontSize:72, fontWeight:900, lineHeight:1, color:'#0050FF', margin:'4px 0'}}>{'59,99 €'}</div>
          <div style={{fontSize:14, color:'#73737D'}}>/Monat · 24 Monate</div>
        </div>
      </div>
    </div>
    <img src="../../assets/bubbles/o2_Bubble_03.png" style={{position:'absolute', width:120, top:40, left:'45%', opacity:.5, filter:'blur(1px)'}}/>
    <img src="../../assets/bubbles/o2_Bubble_07.png" style={{position:'absolute', width:80, bottom:30, left:'10%', opacity:.4, filter:'blur(2px)'}}/>
  </section>
);
window.O2Hero = O2Hero;
