// src/components/PageBackground.jsx
// Rich lavender-purple background matching the reference image
// Used by all auth pages and layout wrappers

export const T = {
  /* ── Background ── */
  bgGrad:   'linear-gradient(145deg,#EAE2F8 0%,#DDD4F2 22%,#CFC5EA 52%,#C3B7E0 100%)',

  /* ── Purple ramp ── */
  deep:     '#5B4A9B',
  mid:      '#6B5AB0',
  bright:   '#8B7BC8',
  glow:     '#A090D8',
  pale:     '#C8BEE8',
  soft:     '#DDD6F0',
  mist:     '#EDE8F8',
  snow:     '#F6F3FD',

  /* ── Glass card ── */
  glass:    'rgba(255,255,255,0.60)',
  glassBd:  'rgba(255,255,255,0.88)',
  glassSh:  '0 8px 40px rgba(91,74,155,0.18),0 2px 10px rgba(91,74,155,0.08)',
  glassHv:  '0 22px 60px rgba(91,74,155,0.28)',

  /* ── Sidebar ── */
  sideTop:  '#4A3A88',
  sideBg:   '#5B4A9B',
  sideBd:   'rgba(255,255,255,0.11)',

  /* ── Text ── */
  ink:      '#1A1040',
  inkMid:   '#2E1F6B',
  inkSoft:  'rgba(46,31,107,0.58)',
  inkDim:   'rgba(46,31,107,0.36)',
  border:   'rgba(139,123,200,0.22)',

  /* ── Inputs ── */
  inputBg:  'rgba(255,255,255,0.56)',
  inputBd:  'rgba(139,123,200,0.28)',
  focusBd:  '#6B5AB0',
  focusBg:  'rgba(107,90,176,0.07)',
  focusSh:  '0 0 0 3px rgba(107,90,176,0.14)',

  /* ── Status ── */
  ok:  '#1A9B5C', okBg:  'rgba(26,155,92,0.10)',  okBd:  'rgba(26,155,92,0.24)',
  wrn: '#B07A10', wrnBg: 'rgba(176,122,16,0.10)', wrnBd: 'rgba(176,122,16,0.24)',
  err: '#B02A20', errBg: 'rgba(176,42,32,0.10)',  errBd: 'rgba(176,42,32,0.24)',
};

/* ── Shared page background JSX component ── */
export default function PageBackground() {
  return (
    <div style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none', overflow:'hidden' }}>
      {/* base gradient */}
      <div style={{ position:'absolute', inset:0, background:T.bgGrad }}/>

      {/* top-right large glow orb */}
      <div style={{ position:'absolute', top:'-20%', right:'-14%', width:700, height:700, borderRadius:'50%',
        background:'radial-gradient(circle at 38% 38%,rgba(185,165,235,0.80) 0%,rgba(150,128,215,0.34) 46%,transparent 70%)' }}/>

      {/* bottom-left orb */}
      <div style={{ position:'absolute', bottom:'-16%', left:'-11%', width:540, height:540, borderRadius:'50%',
        background:'radial-gradient(circle at 62% 62%,rgba(130,110,200,0.26) 0%,rgba(165,145,225,0.11) 56%,transparent 74%)' }}/>

      {/* floating centre orb */}
      <div style={{ position:'absolute', top:'28%', left:'36%', width:360, height:360, borderRadius:'50%',
        background:'radial-gradient(circle,rgba(205,192,245,0.46) 0%,transparent 72%)',
        animation:'floatOrb 11s ease-in-out infinite' }}/>

      {/* small top-left orb */}
      <div style={{ position:'absolute', top:'6%', left:'4%', width:210, height:210, borderRadius:'50%',
        background:'radial-gradient(circle,rgba(195,180,240,0.32) 0%,transparent 70%)',
        animation:'floatOrb 7s ease-in-out 2s infinite' }}/>

      {/* SVG bottom waves matching image */}
      <svg style={{ position:'absolute', bottom:0, left:0, width:'100%' }} viewBox="0 0 1440 280" preserveAspectRatio="none">
        <path fill="rgba(91,74,155,0.12)" d="M0,155 C210,215 440,78 660,142 C880,205 1060,58 1265,118 C1365,148 1420,98 1440,108 L1440,280 L0,280Z"/>
        <path fill="rgba(139,123,200,0.09)" d="M0,195 C295,140 545,258 800,188 C1055,118 1245,218 1440,178 L1440,280 L0,280Z"/>
        <path fill="rgba(175,160,228,0.06)" d="M0,235 C240,205 480,258 725,232 C970,205 1210,250 1440,224 L1440,280 L0,280Z"/>
      </svg>

      {/* diagonal light streak */}
      <div style={{ position:'absolute', top:'14%', left:'-18%', width:'138%', height:'1px',
        background:'linear-gradient(90deg,transparent,rgba(205,190,248,0.44) 42%,rgba(225,212,252,0.60) 58%,transparent)',
        transform:'rotate(-6deg)' }}/>
      <div style={{ position:'absolute', top:'16%', left:'-18%', width:'138%', height:'1px',
        background:'linear-gradient(90deg,transparent,rgba(175,160,228,0.18) 40%,rgba(200,188,244,0.26) 60%,transparent)',
        transform:'rotate(-6deg)' }}/>

      {/* sparkle dots */}
      {[[8,14],[85,22],[18,60],[78,68],[50,40],[32,80],[90,52],[65,88],[42,28],[74,35]].map(([x,y],i)=>(
        <div key={i} style={{ position:'absolute', left:`${x}%`, top:`${y}%`,
          width:i%3===0?5:i%2===0?4:3, height:i%3===0?5:i%2===0?4:3,
          borderRadius:'50%', background:`rgba(91,74,155,${0.14+i*0.04})`,
          animation:`twinkle ${3+i*0.36}s ease-in-out ${i*0.28}s infinite` }}/>
      ))}
    </div>
  );
}

/* ── Global CSS string (inject via <style> or css-in-js) ── */
export const GCSS = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html,body{height:100%}
  body{background:linear-gradient(145deg,#EAE2F8 0%,#DDD4F2 22%,#CFC5EA 52%,#C3B7E0 100%)}
  input,select,textarea{outline:none!important}
  input::placeholder,textarea::placeholder{color:rgba(46,31,107,0.36)!important}
  select option{background:#fff;color:#1A1040}
  ::-webkit-scrollbar{width:4px}
  ::-webkit-scrollbar-track{background:transparent}
  ::-webkit-scrollbar-thumb{background:rgba(107,90,176,0.30);border-radius:4px}
  ::-webkit-scrollbar-thumb:hover{background:rgba(107,90,176,0.55)}
  @keyframes floatOrb{0%,100%{transform:translate(0,0)}33%{transform:translate(17px,-13px)}66%{transform:translate(-13px,17px)}}
  @keyframes twinkle{0%,100%{opacity:0.22;transform:scale(1)}50%{opacity:0.88;transform:scale(2.3)}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes dotPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.35;transform:scale(1.65)}}
  @keyframes pageEnter{from{opacity:0;transform:translateY(13px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes bob{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-7px) rotate(-2deg)}}
  @keyframes toastIn{from{opacity:0;transform:translateY(-14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes successPop{from{opacity:0;transform:scale(0.82)}to{opacity:1;transform:scale(1)}}
  @keyframes slideR{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
  @keyframes slideL{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
  .page-enter{animation:pageEnter 0.42s cubic-bezier(0.22,1,0.36,1) both}
  .btn-p{transition:all 0.28s cubic-bezier(0.22,1,0.36,1);position:relative;overflow:hidden}
  .btn-p::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,0.18),transparent);opacity:0;transition:opacity 0.25s}
  .btn-p:hover:not(:disabled)::after{opacity:1}
  .btn-p:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 14px 40px rgba(91,74,155,0.48)!important}
  .btn-p:active:not(:disabled){transform:scale(0.985)}
  .btn-ghost{transition:all 0.22s}
  .btn-ghost:hover{background:rgba(237,232,248,0.90)!important;border-color:#6B5AB0!important}
  .lnk{transition:color 0.18s}.lnk:hover{color:#6B5AB0!important}
  .nav-sb{transition:background 0.18s,color 0.18s}
  .nav-sb:hover{background:rgba(255,255,255,0.11)!important;color:rgba(255,255,255,0.92)!important}
  .card-hv{transition:all 0.28s cubic-bezier(0.22,1,0.36,1)}
  .card-hv:hover{transform:translateY(-4px);box-shadow:0 22px 60px rgba(91,74,155,0.28)!important}
  .row-hv{transition:background 0.16s}
  .row-hv:hover{background:rgba(237,232,248,0.85)!important}
  .op-card{transition:all 0.22s cubic-bezier(0.22,1,0.36,1)}
  .op-card:hover{transform:translateY(-3px);box-shadow:0 18px 48px rgba(91,74,155,0.24)!important;border-color:rgba(107,90,176,0.40)!important}
`;