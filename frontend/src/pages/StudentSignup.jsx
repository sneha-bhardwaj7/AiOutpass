// src/pages/StudentSignup.jsx
import{useState,useEffect}from'react';
import{Link,useNavigate}from'react-router-dom';
import{FiUser,FiMail,FiLock,FiEye,FiEyeOff,FiArrowRight,FiHash,FiHome,FiPhone,FiCheckCircle,FiAlertCircle,FiLoader,FiArrowLeft,FiShield}from'react-icons/fi';
import{MdOutlineSchool}from'react-icons/md';
import{useAuth}from'../context/AuthContext';
import PageBackground,{T,GCSS}from'../components/Pagebackground';

function Field({label,icon:Icon,type='text',value,onChange,placeholder,error,success,rightEl}){
  const[f,sF]=useState(false);
  return(
    <div style={{display:'flex',flexDirection:'column',gap:6}}>
      <label style={{fontSize:9.5,fontWeight:700,letterSpacing:'0.24em',textTransform:'uppercase',color:f?T.mid:error?T.err:T.inkDim,transition:'color 0.2s'}}>{label}</label>
      <div style={{position:'relative'}}>
        <div style={{position:'absolute',left:13,top:'50%',transform:'translateY(-50%)',color:f?T.mid:error?T.err:T.inkDim,transition:'color 0.22s',pointerEvents:'none'}}><Icon size={14}/></div>
        <input type={type} value={value} onChange={onChange} placeholder={placeholder}
          onFocus={()=>sF(true)} onBlur={()=>sF(false)}
          style={{width:'100%',padding:rightEl?'12px 42px 12px 40px':'12px 14px 12px 40px',borderRadius:12,border:`1.5px solid ${error?T.errBd:success?'rgba(26,155,92,0.40)':f?T.focusBd:T.inputBd}`,background:f?T.focusBg:T.inputBg,color:T.ink,fontSize:13,transition:'all 0.22s',boxShadow:f?T.focusSh:'none'}}/>
        {rightEl&&<div style={{position:'absolute',right:11,top:'50%',transform:'translateY(-50%)',display:'flex',alignItems:'center',gap:4}}>{rightEl}</div>}
      </div>
      {error&&<p style={{fontSize:11,color:T.err}}>{error}</p>}
    </div>
  );
}

function SelectField({label,value,onChange,options,placeholder}){
  const[f,sF]=useState(false);
  return(
    <div style={{display:'flex',flexDirection:'column',gap:6}}>
      <label style={{fontSize:9.5,fontWeight:700,letterSpacing:'0.24em',textTransform:'uppercase',color:f?T.mid:T.inkDim,transition:'color 0.2s'}}>{label}</label>
      <select value={value} onChange={onChange} onFocus={()=>sF(true)} onBlur={()=>sF(false)}
        style={{width:'100%',padding:'12px 14px',borderRadius:12,appearance:'none',border:`1.5px solid ${f?T.focusBd:T.inputBd}`,background:f?T.focusBg:T.inputBg,color:value?T.ink:T.inkDim,fontSize:13,cursor:'pointer',transition:'all 0.22s',boxShadow:f?T.focusSh:'none'}}>
        <option value="">{placeholder}</option>
        {options.map(o=><option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function StrengthBar({password}){
  const s=()=>{if(!password)return 0;let n=0;if(password.length>=8)n++;if(/[A-Z]/.test(password))n++;if(/[0-9]/.test(password))n++;if(/[^A-Za-z0-9]/.test(password))n++;return n;};
  const sc=s();const cols=['','#E74C3C','#E8A020',T.mid,T.deep];const labs=['','Weak','Fair','Good','Strong'];
  if(!password)return null;
  return(<div style={{marginTop:8}}><div style={{display:'flex',gap:4,marginBottom:4}}>{[1,2,3,4].map(i=><div key={i} style={{flex:1,height:3,borderRadius:2,background:i<=sc?cols[sc]:T.soft,transition:'background 0.3s'}}/>)}</div><span style={{fontSize:10,color:cols[sc],fontWeight:600}}>{labs[sc]}</span></div>);
}

function StepBar({current}){
  return(
    <div style={{display:'flex',alignItems:'center',marginBottom:26}}>
      {[1,2].map((s,i)=>(
        <div key={s} style={{display:'flex',alignItems:'center'}}>
          <div style={{width:34,height:34,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:600,fontSize:13,background:current>s?`linear-gradient(135deg,${T.deep},${T.bright})`:current===s?`linear-gradient(135deg,${T.mid},${T.bright})`:T.snow,border:current>=s?'none':`1.5px solid ${T.border}`,color:current>=s?'#fff':T.inkDim,boxShadow:current===s?`0 4px 18px rgba(91,74,155,0.34)`:'none',transition:'all 0.4s cubic-bezier(0.22,1,0.36,1)'}}>
            {current>s?<FiCheckCircle size={14}/>:s}
          </div>
          {i<1&&<div style={{width:52,height:2,margin:'0 6px',borderRadius:2,background:current>1?`linear-gradient(90deg,${T.bright},${T.soft})`:T.soft,transition:'background 0.5s'}}/>}
        </div>
      ))}
      <span style={{fontSize:9,color:T.inkDim,letterSpacing:'0.22em',textTransform:'uppercase',marginLeft:12,fontWeight:600}}>Step {current} / 2</span>
    </div>
  );
}

export default function StudentSignup(){
  const[step,setStep]=useState(1);
  const[dir,setDir]=useState('forward');
  const[form,setForm]=useState({name:'',email:'',password:'',confirmPassword:'',collegeId:'',hostelRoom:'',phone:'',department:'',year:''});
  const[showPass,setShowPass]=useState(false);
  const[showConf,setShowConf]=useState(false);
  const[loading,setLoading]=useState(false);
  const[error,setError]=useState('');
  const[mounted,setMounted]=useState(false);
  const{login}=useAuth();
  const navigate=useNavigate();
  useEffect(()=>{const t=setTimeout(()=>setMounted(true),60);return()=>clearTimeout(t);},[]);
  const set=f=>e=>setForm(p=>({...p,[f]:e.target.value}));
  const canNext1=form.name.trim()&&form.email.trim()&&form.password.length>=8&&form.password===form.confirmPassword;
  const canSubmit=canNext1&&form.collegeId.trim()&&form.hostelRoom.trim();
  const goNext=()=>{setError('');setDir('forward');setStep(2);};
  const goBack=()=>{setError('');setDir('back');setStep(1);};

  const submit=async()=>{
    if(!canSubmit||loading)return;
    setLoading(true);setError('');
    try{
      const payload={name:form.name.trim(),email:form.email.trim().toLowerCase(),password:form.password,studentId:form.collegeId.trim(),hostelRoom:form.hostelRoom.trim(),phone:form.phone.trim()||undefined};
      const res=await fetch(`${import.meta.env.REACT_VITE_APP_BACKEND_URL}/api/auth/student/signup`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      const data=await res.json();
      if(!res.ok)throw new Error(data.message||'Signup failed');
      localStorage.setItem('token',data.token);
      login({_id:data.id,name:data.name,email:data.email,role:data.role},data.role,data.token);
      navigate('/student/dashboard');
    }catch(err){setError(err.message);}finally{setLoading(false);}
  };

  const anim=dir==='forward'?'slideR':'slideL';

  return(
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'40px 24px',position:'relative',overflow:'hidden'}}>
      <style>{GCSS+`@keyframes slideR{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}@keyframes slideL{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}`}</style>
      <PageBackground/>

      <div style={{width:'100%',maxWidth:470,position:'relative',zIndex:1,opacity:mounted?1:0,transform:mounted?'none':'translateY(16px)',transition:'all 0.6s cubic-bezier(0.22,1,0.36,1)'}}>

        {/* Logo */}
        {/* <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10,marginBottom:22}}>
          <div style={{width:40,height:40,borderRadius:12,background:`linear-gradient(135deg,${T.deep},${T.bright})`,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`0 5px 18px rgba(91,74,155,0.40)`}}>
            <MdOutlineSchool size={20} color="#fff"/>
          </div>
          <span style={{fontWeight:800,fontSize:21,color:T.ink,letterSpacing:-0.5}}>
            Pass<span style={{color:T.mid}}>Gate</span><span style={{fontWeight:300,color:T.inkSoft,fontSize:15}}> AI</span>
          </span>
        </div> */}

        {/* Glass card */}
        <div style={{background:T.glass,backdropFilter:'blur(36px)',border:`1px solid ${T.glassBd}`,borderRadius:26,boxShadow:T.glassSh,padding:'38px 34px',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',top:0,left:0,right:0,height:4,background:`linear-gradient(90deg,${T.deep},${T.mid},${T.bright})`}}/>
          <div style={{position:'absolute',top:0,right:0,width:180,height:180,borderRadius:'0 26px 0 100%',background:'rgba(139,123,200,0.08)',pointerEvents:'none'}}/>

          <StepBar current={step}/>

           {/* Header */}
                    <div style={{display:'flex',alignItems:'center',gap:15,marginBottom:24,paddingTop:6}}>
                      <div style={{width:54,height:54,borderRadius:15,flexShrink:0,background:`linear-gradient(135deg,${T.deep},${T.mid})`,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`0 8px 22px rgba(91,74,155,0.34)`,animation:'bob 3.5s ease-in-out infinite'}}>
                        <FiShield size={24} color="rgba(255,255,255,0.93)"/>
                      </div>
                      <div>
                        <h1 style={{fontWeight:800,fontSize:24,color:T.ink,letterSpacing:-0.6,lineHeight:1.1,marginBottom:4}}>Student Registration</h1>
                        <p style={{fontSize:12,color:T.inkSoft}}>Create an authorized Student account</p>
                      </div>
                    </div>
          
                    {/* Notice */}
                    <div style={{marginBottom:20,padding:'12px 15px',borderRadius:13,background:T.snow,border:`1px solid ${T.border}`,display:'flex',alignItems:'flex-start',gap:9}}>
                      <FiShield size={12} style={{color:T.mid,flexShrink:0,marginTop:2}}/>
                      <p style={{fontSize:12,color:T.inkSoft,lineHeight:1.68,margin:0}}>Student accounts require institutional approval. Unauthorized access is prohibited.</p>
                    </div>

          {error&&(
            <div style={{marginBottom:16,padding:'12px 15px',borderRadius:13,background:T.errBg,border:`1px solid ${T.errBd}`,display:'flex',alignItems:'flex-start',gap:9,animation:'fadeIn 0.3s both'}}>
              <FiAlertCircle size={13} color={T.err} style={{flexShrink:0,marginTop:1}}/>
              <span style={{fontSize:13,color:T.err,lineHeight:1.5}}>{error}</span>
            </div>
          )}

          {step===1&&(
            <div key="s1" style={{display:'flex',flexDirection:'column',gap:14,animation:`${anim} 0.35s cubic-bezier(0.22,1,0.36,1) both`}}>
              <Field label="Full Name" icon={FiUser} value={form.name} onChange={set('name')} placeholder="Your full name"/>
              <Field label="Email" icon={FiMail} type="email" value={form.email} onChange={set('email')} placeholder="student@college.edu"/>
              <div>
                <Field label="Password" icon={FiLock} type={showPass?'text':'password'} value={form.password} onChange={set('password')} placeholder="Min. 8 characters"
                  rightEl={<button type="button" onClick={()=>setShowPass(p=>!p)} style={{background:'none',border:'none',cursor:'pointer',color:T.inkDim,padding:0,display:'flex'}}>{showPass?<FiEyeOff size={14}/>:<FiEye size={14}/>}</button>}/>
                <StrengthBar password={form.password}/>
              </div>
              <Field label="Confirm Password" icon={FiLock} type={showConf?'text':'password'} value={form.confirmPassword} onChange={set('confirmPassword')} placeholder="Re-enter password"
                error={form.confirmPassword&&form.password!==form.confirmPassword?"Passwords don't match":''}
                success={form.confirmPassword&&form.password===form.confirmPassword}
                rightEl={<div style={{display:'flex',alignItems:'center',gap:4}}>{form.confirmPassword&&form.password===form.confirmPassword&&<FiCheckCircle size={13} color={T.ok}/>}<button type="button" onClick={()=>setShowConf(p=>!p)} style={{background:'none',border:'none',cursor:'pointer',color:T.inkDim,padding:0,display:'flex'}}>{showConf?<FiEyeOff size={14}/>:<FiEye size={14}/>}</button></div>}/>
              <button onClick={goNext} disabled={!canNext1} className="btn-p" style={{marginTop:6,padding:'13px 20px',borderRadius:14,border:'none',background:canNext1?`linear-gradient(135deg,${T.deep},${T.mid},${T.bright})`:'rgba(139,123,200,0.12)',color:canNext1?'#fff':T.inkDim,fontSize:14,fontWeight:700,cursor:canNext1?'pointer':'not-allowed',display:'flex',alignItems:'center',justifyContent:'center',gap:9,boxShadow:canNext1?`0 8px 26px rgba(91,74,155,0.36)`:'none'}}>
                Continue <FiArrowRight size={14}/>
              </button>
            </div>
          )}

          {step===2&&(
            <div key="s2" style={{display:'flex',flexDirection:'column',gap:14,animation:`${anim} 0.35s cubic-bezier(0.22,1,0.36,1) both`}}>
              <Field label="College ID / Roll No." icon={FiHash} value={form.collegeId} onChange={set('collegeId')} placeholder="e.g. CSE2021001"/>
              <Field label="Hostel & Room" icon={FiHome} value={form.hostelRoom} onChange={set('hostelRoom')} placeholder="e.g. Block A, Room 204"/>
              <Field label="Phone (optional)" icon={FiPhone} type="tel" value={form.phone} onChange={set('phone')} placeholder="+91 9876543210"/>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:11}}>
                <SelectField label="Department" value={form.department} onChange={set('department')} options={['CSE','ECE','ME','CE','EE','IT','Other']} placeholder="Select dept."/>
                <SelectField label="Year" value={form.year} onChange={set('year')} options={['1st Year','2nd Year','3rd Year','4th Year']} placeholder="Year"/>
              </div>
              <div style={{display:'flex',gap:11,marginTop:6}}>
                <button onClick={goBack} className="btn-ghost" style={{padding:'12px 17px',borderRadius:14,border:`1.5px solid ${T.border}`,background:T.snow,color:T.inkSoft,fontSize:13,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:7}}>
                  <FiArrowLeft size={13}/> Back
                </button>
                <button onClick={submit} disabled={!canSubmit||loading} className="btn-p" style={{flex:1,padding:'12px 18px',borderRadius:14,border:'none',background:canSubmit&&!loading?`linear-gradient(135deg,${T.deep},${T.mid},${T.bright})`:'rgba(139,123,200,0.12)',color:canSubmit&&!loading?'#fff':T.inkDim,fontSize:14,fontWeight:700,cursor:canSubmit&&!loading?'pointer':'not-allowed',display:'flex',alignItems:'center',justifyContent:'center',gap:9,boxShadow:canSubmit&&!loading?`0 8px 26px rgba(91,74,155,0.36)`:'none'}}>
                  {loading?<><FiLoader size={14} style={{animation:'spin 1s linear infinite'}}/> Creating…</>:<><FiCheckCircle size={14}/> Create Account</>}
                </button>
              </div>
            </div>
          )}

          <div style={{marginTop:24,paddingTop:20,borderTop:`1px solid ${T.border}`,textAlign:'center'}}>
            <p style={{fontSize:13,color:T.inkSoft}}>Already registered? <Link to="/student/login" className="lnk" style={{color:T.mid,fontWeight:600,textDecoration:'none'}}>Sign in</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}