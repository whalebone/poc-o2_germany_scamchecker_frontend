// o2 Website UI Kit — Footer (light grey, links in Beyond Blue)
const FooterCol = ({title, items}) => (
  <div style={{display:'flex', flexDirection:'column', gap:10}}>
    <div style={{fontWeight:700, fontSize:14, marginBottom:6, color:'#00001E'}}>{title}</div>
    {items.map((i,k)=>(
      <a key={k} href="#" style={{color:'#0050FF', textDecoration:'none', fontSize:14}}>{i}</a>
    ))}
  </div>
);

const O2Footer = () => (
  <footer style={{background:'#DCDDE0', color:'#3C3C46', padding:'64px 32px 32px'}}>
    <div style={{maxWidth:1280, margin:'0 auto'}}>
      <div style={{display:'grid', gridTemplateColumns:'1.2fr 1fr 1fr 1fr 1fr', gap:32, paddingBottom:40, borderBottom:'1px solid rgba(0,0,30,.12)'}}>
        <div>
          <svg viewBox="0 0 430 417" style={{height:54,display:'block',marginBottom:18}} xmlns="http://www.w3.org/2000/svg">
            <path fill="#0050FF" d="M126.27,208.49c0,49.91,36.23,91.27,88.88,91.27c52.3,0,88.54-41.36,88.54-91.27c0-52.98-35.55-91.27-88.54-91.27C161.82,117.22,126.27,155.51,126.27,208.49L126.27,208.49z M160.45,208.49c0-33.16,20.17-65.29,54.69-65.29c34.18,0,54.35,32.13,54.35,65.29c0,31.11-16.75,65.29-54.35,65.29C177.2,273.78,160.45,239.6,160.45,208.49L160.45,208.49z"/>
            <path fill="#0050FF" d="M351.5,338.86V326.7h-31.52c12.61-12.39,29.09-27.43,29.09-43.8c0-15.15-9.51-22.56-24.22-22.56c-7.85,0-15.93,1.99-22.89,5.53l1.22,12.83c5.09-3.32,11.28-6.19,17.81-6.19c6.3,0,12.61,3.32,12.61,10.4c0,14.16-26.21,36.05-33.4,43.02v12.94H351.5L351.5,338.86z"/>
          </svg>
          <p style={{margin:0, fontSize:14, lineHeight:1.5, color:'#3C3C46', maxWidth:280}}>
            {'Telefónica Germany GmbH & Co. OHG — Refreshingly different.'}
          </p>
        </div>
        <FooterCol title="Produkte" items={['Mobilfunk','Internet & Festnetz','TV','Handys','Tablets','Zubehör']}/>
        <FooterCol title="Service" items={['Mein O₂','Hilfe & Kontakt','Vertrag verlängern','Rufnummer mitnehmen','Netzabdeckung']}/>
        <FooterCol title="Über O₂" items={['Karriere','Presse','Investoren','Nachhaltigkeit','Telefónica']}/>
        <FooterCol title="Folge uns" items={['Newsletter','Community','Instagram','TikTok','YouTube']}/>
      </div>
      <div style={{paddingTop:24, display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:12, fontSize:12, color:'#73737D'}}>
        <div>{'© 2026 Telefónica Germany GmbH & Co. OHG'}</div>
        <div style={{display:'flex', gap:18}}>
          <a href="#" style={{color:'#0050FF', textDecoration:'none'}}>Impressum</a>
          <a href="#" style={{color:'#0050FF', textDecoration:'none'}}>Datenschutz</a>
          <a href="#" style={{color:'#0050FF', textDecoration:'none'}}>AGB</a>
          <a href="#" style={{color:'#0050FF', textDecoration:'none'}}>Cookie-Einstellungen</a>
        </div>
      </div>
    </div>
  </footer>
);
window.O2Footer = O2Footer;
