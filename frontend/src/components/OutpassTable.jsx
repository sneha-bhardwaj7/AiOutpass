// src/components/OutpassTable.jsx
import{useState}from'react';
import{Link}from'react-router-dom';
import{Eye,Search,ChevronDown,ChevronUp,CheckCircle,XCircle,Download,ArrowUpDown,SlidersHorizontal,Calendar}from'lucide-react';
import StatusBadge from'./StatusBadge';
import RiskIndicator from'./RiskIndicator';
import{T}from'./Pagebackground';

const S=`
  .tbl-root *{box-sizing:border-box}
  .tbl-wrap{background:rgba(255,255,255,0.62);border-radius:20px;border:1px solid rgba(255,255,255,0.86);overflow:hidden;box-shadow:0 8px 34px rgba(91,74,155,0.14);backdrop-filter:blur(28px)}
  .tbl-toolbar{display:flex;flex-wrap:wrap;align-items:center;gap:10px;padding:14px 18px;background:rgba(246,243,253,0.75);border-bottom:1px solid rgba(139,123,200,0.20)}
  .tbl-search{flex:1;min-width:200px;position:relative}
  .tbl-search input{width:100%;padding:10px 36px 10px 36px;font-size:13px;background:rgba(255,255,255,0.72);border:1.5px solid rgba(139,123,200,0.26);border-radius:11px;outline:none;color:#1A1040;transition:border-color 0.18s,box-shadow 0.18s}
  .tbl-search input:focus{border-color:#6B5AB0;box-shadow:0 0 0 3px rgba(107,90,176,0.12)}
  .tbl-search input::placeholder{color:rgba(46,31,107,0.36)}
  .tbl-si{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:rgba(46,31,107,0.36);pointer-events:none}
  .tbl-cl{position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:rgba(46,31,107,0.36);font-size:17px;line-height:1;padding:2px 5px;border-radius:5px;transition:color 0.15s}
  .tbl-cl:hover{color:#6B5AB0}
  .tbl-sel{position:relative}
  .tbl-sel select{padding:10px 32px 10px 36px;font-size:12.5px;font-weight:500;background:rgba(255,255,255,0.72);border:1.5px solid rgba(139,123,200,0.26);border-radius:11px;outline:none;appearance:none;cursor:pointer;color:rgba(46,31,107,0.75);transition:border-color 0.18s}
  .tbl-sel select:focus{border-color:#6B5AB0}
  .tbl-sil{position:absolute;left:11px;top:50%;transform:translateY(-50%);pointer-events:none;color:rgba(46,31,107,0.36)}
  .tbl-sir{position:absolute;right:10px;top:50%;transform:translateY(-50%);pointer-events:none;color:rgba(46,31,107,0.36)}
  .tbl-exp{display:flex;align-items:center;gap:6px;padding:10px 14px;font-size:12.5px;font-weight:600;background:rgba(255,255,255,0.72);border:1.5px solid rgba(139,123,200,0.26);border-radius:11px;cursor:pointer;color:rgba(46,31,107,0.58);transition:all 0.18s}
  .tbl-exp:hover{border-color:#6B5AB0;color:#6B5AB0;background:rgba(237,232,248,0.90)}
  .tbl-pill{margin-left:auto;display:flex;align-items:center;gap:7px;padding:6px 14px;background:rgba(107,90,176,0.10);border:1px solid rgba(139,123,200,0.26);border-radius:20px}
  .tbl-dot{width:6px;height:6px;border-radius:50%;background:#6B5AB0;box-shadow:0 0 7px rgba(107,90,176,0.60)}
  .tbl-ptxt{font-size:11px;font-weight:700;color:#6B5AB0}
  .tbl-table{width:100%;border-collapse:collapse}
  .tbl-th{text-align:left;padding:12px 18px;font-size:9.5px;font-weight:700;letter-spacing:0.20em;text-transform:uppercase;color:rgba(46,31,107,0.40);cursor:pointer;user-select:none;background:rgba(255,255,255,0.28);border-bottom:1px solid rgba(139,123,200,0.18);white-space:nowrap;transition:color 0.15s}
  .tbl-th:hover{color:#6B5AB0}
  .tbl-thi{display:flex;align-items:center;gap:5px}
  .tbl-tr{border-bottom:1px solid rgba(139,123,200,0.14);background:transparent;transition:background 0.14s}
  .tbl-tr:last-child{border-bottom:none}
  .tbl-tr:hover{background:rgba(237,232,248,0.72)}
  .tbl-td{padding:13px 18px;vertical-align:middle}
  .tbl-av{width:36px;height:36px;border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;flex-shrink:0}
  .tbl-acts{display:flex;align-items:center;gap:3px}
  .tbl-ab{display:flex;align-items:center;justify-content:center;width:31px;height:31px;border-radius:9px;border:none;background:transparent;cursor:pointer;color:rgba(46,31,107,0.36);transition:all 0.15s;text-decoration:none}
  .tbl-ab:hover{background:rgba(237,232,248,0.90);color:#6B5AB0}
  .tbl-ab.ap:hover{background:rgba(26,155,92,0.10);color:#1A9B5C}
  .tbl-ab.rj:hover{background:rgba(176,42,32,0.10);color:#B02A20}
  @keyframes shTbl{0%{background-position:-400px 0}100%{background-position:400px 0}}
  .sh-tbl{background:linear-gradient(90deg,rgba(200,190,240,0.20) 25%,rgba(180,168,228,0.32) 50%,rgba(200,190,240,0.20) 75%);background-size:800px 100%;animation:shTbl 1.4s ease-in-out infinite;border-radius:8px}
  .tbl-empty{padding:60px 20px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:12px}
  .tbl-ei{width:54px;height:54px;border-radius:16px;background:rgba(237,232,248,0.90);border:1px solid rgba(139,123,200,0.22);display:flex;align-items:center;justify-content:center;color:rgba(139,123,200,0.60)}
  .tbl-et{font-size:14px;font-weight:600;color:rgba(46,31,107,0.50)}
  .tbl-ec{font-size:12px;color:#6B5AB0;background:none;border:none;cursor:pointer;transition:opacity 0.15s;text-decoration:underline;text-underline-offset:3px}
  .tbl-ec:hover{opacity:0.70}
  .tbl-foot{display:flex;align-items:center;justify-content:space-between;padding:12px 18px;border-top:1px solid rgba(139,123,200,0.18);background:rgba(246,243,253,0.75)}
  .tbl-fi{font-size:11.5px;color:rgba(46,31,107,0.38)}
  .tbl-fi strong{color:rgba(46,31,107,0.58);font-weight:600}
  .tbl-pbs{display:flex;gap:5px}
  .tbl-pb{width:31px;height:31px;border-radius:9px;font-size:12px;font-weight:600;cursor:pointer;transition:all 0.15s}
  .tbl-pb.on{background:linear-gradient(135deg,#5B4A9B,#6B5AB0);color:#fff;border:none;box-shadow:0 4px 14px rgba(91,74,155,0.36)}
  .tbl-pb.off{background:transparent;color:rgba(46,31,107,0.40);border:1px solid rgba(139,123,200,0.22)}
  .tbl-pb.off:hover{border-color:#6B5AB0;color:#6B5AB0;background:rgba(237,232,248,0.90)}
`;

const AVS=[
  {bg:'rgba(107,90,176,0.14)',color:'#6B5AB0'},
  {bg:'rgba(91,74,155,0.12)', color:'#5B4A9B'},
  {bg:'rgba(139,123,200,0.18)',color:'#8B7BC8'},
  {bg:'rgba(107,90,176,0.10)',color:'#6B5AB0'},
  {bg:'rgba(91,74,155,0.14)', color:'#5B4A9B'},
];

export default function OutpassTable({data=[],loading=false,showActions=true}){
  const[search,setSearch]=useState('');
  const[sf,setSf]=useState('all');
  const[sField,setSField]=useState('createdAt');
  const[sDir,setSDir]=useState('desc');
  const[hRow,setHRow]=useState(null);

  const handleSort=f=>{if(sField===f)setSDir(d=>d==='asc'?'desc':'asc');else{setSField(f);setSDir('asc');}};

  const filtered=(data||[]).filter(r=>{
    const q=search.toLowerCase();
    return(r.studentName?.toLowerCase().includes(q)||r.studentId?.toLowerCase().includes(q)||r.destination?.toLowerCase().includes(q))&&(sf==='all'||r.status===sf);
  }).sort((a,b)=>{const v=sDir==='asc'?1:-1;return a[sField]>b[sField]?v:-v;});

  const SortIco=({field})=>sField===field?sDir==='asc'?<ChevronUp size={11} style={{color:T.mid}}/>:<ChevronDown size={11} style={{color:T.mid}}/>:<ArrowUpDown size={10} style={{opacity:0.28}}/>;

  const cols=[
    {label:'Student',    field:'studentName'},
    {label:'Destination',field:'destination'},
    {label:'Date',       field:'leaveDateFrom'},
    {label:'Status',     field:'status'},
    {label:'Risk',       field:'riskLevel'},
  ];

  return(
    <>
      <style>{S}</style>
      <div className="tbl-root">
        <div className="tbl-wrap">
          <div className="tbl-toolbar">
            <div className="tbl-search">
              <Search size={13} className="tbl-si"/>
              <input type="text" placeholder="Search by name, ID or destination…" value={search} onChange={e=>setSearch(e.target.value)}/>
              {search&&<button className="tbl-cl" onClick={()=>setSearch('')}>×</button>}
            </div>
            <div className="tbl-sel">
              <SlidersHorizontal size={12} className="tbl-sil"/>
              <select value={sf} onChange={e=>setSf(e.target.value)}>
                {['all','pending','parent-pending','approved','rejected','manual-review','flagged'].map(v=>(
                  <option key={v} value={v}>{v==='all'?'All Statuses':v.split('-').map(w=>w[0].toUpperCase()+w.slice(1)).join(' ')}</option>
                ))}
              </select>
              <ChevronDown size={10} className="tbl-sir"/>
            </div>
            <button className="tbl-exp"><Download size={13}/> Export</button>
            <div className="tbl-pill"><div className="tbl-dot"/><span className="tbl-ptxt">{filtered.length} results</span></div>
          </div>

          <div style={{overflowX:'auto'}}>
            <table className="tbl-table">
              <thead><tr>
                {cols.map(c=>(
                  <th key={c.field} className="tbl-th" onClick={()=>handleSort(c.field)}>
                    <div className="tbl-thi">{c.label} <SortIco field={c.field}/></div>
                  </th>
                ))}
                {showActions&&<th className="tbl-th" style={{cursor:'default'}}>Actions</th>}
              </tr></thead>
              <tbody>
                {loading?Array(5).fill(null).map((_,i)=>(
                  <tr key={i} className="tbl-tr">{Array(showActions?6:5).fill(null).map((_,j)=>(<td key={j} className="tbl-td"><div className="sh-tbl" style={{height:13,width:j===0?120:80}}/></td>))}</tr>
                )):filtered.length===0?(
                  <tr><td colSpan={showActions?6:5}>
                    <div className="tbl-empty">
                      <div className="tbl-ei"><Search size={21}/></div>
                      <p className="tbl-et">No requests found</p>
                      {(search||sf!=='all')&&<button className="tbl-ec" onClick={()=>{setSearch('');setSf('all');}}>Clear filters</button>}
                    </div>
                  </td></tr>
                ):filtered.map((row,idx)=>{
                  const av=AVS[idx%AVS.length];
                  return(
                    <tr key={row._id} className="tbl-tr" onMouseEnter={()=>setHRow(row._id)} onMouseLeave={()=>setHRow(null)}>
                      <td className="tbl-td">
                        <div style={{display:'flex',alignItems:'center',gap:11}}>
                          <div className="tbl-av" style={{background:av.bg,color:av.color,border:`1px solid ${av.color}28`}}>{row.studentName?.[0]?.toUpperCase()}</div>
                          <div>
                            <p style={{fontSize:13,fontWeight:600,color:T.ink,lineHeight:1,marginBottom:3}}>{row.studentName}</p>
                            <p style={{fontSize:10,color:T.inkDim}}>{row.studentId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="tbl-td">
                        <p style={{fontSize:13,fontWeight:500,color:T.inkMid}}>{row.destination}</p>
                        <p style={{fontSize:11,color:T.inkDim,marginTop:2,maxWidth:140,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{row.reason}</p>
                      </td>
                      <td className="tbl-td">
                        <div style={{display:'flex',alignItems:'center',gap:8}}>
                          <div style={{width:29,height:29,borderRadius:9,background:'rgba(107,90,176,0.10)',border:`1px solid ${T.border}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                            <Calendar size={12} style={{color:T.mid}}/>
                          </div>
                          <div>
                            <p style={{fontSize:11.5,fontWeight:500,color:T.inkMid}}>
                              {(row.leaveDateFrom||row.outpassDate)?new Date(row.leaveDateFrom||row.outpassDate).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}):'—'}
                            </p>
                            {row.leaveDateTo&&<p style={{fontSize:10,color:T.inkDim,marginTop:1}}>→ {new Date(row.leaveDateTo).toLocaleDateString('en-IN',{day:'2-digit',month:'short'})}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="tbl-td"><StatusBadge status={row.status}/></td>
                      <td className="tbl-td"><RiskIndicator level={row.riskLevel||'low'} compact/></td>
                      {showActions&&(
                        <td className="tbl-td">
                          <div className="tbl-acts" style={{opacity:hRow===row._id?1:0,transform:hRow===row._id?'translateX(0)':'translateX(-7px)',transition:'opacity 0.15s,transform 0.15s'}}>
                            <Link to={`/admin/requests/${row._id}`} className="tbl-ab" title="View"><Eye size={14}/></Link>
                            <button className="tbl-ab ap" title="Approve"><CheckCircle size={14}/></button>
                            <button className="tbl-ab rj" title="Reject"><XCircle size={14}/></button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="tbl-foot">
            <p className="tbl-fi">Showing <strong>{Math.min(filtered.length,10)}</strong> of <strong>{filtered.length}</strong> entries</p>
            <div className="tbl-pbs">{[1,2,3].map(p=><button key={p} className={`tbl-pb ${p===1?'on':'off'}`}>{p}</button>)}</div>
          </div>
        </div>
      </div>
    </>
  );
}