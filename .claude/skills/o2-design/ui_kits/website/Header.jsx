// o2 Website UI Kit — Header
const O2Header = () => {
  const [open, setOpen] = React.useState(null);
  const Nav = ({label, k}) => (
    <button
      onMouseEnter={() => setOpen(k)}
      onMouseLeave={() => setOpen(null)}
      style={{
        background: 'transparent', border: 0, color: '#fff', fontFamily: 'inherit',
        fontWeight: 700, fontSize: 15, padding: '10px 4px', cursor: 'pointer', position: 'relative'
      }}
    >
      {label}
      <span style={{
        position:'absolute', left:0, right:0, bottom:2, height:2, background:'#fff',
        opacity: open===k?1:0, transition:'opacity .2s'
      }}/>
    </button>
  );
  const IconBtn = ({src, label}) => (
    <button style={{
      background:'transparent', border:0, color:'#fff', display:'flex', flexDirection:'column',
      alignItems:'center', gap:2, fontFamily:'inherit', fontSize:11, fontWeight:600, cursor:'pointer', padding:'6px 10px'
    }}>
      <img src={src} style={{width:22, height:22, filter:'brightness(0) invert(1)'}}/>
      {label}
    </button>
  );
  return (
    <header style={{background:'#0050FF', color:'#fff'}}>
      <div style={{
        maxWidth:1280, margin:'0 auto', padding:'14px 32px',
        display:'flex', alignItems:'center', gap:32
      }}>
        <a href="#" style={{display:'flex'}}>
          <svg viewBox="0 0 430 417" style={{height:80,display:'block',fill:'#FFFFFF'}} xmlns="http://www.w3.org/2000/svg"><path fill="#FFFFFF" d="M126.27,208.49c0,49.91,36.23,91.27,88.88,91.27c52.3,0,88.54-41.36,88.54-91.27c0-52.98-35.55-91.27-88.54-91.27C161.82,117.22,126.27,155.51,126.27,208.49L126.27,208.49z M160.45,208.49c0-33.16,20.17-65.29,54.69-65.29c34.18,0,54.35,32.13,54.35,65.29c0,31.11-16.75,65.29-54.35,65.29C177.2,273.78,160.45,239.6,160.45,208.49L160.45,208.49z"/><path fill="#FFFFFF" d="M351.5,338.86V326.7h-31.52c12.61-12.39,29.09-27.43,29.09-43.8c0-15.15-9.51-22.56-24.22-22.56c-7.85,0-15.93,1.99-22.89,5.53l1.22,12.83c5.09-3.32,11.28-6.19,17.81-6.19c6.3,0,12.61,3.32,12.61,10.4c0,14.16-26.21,36.05-33.4,43.02v12.94H351.5L351.5,338.86z"/></svg>
        </a>
        <nav style={{display:'flex', gap:24, flex:1}}>
          <Nav label="Mobilfunk" k="m"/>
          <Nav label="Internet & Festnetz" k="i"/>
          <Nav label="Handys & Tablets" k="h"/>
          <Nav label="TV" k="t"/>
          <Nav label="Zubehör" k="z"/>
          <Nav label="Service & Hilfe" k="s"/>
        </nav>
        <div style={{display:'flex', gap:4, alignItems:'center'}}>
          <IconBtn src="../../assets/icons/Map_outline.svg" label="Shop"/>
          <IconBtn src="../../assets/icons/Search_outline.svg" label="Suche"/>
          <IconBtn src="../../assets/icons/Person_outline.svg" label="Mein O₂"/>
          <IconBtn src="../../assets/icons/Bag_outline.svg" label="Warenkorb"/>
        </div>
      </div>
    </header>
  );
};
window.O2Header = O2Header;
