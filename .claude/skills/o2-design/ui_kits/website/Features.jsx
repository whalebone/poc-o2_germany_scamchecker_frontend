// o2 Website — Feature row with icons
const Feat = ({icon, title, body}) => (
  <div style={{display:'flex', flexDirection:'column', gap:14}}>
    <div style={{
      width:56, height:56, borderRadius:14, background:'#0050FF',
      display:'flex', alignItems:'center', justifyContent:'center'
    }}>
      <img src={icon} style={{width:32, height:32, filter:'brightness(0) invert(1)'}}/>
    </div>
    <div style={{fontWeight:700, fontSize:20, color:'#00001E', lineHeight:1.2}}>{title}</div>
    <div style={{fontSize:15, color:'#3C3C46', lineHeight:1.5}}>{body}</div>
  </div>
);

const O2Features = () => (
  <section style={{background:'#fff', padding:'72px 32px'}}>
    <div style={{maxWidth:1280, margin:'0 auto'}}>
      <h2 style={{fontSize:42, fontWeight:900, margin:'0 0 12px', color:'#00001E', lineHeight:1}}>can do mehr Netz.</h2>
      <p style={{fontSize:18, color:'#3C3C46', margin:'0 0 48px', maxWidth:640}}>
        {'Das O₂ Netz wurde von der Connect Fachzeitschrift mehrfach ausgezeichnet. Was du davon hast:'}
      </p>
      <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:32}}>
        <Feat
          icon="assets/icons/5G-Plus_outline.svg"
          title="5G Plus"
          body={'Bis zu 1.000 Mbit/s in über 1.000 Städten. Standalone-5G ohne 4G-Umweg.'}/>
        <Feat
          icon="assets/icons/Mobile-coverage_outline.svg"
          title="99 % Abdeckung"
          body={'Mobiles Netz, das fast überall in Deutschland funktioniert — auch auf dem Land.'}/>
        <Feat
          icon="assets/icons/Roaming_outline.svg"
          title="EU-Roaming inklusive"
          body={'In allen Tarifen. Telefonieren, surfen, simsen in der gesamten EU + UK + Schweiz.'}/>
        <Feat
          icon="assets/icons/Trusted_outline.svg"
          title="Testsieger"
          body={'Connect Mobilfunktest „sehr gut". O₂ liefert das beste Preis-Leistungs-Verhältnis.'}/>
      </div>
    </div>
  </section>
);
window.O2Features = O2Features;
