// src/pages/OutpassStatus.jsx
import{useEffect,useState}from'react';
import{useParams,Link}from'react-router-dom';
import{Clock,CheckCircle,XCircle,AlertCircle,MapPin,Calendar,User,Home,ArrowLeft,RefreshCw}from'lucide-react';
import StudentLayout from'../components/StudentLayout';
import{T,GCSS}from'../components/Pagebackground';

const CARD={background:'rgba(255,255,255,0.62)',backdropFilter:'blur(28px)',border:'1px solid rgba(255,255,255,0.86)',borderRadius:18,padding:24,boxShadow:'0 8px 32px rgba(91,74,155,0.11)'};

const StatusPill=({status})=>{
  const map={
    pending:        {bg:'rgba(176,122,16,0.10)',bd:'rgba(176,122,16,0.26)',text:'#B07A10',label:'Awaiting Parent',dot:'#B07A10'},
    'pending-admin':{bg:'rgba(107,90,176,0.10)',bd:'rgba(107,90,176,0.24)',text:T.mid,   label:'Admin Review',   dot:T.mid},
    approved:       {bg:'rgba(26,155,92,0.10)', bd:'rgba(26,155,92,0.26)', text:'#1A9B5C',label:'Approved',       dot:'#1A9B5C'},
    rejected:       {bg:'rgba(176,42,32,0.10)', bd:'rgba(176,42,32,0.26)', text:'#B02A20',label:'Rejected',       dot:'#B02A20'},
  };
  const s=map[status]||{bg:'rgba(255,255,255,0.55)',bd:T.border,text:T.inkSoft,label:status,dot:T.pale};
  return(
    <span style={{display:'inline-flex',alignItems:'center',gap:7,padding:'7px 16px',borderRadius:100,fontSize:12,fontWeight:700,background:s.bg,border:`1px solid ${s.bd}`,color:s.text,backdropFilter:'blur(10px)'}}>
      <span style={{width:6,height:6,borderRadius:'50%',background:s.dot,display:'inline-block',boxShadow:`0 0 6px ${s.dot}`}}/>{s.label}
    </span>
  );
};

const Row=({label,value,icon:Icon})=>(
  <div style={{display:'flex',alignItems:'flex-start',gap:12,padding:'12px 0',borderBottom:`1px solid ${T.border}`}}>
    {Icon&&<Icon size={13} style={{color:T.mid,marginTop:1,flexShrink:0}}/>}
    <span style={{minWidth:140,fontSize:12,color:T.inkDim,textTransform:'uppercase',letterSpacing:'0.08em'}}>{label}</span>
    <span style={{fontSize:13,color:T.ink,fontWeight:600,flex:1,wordBreak:'break-word'}}>{value||'—'}</span>
  </div>
);

function SingleOutpass({id}){
  const[outpass,setOutpass]=useState(null);
  const[loading,setLoading]=useState(true);
  const[error,setError]=useState('');

  const fetch_=async()=>{
    setLoading(true);
    try{
      const token=localStorage.getItem('token');
      const res=await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/outpass/my-passes`,{headers:{Authorization:`Bearer ${token}`}});
      const data=await res.json();
      const found=data.outpasses?.find(o=>o._id===id);
      if(found)setOutpass(found);else setError('Outpass not found.');
    }catch{setError('Failed to load.');}
    finally{setLoading(false);}
  };
  useEffect(()=>{fetch_();},[id]);

  if(loading)return<div style={{padding:48,textAlign:'center',color:T.inkSoft}}>Loading…</div>;
  if(error)  return<div style={{padding:48,textAlign:'center',color:T.err}}>{error}</div>;
  if(!outpass)return null;

  const fmt=d=>d?new Date(d).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}):'—';

  const timeline=[
    {label:'Request Submitted',                done:true,time:fmt(outpass.createdAt),color:'#1A9B5C'},
    {label:'Parent Notified (Email + WhatsApp)',done:true,time:fmt(outpass.createdAt),color:'#1A9B5C'},
    {label:outpass.parentDecision?`Parent ${outpass.parentDecision==='approved'?'Approved ✅':'Rejected ❌'}`:'Waiting for Parent Response',done:!!outpass.parentDecision,time:outpass.verifiedAt?fmt(outpass.verifiedAt):'Pending',color:outpass.parentDecision==='approved'?'#1A9B5C':outpass.parentDecision==='rejected'?'#B02A20':'#B07A10'},
    {label:outpass.status==='approved'?'Admin Approved ✅':outpass.status==='rejected'?'Admin Rejected ❌':'Admin Review',done:['approved','rejected'].includes(outpass.status),time:outpass.adminDecidedAt?fmt(outpass.adminDecidedAt):'Pending',color:outpass.status==='approved'?'#1A9B5C':outpass.status==='rejected'?'#B02A20':T.border},
  ];

  return(
    <div style={{maxWidth:680,margin:'0 auto'}}>
      <Link to="/student/status" style={{display:'inline-flex',alignItems:'center',gap:6,fontSize:13,color:T.inkSoft,textDecoration:'none',marginBottom:20,transition:'color 0.2s'}}
        onMouseEnter={e=>e.currentTarget.style.color=T.ink} onMouseLeave={e=>e.currentTarget.style.color=T.inkSoft}>
        <ArrowLeft size={14}/> Back to all requests
      </Link>

      {/* Header */}
      <div style={{...CARD,marginBottom:14,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:0,left:'10%',right:'10%',height:3,background:`linear-gradient(90deg,transparent,${T.mid},transparent)`,borderRadius:2}}/>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:12,paddingTop:8}}>
          <div>
            <h2 style={{fontWeight:800,fontSize:22,color:T.ink,letterSpacing:-0.5,marginBottom:5}}>{outpass.destination}</h2>
            <p style={{color:T.inkDim,fontSize:12,letterSpacing:'0.04em'}}>Submitted {fmt(outpass.createdAt)}</p>
          </div>
          <StatusPill status={outpass.status}/>
        </div>
      </div>

      {/* Timeline */}
      <div style={{...CARD,marginBottom:14}}>
        <h3 style={{fontWeight:700,fontSize:15,color:T.mid,marginBottom:22}}>Approval Timeline</h3>
        {timeline.map((step,i)=>(
          <div key={i} style={{display:'flex',gap:14,marginBottom:i<timeline.length-1?18:0}}>
            <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
              <div style={{width:32,height:32,borderRadius:'50%',background:step.done?`${step.color}18`:T.snow,border:`1.5px solid ${step.done?step.color:T.border}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,boxShadow:step.done?`0 0 12px ${step.color}32`:'none'}}>
                {step.done?<CheckCircle size={13} style={{color:step.color}}/>:<Clock size={13} style={{color:T.inkDim}}/>}
              </div>
              {i<timeline.length-1&&<div style={{width:1,flex:1,background:`linear-gradient(to bottom,${step.done?step.color+'40':T.border},transparent)`,margin:'6px 0'}}/>}
            </div>
            <div style={{paddingTop:6}}>
              <p style={{margin:0,fontSize:13,fontWeight:600,color:step.done?T.ink:T.inkDim}}>{step.label}</p>
              <p style={{margin:'3px 0 0',fontSize:10,color:T.inkDim,letterSpacing:'0.04em'}}>{step.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Parent Verification */}
      {outpass.parentDecision&&(
        <div style={{background:outpass.parentDecision==='approved'?'rgba(26,155,92,0.08)':'rgba(176,42,32,0.08)',border:`1px solid ${outpass.parentDecision==='approved'?'rgba(26,155,92,0.24)':'rgba(176,42,32,0.24)'}`,borderRadius:18,padding:22,marginBottom:14,backdropFilter:'blur(14px)'}}>
          <h3 style={{fontWeight:700,fontSize:15,color:outpass.parentDecision==='approved'?'#1A9B5C':'#B02A20',marginBottom:14}}>Parent Verification</h3>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
            {outpass.parentDecision==='approved'?<CheckCircle size={19} style={{color:'#1A9B5C'}}/>:<XCircle size={19} style={{color:'#B02A20'}}/>}
            <span style={{fontWeight:700,fontSize:14,color:outpass.parentDecision==='approved'?'#1A9B5C':'#B02A20'}}>Your parent has {outpass.parentDecision} this request</span>
          </div>
          {outpass.verifiedAt&&<p style={{fontSize:12,color:T.inkSoft,margin:0}}> Verified on {new Date(outpass.verifiedAt).toLocaleString('en-IN')}</p>}
        </div>
      )}

      {/* Admin Decision */}
      {['approved','rejected'].includes(outpass.status)&&(
        <div style={{background:outpass.status==='approved'?'rgba(26,155,92,0.08)':'rgba(176,42,32,0.08)',border:`1px solid ${outpass.status==='approved'?'rgba(26,155,92,0.24)':'rgba(176,42,32,0.24)'}`,borderRadius:18,padding:20,marginBottom:14,backdropFilter:'blur(14px)'}}>
          <p style={{margin:0,fontWeight:700,fontSize:15,color:outpass.status==='approved'?'#1A9B5C':'#B02A20'}}>
            {outpass.status==='approved'?'✅ Outpass Approved!':'❌ Outpass Rejected'}
          </p>
          {outpass.adminNote&&<p style={{margin:'8px 0 0',fontSize:13,color:T.inkSoft}}>Admin note: {outpass.adminNote}</p>}
        </div>
      )}

      {/* Trip Details */}
      <div style={CARD}>
        <h3 style={{fontWeight:700,fontSize:15,color:T.mid,marginBottom:18}}>Trip Details</h3>
        <Row label="Destination"  value={outpass.destination}  icon={MapPin}/>
        <Row label="Reason"       value={outpass.reason}        icon={MapPin}/>
        <Row label="Departure"    value={fmt(outpass.leaveDateFrom)} icon={Calendar}/>
        <Row label="Return"       value={fmt(outpass.leaveDateTo)}   icon={Calendar}/>
        <Row label="Hostel Room"  value={outpass.hostelRoom}    icon={Home}/>
        <Row label="Parent"       value={`${outpass.parentRelation} · ${outpass.parentContact}`} icon={User}/>
      </div>
    </div>
  );
}

function AllOutpasses(){
  const[outpasses,setOutpasses]=useState([]);
  const[loading,setLoading]=useState(true);
  const[refreshing,setRefreshing]=useState(false);

  const load=async()=>{
    try{
      const token=localStorage.getItem('token');
      const res=await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/outpass/my-passes`,{headers:{Authorization:`Bearer ${token}`}});
      const data=await res.json();
      setOutpasses(data.outpasses||[]);
    }catch{}finally{setLoading(false);setRefreshing(false);}
  };
  useEffect(()=>{load();},[]);
  const fmt=d=>d?new Date(d).toLocaleDateString('en-IN',{day:'2-digit',month:'short'}):'—';

  return(
    <div style={{maxWidth:680,margin:'0 auto'}}>
      <style>{GCSS+`@keyframes spin{to{transform:rotate(360deg)}}.op-card{transition:all 0.22s cubic-bezier(0.22,1,0.36,1)}.op-card:hover{transform:translateY(-3px);box-shadow:0 18px 48px rgba(91,74,155,0.22)!important;border-color:rgba(107,90,176,0.38)!important}`}</style>

      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:26}}>
        <div>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:7}}>
            <div style={{width:7,height:7,borderRadius:'50%',background:T.mid,boxShadow:`0 0 8px ${T.glow}`}}/>
            <span style={{color:T.mid,fontSize:10,fontWeight:700,letterSpacing:'0.26em',textTransform:'uppercase'}}>My Requests</span>
          </div>
          <h2 style={{fontWeight:800,fontSize:24,color:T.ink,letterSpacing:-0.5,margin:0}}>Outpass History</h2>
        </div>
        <button onClick={()=>{setRefreshing(true);load();}}
          style={{display:'flex',alignItems:'center',gap:7,padding:'10px 18px',border:`1.5px solid ${T.border}`,borderRadius:12,background:'rgba(255,255,255,0.62)',cursor:'pointer',fontSize:13,color:T.inkSoft,backdropFilter:'blur(14px)',transition:'all 0.2s'}}
          onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.88)';e.currentTarget.style.color=T.inkMid;}}
          onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.62)';e.currentTarget.style.color=T.inkSoft;}}>
          <RefreshCw size={13} style={{animation:refreshing?'spin 1s linear infinite':'none'}}/>
          Refresh
        </button>
      </div>

      {loading?(
        <div style={{padding:48,textAlign:'center',color:T.inkSoft}}>Loading…</div>
      ):outpasses.length===0?(
        <div style={CARD}>
          <div style={{textAlign:'center',padding:'28px 0'}}>
            <div style={{width:58,height:58,background:'rgba(107,90,176,0.10)',border:`1px solid ${T.border}`,borderRadius:17,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 18px'}}>
              <MapPin size={24} style={{color:T.mid}}/>
            </div>
            <p style={{color:T.inkSoft,fontSize:14,marginBottom:18}}>No outpass requests yet.</p>
            <Link to="/student/request" style={{display:'inline-flex',alignItems:'center',gap:8,padding:'11px 24px',background:`linear-gradient(135deg,${T.deep},${T.mid})`,color:'#fff',borderRadius:12,textDecoration:'none',fontSize:14,fontWeight:700,boxShadow:`0 5px 18px rgba(91,74,155,0.34)`}}>
              Apply Now
            </Link>
          </div>
        </div>
      ):(
        <div style={{display:'flex',flexDirection:'column',gap:11}}>
          {outpasses.map(o=>{
            const dot={pending:'#B07A10','pending-admin':T.mid,approved:'#1A9B5C',rejected:'#B02A20'};
            return(
              <Link key={o._id} to={`/student/status/${o._id}`} style={{textDecoration:'none'}}>
                <div className="op-card" style={{background:'rgba(255,255,255,0.62)',backdropFilter:'blur(24px)',border:`1px solid rgba(255,255,255,0.86)`,borderRadius:16,padding:'17px 22px',display:'flex',justifyContent:'space-between',alignItems:'center',boxShadow:'0 5px 22px rgba(91,74,155,0.10)'}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:5}}>
                      <div style={{width:9,height:9,borderRadius:'50%',background:dot[o.status]||T.border,boxShadow:`0 0 7px ${dot[o.status]||'transparent'}`,flexShrink:0}}/>
                      <p style={{fontWeight:700,fontSize:15,color:T.ink,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{o.destination}</p>
                    </div>
                    <p style={{fontSize:11,color:T.inkDim,marginBottom:o.parentDecision?4:0}}>
                      {fmt(o.leaveDateFrom)} → {fmt(o.leaveDateTo)} · {o.reason?.slice(0,42)}
                    </p>
                    {o.parentDecision&&(
                      <p style={{fontSize:11,color:o.parentDecision==='approved'?'#1A9B5C':'#B02A20',fontWeight:700}}>
                        Parent: {o.parentDecision}
                      </p>
                    )}
                  </div>
                  <StatusPill status={o.status}/>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function OutpassStatus(){
  const{id}=useParams();
  return(<StudentLayout><div style={{padding:'8px 0'}}>{id?<SingleOutpass id={id}/>:<AllOutpasses/>}</div></StudentLayout>);
}