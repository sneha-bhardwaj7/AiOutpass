// src/pages/AdminSignup.jsx
import{useState,useEffect}from'react';
import{Link,useNavigate}from'react-router-dom';
import{FiUser,FiMail,FiLock,FiEye,FiEyeOff,FiArrowRight,FiLoader,FiCheckCircle,FiAlertCircle,FiShield}from'react-icons/fi';
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
          style={{width:'100%',padding:rightEl?'12px 42px 12px 40px':'12px 14px 12px 40px',borderRadius:12,border:`1.5px solid ${error?T.errBd:success?'rgba(26,155,92,0.40)':f?T.focusBd:T.inputBd}`,background:f?T.focusBg:T.inputBg,color:T.ink,fontSize:14,transition:'all 0.22s',boxShadow:f?T.focusSh:'none'}}/>
        {rightEl&&<div style={{position:'absolute',right:11,top:'50%',transform:'translateY(-50%)',display:'flex',alignItems:'center',gap:5}}>{rightEl}</div>}
      </div>
      {error&&<p style={{fontSize:11,color:T.err,display:'flex',alignItems:'center',gap:4}}><FiAlertCircle size={10}/>{error}</p>}
    </div>
  );
}

function StrengthBar({password}){
  const s=()=>{if(!password)return 0;let n=0;if(password.length>=8)n++;if(/[A-Z]/.test(password))n++;if(/[0-9]/.test(password))n++;if(/[^A-Za-z0-9]/.test(password))n++;return n;};
  const sc=s();
  const cols=['','#E74C3C','#E8A020',T.mid,T.deep];
  const labs=['','Weak','Fair','Good','Strong'];
  if(!password)return null;
  return(
    <div style={{marginTop:8}}>
      <div style={{display:'flex',gap:4,marginBottom:4}}>
        {[1,2,3,4].map(i=><div key={i} style={{flex:1,height:3,borderRadius:2,background:i<=sc?cols[sc]:T.soft,transition:'background 0.3s'}}/>)}
      </div>
      <span style={{fontSize:10,color:cols[sc],fontWeight:600}}>{labs[sc]}</span>
    </div>
  );
}

export default function AdminSignup(){
  const[form,setForm]=useState({name:'',email:'',password:'',confirmPassword:''});
  const[showPass,setShowPass]=useState(false);
  const[showConf,setShowConf]=useState(false);
  const[loading,setLoading]=useState(false);
  const[error,setError]=useState('');
  const[mounted,setMounted]=useState(false);
  const{login}=useAuth();
  const navigate=useNavigate();
  useEffect(()=>{const t=setTimeout(()=>setMounted(true),60);return()=>clearTimeout(t);},[]);
  const set=f=>e=>setForm(p=>({...p,[f]:e.target.value}));
  const canSubmit=form.name&&form.email&&form.password.length>=8&&form.password===form.confirmPassword;

  const submit=async()=>{
    if(!canSubmit||loading)return;
    setLoading(true);setError('');
    try{
      const res=await fetch('http://localhost:5000/api/auth/admin/signup',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:form.name.trim(),email:form.email.trim().toLowerCase(),password:form.password})});
      const data=await res.json();
      if(!res.ok)throw new Error(data.message||'Signup failed');
      localStorage.setItem('token',data.token);
      login({_id:data.id,name:data.name,email:data.email,role:data.role},data.role,data.token);
      navigate('/admin/dashboard');
    }catch(err){setError(err.message||'Signup failed.');}finally{setLoading(false);}
  };

  return(
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'40px 24px',position:'relative',overflow:'hidden'}}>
      <style>{GCSS}</style>
      <PageBackground/>

      <div style={{width:'100%',maxWidth:460,position:'relative',zIndex:1,opacity:mounted?1:0,transform:mounted?'none':'translateY(16px)',transition:'all 0.6s cubic-bezier(0.22,1,0.36,1)'}}>

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
        <div style={{background:T.glass,backdropFilter:'blur(36px)',border:`1px solid ${T.glassBd}`,borderRadius:26,boxShadow:T.glassSh,padding:'40px 36px',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',top:0,left:0,right:0,height:4,background:`linear-gradient(90deg,${T.deep},${T.mid},${T.bright})`}}/>
          <div style={{position:'absolute',top:0,right:0,width:190,height:190,borderRadius:'0 26px 0 100%',background:'rgba(139,123,200,0.08)',pointerEvents:'none'}}/>

          {/* Header */}
          <div style={{display:'flex',alignItems:'center',gap:15,marginBottom:24,paddingTop:6}}>
            <div style={{width:54,height:54,borderRadius:15,flexShrink:0,background:`linear-gradient(135deg,${T.deep},${T.mid})`,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`0 8px 22px rgba(91,74,155,0.34)`,animation:'bob 3.5s ease-in-out infinite'}}>
              <FiShield size={24} color="rgba(255,255,255,0.93)"/>
            </div>
            <div>
              <h1 style={{fontWeight:800,fontSize:24,color:T.ink,letterSpacing:-0.6,lineHeight:1.1,marginBottom:4}}>Admin Registration</h1>
              <p style={{fontSize:12,color:T.inkSoft}}>Create an authorized admin account</p>
            </div>
          </div>

          {/* Notice */}
          <div style={{marginBottom:20,padding:'12px 15px',borderRadius:13,background:T.snow,border:`1px solid ${T.border}`,display:'flex',alignItems:'flex-start',gap:9}}>
            <FiShield size={12} style={{color:T.mid,flexShrink:0,marginTop:2}}/>
            <p style={{fontSize:12,color:T.inkSoft,lineHeight:1.68,margin:0}}>Admin accounts require institutional approval. Unauthorized access is prohibited.</p>
          </div>

          {error&&(
            <div style={{marginBottom:18,padding:'12px 15px',borderRadius:13,background:T.errBg,border:`1px solid ${T.errBd}`,display:'flex',gap:9,animation:'fadeIn 0.3s both'}}>
              <FiAlertCircle size={14} color={T.err} style={{flexShrink:0,marginTop:1}}/>
              <span style={{fontSize:13,color:T.err}}>{error}</span>
            </div>
          )}

          <div style={{display:'flex',flexDirection:'column',gap:15}}>
            <Field label="Full Name" icon={FiUser} value={form.name} onChange={set('name')} placeholder="Admin full name"/>
            <Field label="Email Address" icon={FiMail} type="email" value={form.email} onChange={set('email')} placeholder="admin@institution.edu"/>
            <div>
              <Field label="Password" icon={FiLock} type={showPass?'text':'password'} value={form.password} onChange={set('password')} placeholder="Min. 8 characters"
                rightEl={<button type="button" onClick={()=>setShowPass(p=>!p)} style={{background:'none',border:'none',cursor:'pointer',color:T.inkDim,padding:0,display:'flex'}}>{showPass?<FiEyeOff size={14}/>:<FiEye size={14}/>}</button>}/>
              <StrengthBar password={form.password}/>
            </div>
            <Field label="Confirm Password" icon={FiLock} type={showConf?'text':'password'} value={form.confirmPassword} onChange={set('confirmPassword')} placeholder="Re-enter password"
              error={form.confirmPassword&&form.password!==form.confirmPassword?"Passwords don't match":''}
              success={form.confirmPassword&&form.password===form.confirmPassword}
              rightEl={<div style={{display:'flex',alignItems:'center',gap:4}}>{form.confirmPassword&&form.password===form.confirmPassword&&<FiCheckCircle size={13} color={T.ok}/>}<button type="button" onClick={()=>setShowConf(p=>!p)} style={{background:'none',border:'none',cursor:'pointer',color:T.inkDim,padding:0,display:'flex'}}>{showConf?<FiEyeOff size={14}/>:<FiEye size={14}/>}</button></div>}/>
            <button onClick={submit} disabled={!canSubmit||loading} className="btn-p" style={{width:'100%',marginTop:6,padding:'14px 20px',borderRadius:14,border:'none',background:canSubmit&&!loading?`linear-gradient(135deg,${T.deep},${T.mid},${T.bright})`:'rgba(139,123,200,0.12)',color:canSubmit&&!loading?'#fff':T.inkDim,fontSize:14,fontWeight:700,cursor:canSubmit&&!loading?'pointer':'not-allowed',display:'flex',alignItems:'center',justifyContent:'center',gap:9,boxShadow:canSubmit&&!loading?`0 8px 26px rgba(91,74,155,0.38)`:'none'}}>
              {loading?<><FiLoader size={14} style={{animation:'spin 1s linear infinite'}}/> Registering…</>:<><FiCheckCircle size={14}/> Register Admin Account <FiArrowRight size={14}/></>}
            </button>
          </div>

          <div style={{marginTop:24,paddingTop:20,borderTop:`1px solid ${T.border}`,textAlign:'center'}}>
            <p style={{fontSize:13,color:T.inkSoft}}>Already registered? <Link to="/admin/login" className="lnk" style={{color:T.mid,fontWeight:600,textDecoration:'none'}}>Sign in</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}