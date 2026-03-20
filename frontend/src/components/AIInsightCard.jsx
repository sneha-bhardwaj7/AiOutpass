// src/components/AIInsightCard.jsx
// Already updated in a previous batch with the full teal/navy theme.
// This file is the canonical updated version.

import { Zap, ChevronDown, ChevronUp, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { useState } from "react";

const C = {
  magentaMid:'#8E2A7A', magentaBright:'#A23B88',
  green:'#34D399', greenBg:'rgba(52,211,153,0.12)', greenBorder:'rgba(52,211,153,0.3)',
  red:'#F87171', redBg:'rgba(248,113,113,0.12)', redBorder:'rgba(248,113,113,0.3)',
  amberLight:'#A23B88', amberBg:'rgba(162,59,136,0.12)', amberBorder:'rgba(162,59,136,0.3)',
  slateText:'rgba(31,41,55,0.7)', white:'#1F2937',
};

const recommendations = {
  "auto-approve":  { label:"Auto Approve",  icon:<CheckCircle size={12}/>,   bg:C.greenBg,  border:C.greenBorder,  text:C.green        },
  "manual-review": { label:"Manual Review", icon:<AlertTriangle size={12}/>, bg:C.amberBg,  border:C.amberBorder,  text:C.amberLight   },
  reject:          { label:"Reject",        icon:<XCircle size={12}/>,       bg:C.redBg,    border:C.redBorder,    text:C.red          },
};

export default function AIInsightCard({ insight, loading = false }) {
  const [expanded, setExpanded] = useState(false);

  if (loading) return (
    <div style={{ background:'rgba(245,240,250,0.95)', border:'1px solid rgba(162,59,136,0.15)', borderRadius:18, padding:20, backdropFilter:'blur(16px)' }}>
      <style>{`@keyframes shimAI{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
      {[80,'100%','80%','60%'].map((w,i) => (
        <div key={i} style={{ height:i===0?32:12, width:w, background:'rgba(255,255,255,0.07)', borderRadius:8, marginBottom:12, animation:'shimAI 1.4s ease infinite', animationDelay:`${i*0.15}s` }}/>
      ))}
    </div>
  );

  if (!insight) return null;

  const rec = recommendations[insight.recommendation] || recommendations["manual-review"];

  return (
    <div style={{ background:'rgba(245,240,250,0.95)', border:`1px solid rgba(162,59,136,0.15)`, borderRadius:18, overflow:'hidden', backdropFilter:'blur(16px)', boxShadow:'0 8px 30px rgba(162,59,136,0.1)', fontFamily:'DM Sans,sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');*{box-sizing:border-box;}`}</style>
      <div style={{ height:2, background:`linear-gradient(90deg,transparent,#A23B88,transparent)` }}/>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 18px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:38, height:38, background:`linear-gradient(135deg,${C.magentaMid},${C.magentaBright})`, borderRadius:11, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 16px rgba(162,59,136,0.35)' }}>
            <Zap size={17} color="#fff"/>
          </div>
          <div>
            <p style={{ fontWeight:700, color:C.magentaBright, fontSize:13, marginBottom:2, fontFamily:'DM Sans,sans-serif' }}>AI Analysis</p>
            <p style={{ fontSize:10, color:'rgba(162,59,136,0.6)', fontFamily:'DM Mono,monospace' }}>Powered by LangChain</p>
          </div>
        </div>
        <span style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:11, fontWeight:700, padding:'5px 12px', borderRadius:100, background:rec.bg, border:`1px solid ${rec.border}`, color:rec.text }}>
          {rec.icon}{rec.label}
        </span>
      </div>

      <div style={{ padding:'16px 18px' }}>
        <p style={{ fontSize:13, color:'rgba(220,230,255,0.7)', lineHeight:1.75, fontFamily:'DM Sans,sans-serif' }}>{insight.summary || "AI analysis in progress…"}</p>

        {insight.consentScore !== undefined && (
          <div style={{ marginTop:16 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
              <p style={{ fontSize:9, fontWeight:700, color:'rgba(220,230,255,0.4)', textTransform:'uppercase', letterSpacing:'0.2em', fontFamily:'DM Mono,monospace' }}>Consent Confidence</p>
              <p style={{ fontSize:15, fontWeight:800, color:insight.consentScore>=80?C.green:insight.consentScore>=50?C.amberLight:C.red, fontFamily:'Space Grotesk,sans-serif' }}>{insight.consentScore}%</p>
            </div>
            <div style={{ height:5, background:'rgba(255,255,255,0.07)', borderRadius:20, overflow:'hidden' }}>
              <div style={{ height:'100%', width:`${insight.consentScore}%`, borderRadius:20, background:insight.consentScore>=80?C.green:insight.consentScore>=50?C.amberLight:C.red, transition:'width 0.7s ease', boxShadow:`0 0 10px ${insight.consentScore>=80?C.green:insight.consentScore>=50?C.amberLight:C.red}60` }}/>
            </div>
          </div>
        )}

        {insight.extractedData && (
          <div style={{ marginTop:14, display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            {Object.entries(insight.extractedData).map(([key,val]) => (
              <div key={key} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, padding:'9px 12px' }}>
                <p style={{ fontSize:9, fontWeight:700, color:'rgba(220,230,255,0.3)', textTransform:'uppercase', letterSpacing:'0.18em', fontFamily:'DM Mono,monospace', marginBottom:4 }}>{key.replace(/([A-Z])/g," $1").trim()}</p>
                <p style={{ fontSize:12, fontWeight:600, color:'rgba(220,230,255,0.75)', fontFamily:'DM Sans,sans-serif' }}>{val || "—"}</p>
              </div>
            ))}
          </div>
        )}

        {insight.flags && insight.flags.length > 0 && (
          <div style={{ marginTop:14 }}>
            <button onClick={() => setExpanded(!expanded)} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', cursor:'pointer', color:C.amberLight, fontSize:12, fontWeight:700, fontFamily:'DM Sans,sans-serif', padding:0 }}>
              <AlertTriangle size={13}/>{insight.flags.length} Flag{insight.flags.length>1?"s":""} Detected
              {expanded ? <ChevronUp size={13}/> : <ChevronDown size={13}/>}
            </button>
            {expanded && (
              <ul style={{ marginTop:8, listStyle:'none', padding:0, display:'flex', flexDirection:'column', gap:6 }}>
                {insight.flags.map((flag,i) => (
                  <li key={i} style={{ display:'flex', alignItems:'flex-start', gap:7, fontSize:12, color:'rgba(245,190,88,0.85)', background:'rgba(245,190,88,0.07)', border:'1px solid rgba(245,190,88,0.18)', borderRadius:8, padding:'8px 11px', fontFamily:'DM Sans,sans-serif' }}>
                    <AlertTriangle size={11} style={{ marginTop:1, flexShrink:0 }}/>{flag}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}