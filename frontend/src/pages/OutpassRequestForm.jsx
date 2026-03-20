// src/pages/OutpassRequestForm.jsx
import{useState,useEffect}from'react';
import{useNavigate}from'react-router-dom';
import{FiUser,FiMapPin,FiCalendar,FiMessageSquare,FiPhone,FiMail,FiHome,FiCheckCircle,FiArrowRight,FiArrowLeft,FiAlertCircle,FiHash,FiClock}from'react-icons/fi';
import StudentLayout from'../components/StudentLayout';
import{useAuth}from'../context/AuthContext';
import{T,GCSS}from'../components/Pagebackground';

const CARD={background:'rgba(255,255,255,0.62)',backdropFilter:'blur(28px)',border:'1px solid rgba(255,255,255,0.86)',borderRadius:20,overflow:'hidden',boxShadow:'0 8px 32px rgba(91,74,155,0.12)'};

const STEPS=[
  {id:1,label:'Personal Info',  icon:FiUser},
  {id:2,label:'Trip Details',   icon:FiMapPin},
  {id:3,label:'Parent Contact', icon:FiPhone},
  {id:4,label:'Review',         icon:FiCheckCircle},
];

function Field({label,icon:Icon,error,textarea,...props}){
  const[f,sF]=useState(false);
  const base={width:'100%',paddingLeft:Icon?40:14,paddingRight:14,paddingTop:12,paddingBottom:12,borderRadius:12,fontSize:13,outline:'none',resize:'none',border:`1.5px solid ${error?T.errBd:f?T.focusBd:T.inputBd}`,background:f?T.focusBg:T.inputBg,color:T.ink,transition:'all 0.25s',boxShadow:error?`0 0 0 3px ${T.errBg}`:f?T.focusSh:'none'};
  return(
    <div>
      <label style={{display:'block',fontSize:9.5,fontWeight:700,letterSpacing:'0.22em',textTransform:'uppercase',color:f?T.mid:T.inkDim,marginBottom:7,transition:'color 0.2s'}}>{label}</label>
      <div style={{position:'relative'}}>
        {Icon&&<Icon size={14} style={{position:'absolute',left:13,top:textarea?'14px':'50%',transform:textarea?'none':'translateY(-50%)',color:f?T.mid:T.inkDim,pointerEvents:'none',transition:'color 0.25s'}}/>}
        {textarea?<textarea {...props} rows={3} style={base} onFocus={()=>sF(true)} onBlur={()=>sF(false)}/>:<input {...props} style={base} onFocus={()=>sF(true)} onBlur={()=>sF(false)}/>}
      </div>
      {error&&<p style={{fontSize:11,color:T.err,marginTop:5,display:'flex',alignItems:'center',gap:4}}><FiAlertCircle size={11}/>{error}</p>}
    </div>
  );
}

export default function OutpassRequestForm(){
  const navigate=useNavigate();
  const{user}=useAuth();
  const[step,setStep]=useState(1);
  const[loading,setLoading]=useState(false);
  const[submitted,setSubmitted]=useState(false);
  const[submittedId,setSubmittedId]=useState(null);
  const[errors,setErrors]=useState({});
  const[parentsList,setParentsList]=useState([]);
  const[selectedParent,setSelectedParent]=useState(null);
  const[form,setForm]=useState({studentName:user?.name||'',studentId:user?.studentId||'',hostelRoom:user?.hostelRoom||'',destination:'',reason:'',leaveDateFrom:'',leaveDateTo:'',timeFrom:'',timeTo:'',parentRelation:'',parentContact:'',parentEmail:''});

  useEffect(()=>{
    const token=localStorage.getItem('token');
    fetch('/api/parents/list',{headers:{Authorization:`Bearer ${token}`}}).then(r=>r.json()).then(d=>setParentsList(d.parents||[])).catch(()=>setParentsList([]));
  },[]);

  const set=k=>e=>setForm(f=>({...f,[k]:e.target.value}));
  const validate=s=>{
    const e={};
    if(s===1){if(!form.studentName.trim())e.studentName='Required';if(!form.studentId.trim())e.studentId='Required';if(!form.hostelRoom.trim())e.hostelRoom='Required';}
    if(s===2){if(!form.destination.trim())e.destination='Required';if(!form.leaveDateFrom)e.leaveDateFrom='Required';if(!form.leaveDateTo)e.leaveDateTo='Required';if(form.leaveDateFrom&&form.leaveDateTo&&form.leaveDateTo<form.leaveDateFrom)e.leaveDateTo='Return must be after departure';if(!form.reason.trim())e.reason='Required';}
    if(s===3){if(!form.parentRelation.trim())e.parentRelation='Please select a parent';if(!form.parentContact)e.parentContact='Parent phone missing';if(!form.parentEmail)e.parentEmail='Parent email missing';}
    return e;
  };
  const next=()=>{const e=validate(step);if(Object.keys(e).length){setErrors(e);return;}setErrors({});setStep(s=>s+1);};

  const submit=async()=>{
    setLoading(true);setErrors({});
    const payload={studentName:form.studentName,studentId:form.studentId,hostelRoom:form.hostelRoom,destination:form.destination,reason:form.reason,leaveDateFrom:form.leaveDateFrom,leaveDateTo:form.leaveDateTo,parentRelation:form.parentRelation,parentContact:form.parentContact,parentEmail:form.parentEmail,...(form.timeFrom?{timeFrom:form.timeFrom}:{}),...(form.timeTo?{timeTo:form.timeTo}:{})};
    try{
      const token=localStorage.getItem('token');
      const res=await fetch('/api/outpass/apply',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify(payload)});
      const ct=res.headers.get('content-type')||'';
      if(!ct.includes('application/json')){const t=await res.text();throw new Error(t.startsWith('<!DOCTYPE')?'Backend not reachable':`Unexpected response (${res.status})`);}
      const data=await res.json();
      if(!res.ok)throw new Error(data.message||`Request failed (${res.status})`);
      setSubmittedId(data?.outpass?._id||null);setSubmitted(true);
    }catch(err){setErrors({submit:err.message||'Submission failed. Please try again.'});}
    finally{setLoading(false);}
  };

  const today=new Date().toISOString().split('T')[0];
  const StepIcon=STEPS[step-1].icon;

  const reviewRows=[
    {icon:FiUser,label:'Full Name',  val:form.studentName},
    {icon:FiHash,label:'Student ID', val:form.studentId},
    {icon:FiHome,label:'Hostel Room',val:form.hostelRoom},
    {icon:FiMapPin,label:'Destination',val:form.destination},
    {icon:FiCalendar,label:'Departure', val:form.leaveDateFrom?new Date(form.leaveDateFrom).toLocaleDateString('en-IN'):'—'},
    {icon:FiCalendar,label:'Return',    val:form.leaveDateTo?new Date(form.leaveDateTo).toLocaleDateString('en-IN'):'—'},
    {icon:FiClock,label:'Time',       val:[form.timeFrom,form.timeTo].filter(Boolean).join(' → ')||'—'},
    {icon:FiUser,label:'Parent',      val:selectedParent?`${selectedParent.name} (${selectedParent.relation})`:'—'},
    {icon:FiPhone,label:'WhatsApp',   val:form.parentContact},
    {icon:FiMail,label:'Parent Email',val:form.parentEmail||'—'},
    {icon:FiMessageSquare,label:'Reason',val:form.reason},
  ];

  if(submitted)return(
    <StudentLayout>
      <style>{GCSS+`@keyframes successPop{from{opacity:0;transform:scale(0.82)}to{opacity:1;transform:scale(1)}}.btn-p{transition:all 0.28s cubic-bezier(0.22,1,0.36,1);position:relative;overflow:hidden}.btn-p:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 12px 30px rgba(91,74,155,0.44)!important}`}</style>
      <div style={{maxWidth:520,margin:'0 auto',textAlign:'center',paddingTop:32}}>
        <div style={{width:90,height:90,background:'rgba(26,155,92,0.11)',border:'2px solid rgba(26,155,92,0.28)',borderRadius:26,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 26px',animation:'successPop 0.5s cubic-bezier(0.22,1,0.36,1)',boxShadow:'0 0 40px rgba(26,155,92,0.20)'}}>
          <FiCheckCircle size={44} style={{color:'#1A9B5C'}}/>
        </div>
        <h2 style={{fontWeight:800,fontSize:28,color:T.ink,letterSpacing:-0.8,marginBottom:8}}>Request Submitted!</h2>
        <p style={{color:T.inkSoft,marginBottom:28,fontSize:13}}>Your outpass request was saved successfully.</p>

        <div style={{background:'rgba(176,122,16,0.07)',border:'1px solid rgba(176,122,16,0.22)',borderRadius:18,padding:'20px 22px',marginBottom:28,textAlign:'left',backdropFilter:'blur(14px)'}}>
          <p style={{fontSize:10,fontWeight:700,color:'rgba(176,122,16,0.90)',letterSpacing:'0.22em',textTransform:'uppercase',marginBottom:14}}>⚡ n8n automation triggered:</p>
          {[{icon:'📧',text:`Approval email sent to ${form.parentEmail}`},{icon:'💬',text:'WhatsApp message sent to parent'},{icon:'📞',text:'Voice call placed to parent'},{icon:'🧠',text:"AI will analyze parent's response"}].map((item,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 0',borderBottom:i<3?'1px solid rgba(176,122,16,0.12)':'none'}}>
              <span style={{fontSize:16}}>{item.icon}</span>
              <span style={{fontSize:13,color:'rgba(140,96,12,0.88)'}}>{item.text}</span>
            </div>
          ))}
        </div>

        <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
          <button onClick={()=>{setSubmitted(false);setStep(1);setSelectedParent(null);setForm(f=>({...f,destination:'',reason:'',leaveDateFrom:'',leaveDateTo:'',timeFrom:'',timeTo:'',parentRelation:'',parentContact:'',parentEmail:''}));}}
            style={{display:'inline-flex',alignItems:'center',gap:8,padding:'12px 24px',borderRadius:13,background:'rgba(255,255,255,0.62)',border:`1.5px solid ${T.border}`,color:T.inkSoft,fontSize:14,fontWeight:600,cursor:'pointer',backdropFilter:'blur(14px)',transition:'all 0.2s'}}
            onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.88)';e.currentTarget.style.color=T.inkMid;}}
            onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.62)';e.currentTarget.style.color=T.inkSoft;}}>
            New Request
          </button>
          <button onClick={()=>navigate(submittedId?`/student/status/${submittedId}`:'/student/status')} className="btn-p"
            style={{display:'inline-flex',alignItems:'center',gap:8,padding:'12px 24px',borderRadius:13,background:`linear-gradient(135deg,${T.deep},${T.mid})`,border:'none',color:'#fff',fontSize:14,fontWeight:700,cursor:'pointer',boxShadow:`0 6px 22px rgba(91,74,155,0.34)`}}>
            Track Status <FiArrowRight size={14}/>
          </button>
        </div>
      </div>
    </StudentLayout>
  );

  return(
    <StudentLayout>
      <style>{GCSS+`input[type=date]::-webkit-calendar-picker-indicator,input[type=time]::-webkit-calendar-picker-indicator{filter:invert(0.3) sepia(1) saturate(4) hue-rotate(220deg);cursor:pointer}input::placeholder,textarea::placeholder{color:rgba(46,31,107,0.36)!important}@keyframes spin{to{transform:rotate(360deg)}}.btn-p{transition:all 0.28s cubic-bezier(0.22,1,0.36,1);position:relative;overflow:hidden}.btn-p:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 12px 30px rgba(91,74,155,0.44)!important}.btn-ghost{transition:all 0.22s}.btn-ghost:hover{background:rgba(237,232,248,0.90)!important;border-color:#6B5AB0!important}.pc{transition:all 0.22s cubic-bezier(0.22,1,0.36,1)}.pc:hover{transform:translateY(-2px)}`}</style>

      <div style={{maxWidth:640,margin:'0 auto'}}>
        <div style={{marginBottom:28}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
            <div style={{width:7,height:7,borderRadius:'50%',background:T.mid,boxShadow:`0 0 8px ${T.glow}`}}/>
            <span style={{color:T.mid,fontSize:10,fontWeight:700,letterSpacing:'0.26em',textTransform:'uppercase'}}>Outpass Application</span>
          </div>
          <h1 style={{fontWeight:800,fontSize:26,color:T.ink,letterSpacing:-0.7,marginBottom:5}}>New Outpass Request</h1>
          <p style={{color:T.inkSoft,fontSize:13}}>Fill all details carefully. Your parent is notified automatically on submit.</p>
        </div>

        {/* Step indicators */}
        <div style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:24}}>
          {STEPS.map(({id,label,icon:Icon})=>{
            const isActive=step===id,isDone=step>id;
            return(
              <div key={id} style={{display:'flex',alignItems:'center',gap:7,padding:'9px 17px',borderRadius:12,fontSize:13,fontWeight:600,background:isActive?`linear-gradient(135deg,${T.deep},${T.mid})`:isDone?'rgba(26,155,92,0.09)':'rgba(255,255,255,0.55)',color:isActive?'#fff':isDone?'#1A9B5C':T.inkDim,border:isDone?'1px solid rgba(26,155,92,0.24)':`1px solid ${T.border}`,boxShadow:isActive?`0 4px 16px rgba(91,74,155,0.30)`:'none',backdropFilter:'blur(12px)',transition:'all 0.3s'}}>
                {isDone?<FiCheckCircle size={13}/>:<Icon size={13}/>}
                <span>{label}</span>
              </div>
            );
          })}
        </div>

        {/* Form card */}
        <div style={CARD}>
          <div style={{position:'absolute',top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${T.deep},${T.mid},${T.bright})`}}/>
          <div style={{display:'flex',alignItems:'center',gap:9,padding:'17px 24px',borderBottom:`1px solid ${T.border}`,background:'rgba(246,243,253,0.70)'}}>
            <StepIcon size={15} style={{color:T.mid}}/>
            <span style={{fontWeight:700,fontSize:15,color:T.ink}}>Step {step} of {STEPS.length}: {STEPS[step-1].label}</span>
          </div>

          <div style={{padding:'24px',display:'flex',flexDirection:'column',gap:18}}>

            {step===1&&<>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
                <Field label="Full Name *" icon={FiUser} placeholder="Your full name" value={form.studentName} onChange={set('studentName')} error={errors.studentName}/>
                <Field label="Student ID *" icon={FiHash} placeholder="e.g. CS2021001" value={form.studentId} onChange={set('studentId')} error={errors.studentId}/>
              </div>
              <Field label="Hostel Room *" icon={FiHome} placeholder="e.g. A-204" value={form.hostelRoom} onChange={set('hostelRoom')} error={errors.hostelRoom}/>
              <div style={{padding:'12px 15px',background:T.snow,border:`1px solid ${T.border}`,borderRadius:12}}>
                <p style={{fontSize:12,color:T.inkSoft,margin:0}}>ℹ️ Enter block + room together, e.g. <strong>A-204</strong></p>
              </div>
            </>}

            {step===2&&<>
              <Field label="Destination *" icon={FiMapPin} placeholder="City / Place you are visiting" value={form.destination} onChange={set('destination')} error={errors.destination}/>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
                <Field label="Departure Date *" icon={FiCalendar} type="date" min={today} value={form.leaveDateFrom} onChange={set('leaveDateFrom')} error={errors.leaveDateFrom}/>
                <Field label="Return Date *" icon={FiCalendar} type="date" min={form.leaveDateFrom||today} value={form.leaveDateTo} onChange={set('leaveDateTo')} error={errors.leaveDateTo}/>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
                <Field label="Departure Time (optional)" icon={FiClock} type="time" value={form.timeFrom} onChange={set('timeFrom')}/>
                <Field label="Return Time (optional)" icon={FiClock} type="time" value={form.timeTo} onChange={set('timeTo')}/>
              </div>
              <Field label="Reason *" icon={FiMessageSquare} placeholder="Purpose of travel…" value={form.reason} onChange={set('reason')} error={errors.reason} textarea/>
            </>}

            {step===3&&<>
              <div style={{padding:'12px 15px',background:'rgba(176,122,16,0.07)',border:'1px solid rgba(176,122,16,0.22)',borderRadius:12}}>
                <p style={{fontSize:12,color:'rgba(140,96,12,0.88)',margin:0}}>⚡ Select your parent. They will receive an <strong>approval email</strong> and <strong>WhatsApp</strong> automatically.</p>
              </div>
              <div>
                <label style={{display:'block',fontSize:9.5,fontWeight:700,letterSpacing:'0.22em',textTransform:'uppercase',color:T.inkDim,marginBottom:12}}>Select Parent *</label>
                {parentsList.length===0?(
                  <div style={{padding:'16px',background:T.errBg,border:`1px solid ${T.errBd}`,borderRadius:12,display:'flex',alignItems:'flex-start',gap:10}}>
                    <FiAlertCircle size={15} style={{color:T.err,flexShrink:0,marginTop:1}}/>
                    <span style={{fontSize:13,color:T.err}}>No parents registered yet. Please contact your hostel admin to add your parent first.</span>
                  </div>
                ):(
                  <div style={{display:'flex',flexDirection:'column',gap:10}}>
                    {parentsList.map(p=>(
                      <label key={p._id} className="pc" style={{display:'flex',alignItems:'center',gap:14,padding:'15px 17px',borderRadius:14,cursor:'pointer',background:selectedParent?._id===p._id?'rgba(107,90,176,0.09)':'rgba(255,255,255,0.62)',border:`1.5px solid ${selectedParent?._id===p._id?T.mid:T.border}`,boxShadow:selectedParent?._id===p._id?`0 0 0 1px rgba(107,90,176,0.20),0 5px 18px rgba(91,74,155,0.14)`:'none',backdropFilter:'blur(12px)'}}>
                        <input type="radio" name="parent" value={p._id} checked={selectedParent?._id===p._id}
                          onChange={()=>{setSelectedParent(p);setForm(f=>({...f,parentRelation:p.relation,parentContact:p.phone,parentEmail:p.email}));}}
                          style={{accentColor:T.mid,width:16,height:16,flexShrink:0}}/>
                        <div style={{flex:1,minWidth:0}}>
                          <p style={{fontWeight:700,fontSize:14,color:T.ink,marginBottom:3}}>{p.name} <span style={{fontWeight:400,color:T.inkSoft,fontSize:12}}>({p.relation})</span></p>
                          <p style={{fontSize:12,color:T.inkDim}}>{p.phone} · {p.email}</p>
                        </div>
                        {selectedParent?._id===p._id&&<FiCheckCircle size={18} style={{color:T.mid,flexShrink:0}}/>}
                      </label>
                    ))}
                  </div>
                )}
                {errors.parentRelation&&<p style={{fontSize:11,color:T.err,marginTop:8,display:'flex',alignItems:'center',gap:4}}><FiAlertCircle size={11}/>{errors.parentRelation}</p>}
              </div>
            </>}

            {step===4&&<>
              <p style={{fontSize:13,color:T.inkSoft}}>Review your details before submitting.</p>
              <div style={{background:T.snow,border:`1px solid ${T.border}`,borderRadius:15,overflow:'hidden'}}>
                {reviewRows.map((row,i)=>{
                  const Icon=row.icon;
                  return(
                    <div key={i} style={{display:'flex',alignItems:'flex-start',gap:12,padding:'12px 18px',borderBottom:i<reviewRows.length-1?`1px solid ${T.border}`:'none'}}>
                      <Icon size={13} style={{color:T.mid,marginTop:1,flexShrink:0}}/>
                      <div style={{flex:1,minWidth:0}}>
                        <p style={{fontSize:10,color:T.inkDim,marginBottom:2,letterSpacing:'0.10em',textTransform:'uppercase'}}>{row.label}</p>
                        <p style={{fontSize:13,fontWeight:600,color:T.ink,wordBreak:'break-word'}}>{row.val||'—'}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{padding:'13px 16px',background:'rgba(107,90,176,0.07)',border:`1px solid ${T.border}`,borderRadius:12,display:'flex',gap:10}}>
                <span>🤖</span>
                <p style={{fontSize:12,color:T.inkSoft,margin:0,lineHeight:1.6}}>By clicking <strong>Submit Request</strong>, you confirm all details are correct. An approval request will be sent to <strong>{selectedParent?.name||form.parentEmail}</strong>.</p>
              </div>
              {errors.submit&&(
                <div style={{padding:'13px 16px',background:T.errBg,border:`1px solid ${T.errBd}`,borderRadius:12,display:'flex',gap:10,alignItems:'flex-start'}}>
                  <FiAlertCircle size={15} style={{color:T.err,flexShrink:0,marginTop:1}}/>
                  <span style={{fontSize:13,color:T.err}}>{errors.submit}</span>
                </div>
              )}
            </>}
          </div>

          {/* Footer */}
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'16px 24px',borderTop:`1px solid ${T.border}`,background:'rgba(246,243,253,0.70)'}}>
            <button disabled={step===1} onClick={()=>setStep(s=>s-1)} className="btn-ghost"
              style={{display:'flex',alignItems:'center',gap:7,padding:'11px 21px',borderRadius:13,background:'rgba(255,255,255,0.72)',border:`1.5px solid ${T.border}`,color:step===1?T.inkDim:T.inkSoft,fontSize:14,fontWeight:600,cursor:step===1?'not-allowed':'pointer',backdropFilter:'blur(12px)'}}>
              <FiArrowLeft size={14}/> Previous
            </button>
            {step<4?(
              <button onClick={next} className="btn-p"
                style={{display:'flex',alignItems:'center',gap:8,padding:'11px 26px',borderRadius:13,background:`linear-gradient(135deg,${T.deep},${T.mid})`,border:'none',color:'#fff',fontSize:14,fontWeight:700,cursor:'pointer',boxShadow:`0 7px 22px rgba(91,74,155,0.34)`}}>
                Next <FiArrowRight size={14}/>
              </button>
            ):(
              <button onClick={submit} disabled={loading} className="btn-p"
                style={{display:'flex',alignItems:'center',gap:8,padding:'11px 26px',borderRadius:13,background:`linear-gradient(135deg,${T.deep},${T.mid})`,border:'none',color:'#fff',fontSize:14,fontWeight:700,cursor:loading?'not-allowed':'pointer',boxShadow:`0 7px 22px rgba(91,74,155,0.34)`,opacity:loading?0.76:1}}>
                {loading?<><svg style={{animation:'spin 1s linear infinite',width:15,height:15}} viewBox="0 0 24 24" fill="none"><circle style={{opacity:0.25}} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path style={{opacity:0.75}} fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> Submitting…</>:<><FiCheckCircle size={15}/> Submit Request</>}
              </button>
            )}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}