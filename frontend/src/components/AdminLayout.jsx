// src/components/AdminLayout.jsx
import{NavLink,useNavigate,useLocation}from'react-router-dom';
import{FiGrid,FiList,FiBarChart2,FiFileText,FiLogOut,FiShield,FiSettings,FiUsers,FiChevronRight}from'react-icons/fi';
import{MdOutlineSchool}from'react-icons/md';
import{useAuth}from'../context/AuthContext';
import PageBackground,{T,GCSS}from'./Pagebackground';

const NAV=[
  {to:'/admin/dashboard', label:'Dashboard',    icon:FiGrid,     badge:null},
  {to:'/admin/requests',  label:'All Requests', icon:FiList,     badge:'12'},
  {to:'/admin/analytics', label:'Analytics',    icon:FiBarChart2,badge:null},
  {to:'/admin/audit-logs',label:'Audit Logs',   icon:FiFileText, badge:null},
  {to:'/admin/parents',   label:'Parents',      icon:FiUsers,    badge:null},
  {to:'/admin/profile',   label:'My Profile',   icon:FiUsers,    badge:null},
];

const SB_CSS=`
  ${GCSS}
  @keyframes pageEnter{from{opacity:0;transform:translateY(13px)}to{opacity:1;transform:translateY(0)}}
  .page-enter{animation:pageEnter 0.42s cubic-bezier(0.22,1,0.36,1) both}
  .nav-sb{transition:background 0.18s,color 0.18s}
  .nav-sb:hover{background:rgba(255,255,255,0.11)!important;color:rgba(255,255,255,0.92)!important}
  .sb-btn{transition:all 0.18s;border-radius:10px}
  .sb-btn:hover{background:rgba(255,255,255,0.11)!important;transform:scale(1.03)}
`;

function Sidebar({type='admin'}){
  const{user,logout}=useAuth();
  const navigate=useNavigate();
  const links=type==='admin'?NAV:[
    {to:'/student/dashboard',label:'Dashboard',  icon:FiGrid,    badge:null},
    {to:'/student/request',  label:'New Request',icon:FiList,    badge:null},
    {to:'/student/status',   label:'My Status',  icon:FiBarChart2,badge:null},
    {to:'/student/profile',  label:'My Profile', icon:FiUsers,   badge:null},
  ];
  const logoutPath=type==='admin'?'/admin/login':'/student/login';

  return(
    <aside style={{width:265,flexShrink:0,position:'fixed',top:0,left:0,height:'100vh',zIndex:30,display:'flex',flexDirection:'column',overflow:'hidden',background:`linear-gradient(180deg,${T.sideTop} 0%,${T.sideBg} 44%,${T.mid} 100%)`,borderRight:`1px solid ${T.sideBd}`,boxShadow:'4px 0 32px rgba(91,74,155,0.24)'}}>

      {/* Decorative orbs inside sidebar */}
      <div style={{position:'absolute',top:'-70px',right:'-70px',width:240,height:240,borderRadius:'50%',background:'rgba(255,255,255,0.06)',pointerEvents:'none',animation:'floatOrb 10s ease-in-out infinite'}}/>
      <div style={{position:'absolute',bottom:'-55px',left:'-55px',width:190,height:190,borderRadius:'50%',background:'rgba(255,255,255,0.04)',pointerEvents:'none'}}/>
      {[[82,18],[14,55],[78,72],[30,85]].map(([x,y],i)=>(
        <div key={i} style={{position:'absolute',left:`${x}%`,top:`${y}%`,width:3,height:3,borderRadius:'50%',background:`rgba(255,255,255,${0.14+i*0.06})`,animation:`twinkle ${3.5+i*0.4}s ease-in-out ${i*0.3}s infinite`,pointerEvents:'none'}}/>
      ))}

      {/* Logo */}
      <div style={{padding:'22px 20px 18px',borderBottom:`1px solid ${T.sideBd}`,position:'relative'}}>
        <div style={{display:'flex',alignItems:'center',gap:11}}>
          {/* <div style={{width:40,height:40,borderRadius:12,flexShrink:0,background:'rgba(255,255,255,0.18)',border:'1.5px solid rgba(255,255,255,0.28)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 3px 14px rgba(0,0,0,0.12)'}}>
            <MdOutlineSchool style={{color:'#fff',fontSize:20}}/>
          </div> */}
          <div>
            {/* <p style={{fontWeight:800,fontSize:17,color:'#fff',letterSpacing:-0.4,lineHeight:1}}>
              Pass<span style={{color:'rgba(255,255,255,0.52)'}}>Gate</span><span style={{fontWeight:300,color:'rgba(255,255,255,0.38)',fontSize:14}}> AI</span>
            </p> */}
            <p style={{fontSize:12,color:'rgba(255,255,255,0.34)',letterSpacing:'0.20em',textTransform:'uppercase',marginTop:2}}>{type==='admin'?'Admin Portal':'Student Portal'}</p>
          </div>
        </div>
      </div>

      {/* User badge */}
      <div style={{margin:'14px 14px 0'}}>
        <div style={{display:'flex',alignItems:'center',gap:10,padding:'11px 13px',borderRadius:14,background:'rgba(255,255,255,0.13)',border:'1px solid rgba(255,255,255,0.20)'}}>
          <div style={{width:34,height:34,borderRadius:10,flexShrink:0,background:'rgba(255,255,255,0.22)',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <FiShield size={15} color="#fff"/>
          </div>
          <div style={{flex:1,minWidth:0}}>
            <p style={{color:'#fff',fontSize:13,fontWeight:600,lineHeight:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user?.name||'User'}</p>
            <p style={{color:'rgba(255,255,255,0.46)',fontSize:9.5,letterSpacing:'0.10em',textTransform:'uppercase',marginTop:2}}>{type==='admin'?'Administrator':'Student'}</p>
          </div>
          <div style={{width:8,height:8,borderRadius:'50%',background:'#7EDBA8',flexShrink:0,boxShadow:'0 0 8px rgba(126,219,168,0.80)',animation:'dotPulse 2.5s infinite'}}/>
        </div>
      </div>

      {/* Nav */}
      <nav style={{flex:1,padding:'18px 10px',overflowY:'auto'}}>
        <p style={{fontSize:8.5,fontWeight:700,letterSpacing:'0.24em',textTransform:'uppercase',color:'rgba(255,255,255,0.28)',padding:'0 10px',marginBottom:8}}>Menu</p>
        {links.map(({to,label,icon:Icon,badge})=>(
          <NavLink key={to} to={to} style={{textDecoration:'none',display:'block'}}>
            {({isActive})=>(
              <div className={isActive?'':'nav-sb'} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 11px',borderRadius:13,marginBottom:3,background:isActive?'rgba(255,255,255,0.18)':'transparent',position:'relative',cursor:'pointer',transition:'background 0.18s'}}>
                {isActive&&<div style={{position:'absolute',left:0,top:'50%',transform:'translateY(-50%)',width:3,height:20,borderRadius:'0 3px 3px 0',background:'#fff'}}/>}
                <Icon size={15} style={{color:isActive?'#fff':'rgba(255,255,255,0.52)',flexShrink:0}}/>
                <span style={{flex:1,fontSize:13,fontWeight:isActive?600:400,color:isActive?'#fff':'rgba(255,255,255,0.52)'}}>{label}</span>
                {badge&&<span style={{fontSize:9,fontWeight:700,padding:'2px 8px',borderRadius:20,background:isActive?'rgba(255,255,255,0.24)':'rgba(255,255,255,0.12)',color:isActive?'#fff':'rgba(255,255,255,0.52)'}}>{badge}</span>}
                {isActive&&<FiChevronRight size={12} style={{color:'rgba(255,255,255,0.40)',flexShrink:0}}/>}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* AI status */}
      {/* <div style={{margin:'0 14px 10px',padding:'10px 13px',background:'rgba(255,255,255,0.09)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:12,display:'flex',alignItems:'center',gap:9}}>
        <div style={{width:7,height:7,borderRadius:'50%',background:'#7EDBA8',animation:'dotPulse 2.2s ease-in-out infinite',boxShadow:'0 0 8px rgba(126,219,168,0.70)',flexShrink:0}}/>
        <span style={{fontSize:10,color:'rgba(255,255,255,0.55)',letterSpacing:'0.08em'}}>AI Engine Active</span>
      </div> */}

      {/* Bottom */}
      <div style={{padding:'6px 10px 18px',borderTop:`1px solid ${T.sideBd}`}}>
        {[
          // {icon:FiSettings,label:'Settings',onClick:()=>{}},
          {icon:FiLogOut,  label:'Logout',  onClick:()=>{logout?.();navigate(logoutPath);}},
        ].map(({icon:Icon,label,onClick})=>(
          <button key={label} onClick={onClick} className="sb-btn" style={{width:'100%',display:'flex',alignItems:'center',gap:10,padding:'9px 11px',borderRadius:13,border:'none',background:'transparent',color:'rgba(255,255,255,0.44)',fontSize:13,cursor:'pointer',marginBottom:2}}>
            <Icon size={14}/><span>{label}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}

/* ── AdminLayout ── */
const AdminLayout=({children,title,subtitle})=>{
  const location=useLocation();
  return(
    <div style={{minHeight:'100vh',display:'flex',position:'relative'}}>
      <style>{SB_CSS}</style>
      <PageBackground/>
      <Sidebar type="admin"/>
      <div style={{flex:1,marginLeft:244,display:'flex',flexDirection:'column',minHeight:'100vh',position:'relative',zIndex:1}}>
        {(title||subtitle)&&(
          <div style={{position:'sticky',top:0,zIndex:20,background:'rgba(234,226,248,0.88)',backdropFilter:'blur(20px)',borderBottom:`1px solid ${T.border}`,padding:'14px 30px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div>
              {title&&<h1 style={{fontWeight:800,fontSize:20,color:T.ink,letterSpacing:-0.5,lineHeight:1}}>{title}</h1>}
              {subtitle&&<p style={{fontSize:11,color:T.inkSoft,marginTop:3}}>{subtitle}</p>}
            </div>
            <div style={{display:'flex',alignItems:'center',gap:7,padding:'5px 15px',background:'rgba(255,255,255,0.55)',border:`1px solid ${T.border}`,borderRadius:20,backdropFilter:'blur(12px)'}}>
              <div style={{width:6,height:6,borderRadius:'50%',background:'#7EDBA8',boxShadow:'0 0 7px rgba(126,219,168,0.75)',animation:'dotPulse 2.5s infinite'}}/>
              <span style={{fontSize:9.5,fontWeight:700,color:T.mid,letterSpacing:'0.14em',textTransform:'uppercase'}}>Live</span>
            </div>
          </div>
        )}
        <div key={location.pathname} className="page-enter" style={{padding:'26px 30px',flex:1}}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

/* ── StudentLayout (same file for convenience) ── */
export function StudentLayout({children}){
  const{logout}=useAuth();
  const navigate=useNavigate();
  const location=useLocation();
  return(
    <div style={{minHeight:'100vh',display:'flex',position:'relative'}}>
      <style>{SB_CSS}</style>
      <PageBackground/>
      <Sidebar type="student"/>
      <main style={{flex:1,marginLeft:244,minHeight:'100vh',position:'relative',zIndex:1}}>
        <div key={location.pathname} className="page-enter" style={{padding:32}}>{children}</div>
      </main>
    </div>
  );
}