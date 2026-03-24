import { useState, useEffect } from "react";

// ── 브랜드 컬러 ──────────────────────────────────────────────────────────────
const C = {
  navy: '#1B3A6B', navy2: '#0D2240', navy3: '#0A1628',
  blue: '#2E5090', accent: '#4A90D9',
  gold: '#C9A84C', gold2: '#F0D98A',
  white: '#FFFFFF', offwhite: '#F7FAFD',
  light: '#EEF3FA', mid: '#D6E4F4',
  text: '#0F1B2D', sub: '#5A6B82',
  border: '#C8D8EE', success: '#1A6B3A',
};

// ── 선택지 데이터 ─────────────────────────────────────────────────────────────
const DEPTS = ['관절센터','척추센터','스포츠재활센터','영상의학센터','내과·뇌신경센터',
  '검진센터','간호부','홍보팀','원무팀','총무팀','전산팀','총괄본부장실','기타'];
const TOOLS = ['ChatGPT','Claude','Gemini','뤼튼(wrtn)','Microsoft Copilot',
  '네이버 클로바X','기타 AI 도구','AI 미사용'];
const USES = ['문서·보고서 작성','이메일·공문 초안','정보 검색·요약','번역',
  '아이디어·기획','데이터 분석','이미지·영상 제작','코딩·자동화','기타'];
const LEVELS = ['① 전혀 모름 / AI가 생소함','② 가끔 검색 수준으로만 사용',
  '③ 문서 작성 등 기본 업무 활용','④ 여러 도구 조합해 적극 활용',
  '⑤ AI 자동화·워크플로우 설계 가능'];
const WISHES = ['문서·보고서 자동 작성','환자 안내·문자 자동 발송',
  '데이터 분석 후 보고서 생성','법령·규정 즉시 검색·안내',
  '회의록·메모 자동 정리','SNS·블로그·유튜브 콘텐츠 초안',
  '이미지·영상 편집 보조','환자 예약·문의 24시간 대응','기타'];
const CONCERNS = ['개인정보·환자정보 유출 위험','AI 오정보 제공 우려',
  '사용법 학습 부담','일자리 위협','기존 EMR 연동 어려움',
  'AI 결과물 신뢰도 (재확인 필요)','특별한 우려 없음','기타'];
const EDU = ['완전 초보 (AI 기초부터)','기초 — ChatGPT·Claude 활용법',
  '중급 — 부서 특화 프롬프트 작성','고급 — AI 자동화 워크플로우 설계',
  '관리자용 — AI 도입 전략 이해'];

const emptyForm = () => ({
  dept:'', deptOther:'', name:'', contact:'',
  q1:[], q1other:'', q2:[], q2other:'', q3:'',
  q4: Array(5).fill(null).map(()=>({task:'',freq:'',time:'',hope:''})),
  q5:['','',''], q6:'',
  q7:[], q7other:'', q8:[], q8other:'',
  q9:'', q10time:'', q10format:'', q10duration:'', q10freq:'', q11:'',
});

// ── 전역 스타일 ───────────────────────────────────────────────────────────────
function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;900&display=swap');
      *{box-sizing:border-box;margin:0;padding:0;}
      body{font-family:'Noto Sans KR',sans-serif;}
      ::placeholder{color:#A0B0C8;}
      ::-webkit-scrollbar{width:5px;}
      ::-webkit-scrollbar-track{background:#EEF3FA;}
      ::-webkit-scrollbar-thumb{background:${C.accent};border-radius:3px;}

      @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
      @keyframes fadeIn{from{opacity:0}to{opacity:1}}
      @keyframes scaleIn{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}
      @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
      @keyframes spin{to{transform:rotate(360deg)}}
      @keyframes barGrow{from{width:0}to{width:var(--w)}}

      .fu{animation:fadeUp .55s ease forwards;}
      .fu2{animation:fadeUp .55s .12s ease forwards;opacity:0;}
      .fu3{animation:fadeUp .55s .24s ease forwards;opacity:0;}
      .fu4{animation:fadeUp .55s .36s ease forwards;opacity:0;}
      .fi{animation:fadeIn .35s ease forwards;}
      .si{animation:scaleIn .35s ease forwards;}

      .cb{
        display:flex;align-items:center;gap:10px;
        padding:11px 14px;border-radius:10px;cursor:pointer;
        border:1.5px solid ${C.border};background:white;
        transition:all .18s ease;margin-bottom:7px;
        -webkit-user-select:none;user-select:none;
      }
      .cb:hover{border-color:${C.accent};background:${C.light};}
      .cb.on{border-color:${C.gold};background:#FFFCF0;}
      .rb{
        display:flex;align-items:center;gap:10px;
        padding:11px 14px;border-radius:10px;cursor:pointer;
        border:1.5px solid ${C.border};background:white;
        transition:all .18s ease;margin-bottom:7px;
        -webkit-user-select:none;user-select:none;
      }
      .rb:hover{border-color:${C.accent};background:${C.light};}
      .rb.on{border-color:${C.gold};background:#FFFCF0;}

      .btn-gold{
        background:${C.gold};color:${C.navy};font-family:'Noto Sans KR',sans-serif;
        font-weight:700;font-size:15px;padding:13px 30px;
        border:none;border-radius:50px;cursor:pointer;
        transition:all .22s ease;letter-spacing:.3px;
      }
      .btn-gold:hover{background:${C.gold2};transform:translateY(-2px);
        box-shadow:0 8px 22px rgba(201,168,76,.38);}
      .btn-gold:disabled{opacity:.4;cursor:not-allowed;transform:none;}

      .btn-navy{
        background:${C.navy};color:white;font-family:'Noto Sans KR',sans-serif;
        font-weight:600;font-size:14px;padding:12px 26px;
        border:none;border-radius:50px;cursor:pointer;transition:all .22s ease;
      }
      .btn-navy:hover{background:${C.blue};transform:translateY(-1px);}

      .btn-ghost{
        background:transparent;color:${C.sub};font-family:'Noto Sans KR',sans-serif;
        font-weight:500;font-size:13px;padding:9px 18px;
        border:1.5px solid ${C.border};border-radius:50px;cursor:pointer;
        transition:all .18s ease;
      }
      .btn-ghost:hover{border-color:${C.sub};color:${C.text};}

      input,textarea,select{
        font-family:'Noto Sans KR',sans-serif;font-size:14px;
        padding:11px 14px;border:1.5px solid ${C.border};border-radius:10px;
        background:white;color:${C.text};transition:border-color .18s ease;width:100%;
        outline:none;
      }
      input:focus,textarea:focus,select:focus{border-color:${C.gold};}
      textarea{resize:vertical;line-height:1.7;}
      select{cursor:pointer;}

      .card{
        background:white;border-radius:18px;padding:26px;
        border:1px solid ${C.border};margin-bottom:18px;
      }
      .card-dark{
        background:rgba(255,255,255,.05);border-radius:18px;padding:24px;
        border:1px solid rgba(255,255,255,.08);margin-bottom:16px;
      }

      .tag{
        display:inline-flex;align-items:center;
        background:${C.gold};color:${C.navy};
        font-weight:700;font-size:11px;padding:3px 10px;
        border-radius:20px;letter-spacing:.5px;margin-right:8px;
      }

      .pill-btn{
        padding:8px 15px;border-radius:20px;cursor:pointer;
        font-family:'Noto Sans KR',sans-serif;font-size:13px;
        transition:all .18s ease;border:1.5px solid ${C.border};
        background:white;color:${C.sub};
      }
      .pill-btn:hover{border-color:${C.accent};color:${C.navy};}
      .pill-btn.on{border-color:${C.gold};background:#FFFCF0;color:${C.navy};font-weight:700;}
    `}</style>
  );
}

// ── 공통 컴포넌트 ─────────────────────────────────────────────────────────────
function CB({ label, checked, onChange }) {
  return (
    <div className={`cb${checked?' on':''}`} onClick={onChange}>
      <div style={{
        width:18,height:18,borderRadius:5,flexShrink:0,transition:'all .15s',
        border:`2px solid ${checked?C.gold:C.border}`,
        background:checked?C.gold:'white',
        display:'flex',alignItems:'center',justifyContent:'center',
      }}>
        {checked&&<span style={{color:'white',fontSize:11,fontWeight:700,lineHeight:1}}>✓</span>}
      </div>
      <span style={{fontSize:14,color:C.text,lineHeight:1.4}}>{label}</span>
    </div>
  );
}

function RB({ label, selected, onChange }) {
  return (
    <div className={`rb${selected?' on':''}`} onClick={onChange}>
      <div style={{
        width:18,height:18,borderRadius:'50%',flexShrink:0,transition:'all .15s',
        border:`2px solid ${selected?C.gold:C.border}`,background:'white',
        display:'flex',alignItems:'center',justifyContent:'center',
      }}>
        {selected&&<div style={{width:9,height:9,borderRadius:'50%',background:C.gold}}/>}
      </div>
      <span style={{fontSize:14,color:C.text,lineHeight:1.4}}>{label}</span>
    </div>
  );
}

function QHead({ n, title, hint }) {
  return (
    <div style={{marginBottom:18}}>
      <div style={{display:'flex',alignItems:'baseline',gap:8,marginBottom:hint?5:0}}>
        <span className="tag">Q{n}</span>
        <span style={{fontWeight:700,fontSize:15,color:C.navy}}>{title}</span>
      </div>
      {hint&&<p style={{fontSize:12,color:C.sub,paddingLeft:46,lineHeight:1.5}}>{hint}</p>}
    </div>
  );
}

function CardHeader({ title }) {
  return (
    <h3 style={{
      fontSize:14,fontWeight:700,color:C.navy,
      marginBottom:18,paddingBottom:12,
      borderBottom:`2px solid ${C.light}`
    }}>{title}</h3>
  );
}

// ── 랜딩 페이지 ───────────────────────────────────────────────────────────────
function LandingView({ onStart, onAdmin }) {
  return (
    <div style={{
      minHeight:'100vh',background:C.navy3,
      display:'flex',flexDirection:'column',
      position:'relative',overflow:'hidden'
    }}>
      <GlobalStyle/>
      {/* 배경 효과 */}
      <div style={{position:'absolute',inset:0,pointerEvents:'none'}}>
        <div style={{
          position:'absolute',top:'-15%',right:'-8%',
          width:550,height:550,borderRadius:'50%',
          background:'radial-gradient(circle,rgba(201,168,76,.11) 0%,transparent 65%)'
        }}/>
        <div style={{
          position:'absolute',bottom:'-8%',left:'-12%',
          width:480,height:480,borderRadius:'50%',
          background:'radial-gradient(circle,rgba(46,80,144,.35) 0%,transparent 65%)'
        }}/>
        <div style={{
          position:'absolute',inset:0,
          backgroundImage:`linear-gradient(rgba(201,168,76,.035) 1px,transparent 1px),
            linear-gradient(90deg,rgba(201,168,76,.035) 1px,transparent 1px)`,
          backgroundSize:'56px 56px'
        }}/>
      </div>

      <div style={{
        flex:1,display:'flex',flexDirection:'column',
        alignItems:'center',justifyContent:'center',
        padding:'60px 20px',position:'relative',zIndex:1
      }}>
        {/* 로고 뱃지 */}
        <div className="fu" style={{marginBottom:36,textAlign:'center'}}>
          <div style={{
            display:'inline-flex',alignItems:'center',gap:10,
            background:'rgba(255,255,255,.06)',
            border:'1px solid rgba(201,168,76,.28)',
            padding:'9px 22px',borderRadius:50,backdropFilter:'blur(10px)'
          }}>
            <div style={{
              width:30,height:30,borderRadius:7,background:C.gold,
              display:'flex',alignItems:'center',justifyContent:'center'
            }}>
              <span style={{color:C.navy,fontWeight:900,fontSize:13}}>S</span>
            </div>
            <span style={{color:'white',fontWeight:700,fontSize:15,letterSpacing:3}}>SIMPLIT</span>
            <span style={{color:'rgba(255,255,255,.3)',fontSize:12,letterSpacing:1}}>× 에이스병원</span>
          </div>
        </div>

        {/* 헤드라인 */}
        <div className="fu2" style={{textAlign:'center',maxWidth:620,marginBottom:14}}>
          <div style={{
            color:C.gold,fontSize:12,fontWeight:700,
            letterSpacing:4,marginBottom:22,textTransform:'uppercase'
          }}>AI 도입 부서 업무 현황 파악 설문</div>
          <h1 style={{
            color:'white',fontSize:'clamp(26px,4.5vw,46px)',
            fontWeight:900,lineHeight:1.22,marginBottom:24
          }}>
            AI가 바꿀 수 있는<br/>
            <span style={{color:C.gold}}>우리 부서의 업무</span>를<br/>
            함께 찾아봅시다
          </h1>
          <p style={{
            color:'rgba(255,255,255,.6)',fontSize:15,
            lineHeight:1.85,marginBottom:40
          }}>
            각 부서의 반복 업무와 AI 도입 희망 사항을 파악해<br/>
            에이스병원 맞춤형 AI 전략을 수립하기 위한 설문입니다.<br/>
            <strong style={{color:'rgba(255,255,255,.85)'}}>소요시간: 약 10~15분</strong>
          </p>
        </div>

        <div className="fu3" style={{
          display:'flex',flexDirection:'column',alignItems:'center',gap:14
        }}>
          <button className="btn-gold" onClick={onStart}
            style={{fontSize:16,padding:'15px 44px'}}>
            설문 시작하기 →
          </button>
          <span style={{color:'rgba(255,255,255,.3)',fontSize:12}}>
            응답은 AI 도입 전략 수립에만 활용됩니다
          </span>
        </div>

        {/* 요약 카드 */}
        <div className="fu4" style={{
          display:'grid',gridTemplateColumns:'repeat(3,1fr)',
          gap:14,maxWidth:520,marginTop:52,width:'100%'
        }}>
          {[
            {icon:'📋',t:'5개 파트\n11개 문항'},
            {icon:'⏱',t:'약 10~15분\n소요'},
            {icon:'🔒',t:'내부 전략\n수립 목적'},
          ].map((c,i)=>(
            <div key={i} style={{
              background:'rgba(255,255,255,.05)',
              border:'1px solid rgba(255,255,255,.09)',
              borderRadius:16,padding:'18px 14px',textAlign:'center',
              backdropFilter:'blur(8px)'
            }}>
              <div style={{fontSize:22,marginBottom:8}}>{c.icon}</div>
              <div style={{
                color:'rgba(255,255,255,.75)',fontSize:12,
                lineHeight:1.65,whiteSpace:'pre-line'
              }}>{c.t}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{textAlign:'center',padding:'18px',position:'relative',zIndex:1}}>
        <button onClick={onAdmin} style={{
          background:'none',border:'none',
          color:'rgba(255,255,255,.15)',fontSize:11,
          cursor:'pointer',letterSpacing:2
        }}>관리자</button>
      </div>
    </div>
  );
}

// ── 설문 폼 ───────────────────────────────────────────────────────────────────
function FormView({ form, setForm, step, total, onNext, onPrev, toggleCheck }) {
  const titles = ['AI 현황 파악','반복 업무 파악','AI에게 바라는 것','교육 수요','자유 의견'];
  const pct = (step/total)*100;
  return (
    <div style={{minHeight:'100vh',background:C.offwhite}}>
      <GlobalStyle/>
      {/* 상단바 */}
      <div style={{
        background:C.navy,color:'white',
        padding:'0 20px',position:'sticky',top:0,zIndex:100,
        boxShadow:'0 2px 18px rgba(27,58,107,.3)'
      }}>
        <div style={{maxWidth:720,margin:'0 auto'}}>
          <div style={{
            display:'flex',alignItems:'center',
            justifyContent:'space-between',padding:'13px 0 8px'
          }}>
            <div style={{display:'flex',alignItems:'center',gap:9}}>
              <div style={{
                width:26,height:26,borderRadius:6,background:C.gold,
                display:'flex',alignItems:'center',justifyContent:'center'
              }}>
                <span style={{color:C.navy,fontWeight:900,fontSize:11}}>S</span>
              </div>
              <span style={{fontWeight:700,fontSize:14,letterSpacing:2}}>SIMPLIT</span>
              <span style={{color:'rgba(255,255,255,.3)',fontSize:11}}>× 에이스병원</span>
            </div>
            <span style={{color:C.gold,fontSize:12,fontWeight:600}}>{step}/{total}</span>
          </div>
          {/* 진행바 */}
          <div style={{paddingBottom:8}}>
            <div style={{
              display:'flex',justifyContent:'space-between',
              fontSize:11,color:'rgba(255,255,255,.45)',marginBottom:5
            }}>
              <span>{titles[step-1]}</span>
              <span>{Math.round(pct)}%</span>
            </div>
            <div style={{height:3,background:'rgba(255,255,255,.14)',borderRadius:2}}>
              <div style={{
                height:'100%',background:C.gold,borderRadius:2,
                width:`${pct}%`,transition:'width .4s ease'
              }}/>
            </div>
          </div>
          {/* 스텝 알약 */}
          <div style={{
            display:'flex',gap:5,padding:'8px 0',
            overflowX:'auto',scrollbarWidth:'none'
          }}>
            {titles.map((t,i)=>(
              <div key={i} style={{
                fontSize:11,padding:'3px 10px',borderRadius:20,
                whiteSpace:'nowrap',flexShrink:0,
                background:i+1===step?C.gold:i+1<step?'rgba(201,168,76,.28)':'rgba(255,255,255,.07)',
                color:i+1===step?C.navy:i+1<step?C.gold:'rgba(255,255,255,.35)',
                fontWeight:i+1===step?700:400,
              }}>
                {i+1<step?'✓ ':''}{t}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div style={{maxWidth:720,margin:'0 auto',padding:'28px 18px 100px'}}>
        <div className="si">
          {step===1&&<Step1 form={form} setForm={setForm} toggleCheck={toggleCheck}/>}
          {step===2&&<Step2 form={form} setForm={setForm}/>}
          {step===3&&<Step3 form={form} setForm={setForm} toggleCheck={toggleCheck}/>}
          {step===4&&<Step4 form={form} setForm={setForm}/>}
          {step===5&&<Step5 form={form} setForm={setForm}/>}
        </div>
      </div>

      {/* 하단 네비 */}
      <div style={{
        position:'fixed',bottom:0,left:0,right:0,
        background:'white',borderTop:`1px solid ${C.border}`,
        padding:'14px 20px',zIndex:100,
        boxShadow:'0 -4px 18px rgba(27,58,107,.07)'
      }}>
        <div style={{
          maxWidth:720,margin:'0 auto',
          display:'flex',justifyContent:'space-between',alignItems:'center'
        }}>
          {step>1
            ?<button className="btn-ghost" onClick={onPrev}>← 이전</button>
            :<div/>
          }
          <button className="btn-navy" onClick={onNext}>
            {step===total?'✅ 제출하기':'다음 →'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Step 1: 기본정보 + AI 현황 ──────────────────────────────────────────────
function Step1({ form, setForm, toggleCheck }) {
  return (
    <div>
      <h2 style={{fontSize:21,fontWeight:800,color:C.navy,marginBottom:5}}>AI 현황 파악</h2>
      <p style={{color:C.sub,fontSize:13,marginBottom:28}}>기본 정보와 현재 AI 활용 현황을 알려주세요.</p>

      {/* 기본정보 */}
      <div className="card">
        <CardHeader title="📌 기본 정보"/>
        <div style={{marginBottom:14}}>
          <label style={{fontSize:12,fontWeight:700,color:C.sub,display:'block',marginBottom:7}}>소속 부서 *</label>
          <select value={form.dept} onChange={e=>setForm(f=>({...f,dept:e.target.value}))}>
            <option value="">-- 선택 --</option>
            {DEPTS.map(d=><option key={d} value={d}>{d}</option>)}
          </select>
          {form.dept==='기타'&&(
            <input type="text" placeholder="부서명 직접 입력" value={form.deptOther}
              onChange={e=>setForm(f=>({...f,deptOther:e.target.value}))}
              style={{marginTop:8}}/>
          )}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
          <div>
            <label style={{fontSize:12,fontWeight:700,color:C.sub,display:'block',marginBottom:7}}>성함 / 직책</label>
            <input type="text" placeholder="홍길동 / 수간호사" value={form.name}
              onChange={e=>setForm(f=>({...f,name:e.target.value}))}/>
          </div>
          <div>
            <label style={{fontSize:12,fontWeight:700,color:C.sub,display:'block',marginBottom:7}}>연락처</label>
            <input type="text" placeholder="이메일 or 내선번호" value={form.contact}
              onChange={e=>setForm(f=>({...f,contact:e.target.value}))}/>
          </div>
        </div>
      </div>

      {/* Q1 */}
      <div className="card">
        <QHead n={1} title="현재 사용 중인 AI 도구를 모두 선택해 주세요." hint="복수 선택 가능"/>
        {TOOLS.map(t=>(
          <CB key={t} label={t} checked={form.q1.includes(t)}
            onChange={()=>toggleCheck('q1',t)}/>
        ))}
        {form.q1.includes('기타 AI 도구')&&(
          <input type="text" placeholder="사용 중인 AI 도구명" value={form.q1other}
            onChange={e=>setForm(f=>({...f,q1other:e.target.value}))} style={{marginTop:8}}/>
        )}
      </div>

      {/* Q2 */}
      <div className="card">
        <QHead n={2} title="AI를 주로 어떤 용도로 사용하시나요?" hint="복수 선택 가능"/>
        {USES.map(u=>(
          <CB key={u} label={u} checked={form.q2.includes(u)}
            onChange={()=>toggleCheck('q2',u)}/>
        ))}
      </div>

      {/* Q3 */}
      <div className="card">
        <QHead n={3} title="현재 AI 활용 수준을 스스로 평가해 주세요."/>
        {LEVELS.map(l=>(
          <RB key={l} label={l} selected={form.q3===l}
            onChange={()=>setForm(f=>({...f,q3:l}))}/>
        ))}
      </div>
    </div>
  );
}

// ── Step 2: 반복 업무 ─────────────────────────────────────────────────────────
function Step2({ form, setForm }) {
  return (
    <div>
      <h2 style={{fontSize:21,fontWeight:800,color:C.navy,marginBottom:5}}>반복 업무 파악</h2>
      <p style={{color:C.sub,fontSize:13,marginBottom:28}}>AI가 가장 도움이 될 수 있는 영역을 찾습니다.</p>

      {/* Q4 */}
      <div className="card">
        <QHead n={4} title="자주 반복되는 업무를 기재해 주세요."
          hint="빈도 예시: 매일/주1회/월1회 | AI 희망도: 1(낮음)~5(높음)"/>
        {/* 헤더 */}
        <div style={{
          display:'grid',gridTemplateColumns:'2.5fr 1fr 1fr .9fr',
          gap:7,marginBottom:9
        }}>
          {['업무명','빈도','소요시간','AI희망도'].map(h=>(
            <div key={h} style={{
              fontSize:11,fontWeight:700,color:'white',
              background:C.navy,padding:'7px 9px',
              borderRadius:7,textAlign:'center'
            }}>{h}</div>
          ))}
        </div>
        {form.q4.map((row,i)=>(
          <div key={i} style={{
            display:'grid',gridTemplateColumns:'2.5fr 1fr 1fr .9fr',
            gap:7,marginBottom:7,alignItems:'center'
          }}>
            <input type="text" placeholder={`업무 ${i+1}`} value={row.task}
              onChange={e=>{
                const q4=[...form.q4];q4[i]={...q4[i],task:e.target.value};
                setForm(f=>({...f,q4}));
              }} style={{fontSize:13}}/>
            <input type="text" placeholder="매일" value={row.freq}
              onChange={e=>{
                const q4=[...form.q4];q4[i]={...q4[i],freq:e.target.value};
                setForm(f=>({...f,q4}));
              }} style={{fontSize:13,textAlign:'center'}}/>
            <input type="text" placeholder="30분" value={row.time}
              onChange={e=>{
                const q4=[...form.q4];q4[i]={...q4[i],time:e.target.value};
                setForm(f=>({...f,q4}));
              }} style={{fontSize:13,textAlign:'center'}}/>
            <select value={row.hope}
              onChange={e=>{
                const q4=[...form.q4];q4[i]={...q4[i],hope:e.target.value};
                setForm(f=>({...f,q4}));
              }} style={{fontSize:13,padding:'11px 6px',textAlign:'center'}}>
              {['','1','2','3','4','5'].map(v=>(
                <option key={v} value={v}>{v||'-'}</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Q5 */}
      <div className="card">
        <QHead n={5} title="AI로 가장 빨리 자동화하고 싶은 업무 TOP 3를 입력해 주세요."/>
        {[1,2,3].map(n=>(
          <div key={n} style={{display:'flex',gap:10,alignItems:'center',marginBottom:10}}>
            <div style={{
              width:30,height:30,borderRadius:7,flexShrink:0,
              display:'flex',alignItems:'center',justifyContent:'center',
              fontWeight:800,fontSize:13,color:C.navy,
              background:n===1?C.gold:n===2?'#B8CCEE':'#CCBFA0'
            }}>{n}</div>
            <input type="text" placeholder={`${n}순위 업무`}
              value={form.q5[n-1]}
              onChange={e=>{
                const q5=[...form.q5];q5[n-1]=e.target.value;
                setForm(f=>({...f,q5}));
              }}/>
          </div>
        ))}
      </div>

      {/* Q6 */}
      <div className="card">
        <QHead n={6} title="업무 중 가장 많은 시간을 빼앗기는 상황을 자유롭게 설명해 주세요."
          hint="예: 같은 안내 문구를 환자마다 반복 입력, 보고서 양식을 매번 다르게 변환 등"/>
        <textarea rows={4} placeholder="자유롭게 작성해 주세요..."
          value={form.q6} onChange={e=>setForm(f=>({...f,q6:e.target.value}))}/>
      </div>
    </div>
  );
}

// ── Step 3: AI에게 바라는 것 ─────────────────────────────────────────────────
function Step3({ form, setForm, toggleCheck }) {
  return (
    <div>
      <h2 style={{fontSize:21,fontWeight:800,color:C.navy,marginBottom:5}}>AI에게 바라는 것</h2>
      <p style={{color:C.sub,fontSize:13,marginBottom:28}}>꿈의 AI 동료를 상상해서 답해 주세요.</p>

      {/* Q7 */}
      <div className="card">
        <QHead n={7} title="AI가 내 업무를 도와준다면, 어떤 역할을 해줬으면 하나요?" hint="복수 선택 가능"/>
        {WISHES.map(w=>(
          <CB key={w} label={w} checked={form.q7.includes(w)}
            onChange={()=>toggleCheck('q7',w)}/>
        ))}
        {form.q7.includes('기타')&&(
          <input type="text" placeholder="직접 입력" value={form.q7other}
            onChange={e=>setForm(f=>({...f,q7other:e.target.value}))} style={{marginTop:8}}/>
        )}
      </div>

      {/* Q8 */}
      <div className="card">
        <QHead n={8} title="AI 도입 시 가장 걱정되는 점은 무엇인가요?" hint="복수 선택 가능"/>
        {CONCERNS.map(c=>(
          <CB key={c} label={c} checked={form.q8.includes(c)}
            onChange={()=>toggleCheck('q8',c)}/>
        ))}
        {form.q8.includes('기타')&&(
          <input type="text" placeholder="직접 입력" value={form.q8other}
            onChange={e=>setForm(f=>({...f,q8other:e.target.value}))} style={{marginTop:8}}/>
        )}
      </div>
    </div>
  );
}

// ── Step 4: 교육 수요 ─────────────────────────────────────────────────────────
function Step4({ form, setForm }) {
  const opts = {
    q10time:['업무 시간 중','점심시간','퇴근 후','주말'],
    q10format:['집합 교육','온라인 강의','1:1 코칭','자율학습 자료'],
    q10duration:['30분 이내','1시간','2시간','반나절'],
    q10freq:['1회성','주 1회','월 1~2회','집중 단기'],
  };
  return (
    <div>
      <h2 style={{fontSize:21,fontWeight:800,color:C.navy,marginBottom:5}}>교육 수요 파악</h2>
      <p style={{color:C.sub,fontSize:13,marginBottom:28}}>Insight Academy 교육과정 설계에 활용됩니다.</p>

      {/* Q9 */}
      <div className="card">
        <QHead n={9} title="AI 교육을 받는다면 어떤 수준이 필요하신가요?"/>
        {EDU.map(e=>(
          <RB key={e} label={e} selected={form.q9===e}
            onChange={()=>setForm(f=>({...f,q9:e}))}/>
        ))}
      </div>

      {/* Q10 */}
      <div className="card">
        <QHead n={10} title="교육 방식 선호도를 알려 주세요."/>
        {[
          {label:'선호 교육 시간',field:'q10time'},
          {label:'선호 교육 방식',field:'q10format'},
          {label:'1회 적정 시간',field:'q10duration'},
          {label:'교육 희망 횟수',field:'q10freq'},
        ].map(({label,field})=>(
          <div key={field} style={{marginBottom:18}}>
            <div style={{fontSize:13,fontWeight:600,color:C.navy,marginBottom:9}}>{label}</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:7}}>
              {opts[field].map(o=>(
                <button key={o} className={`pill-btn${form[field]===o?' on':''}`}
                  onClick={()=>setForm(f=>({...f,[field]:o}))}>
                  {o}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Step 5: 자유의견 ──────────────────────────────────────────────────────────
function Step5({ form, setForm }) {
  return (
    <div>
      <h2 style={{fontSize:21,fontWeight:800,color:C.navy,marginBottom:5}}>자유 의견</h2>
      <p style={{color:C.sub,fontSize:13,marginBottom:28}}>마지막 단계입니다. 어떤 내용이든 편하게 적어 주세요.</p>

      {/* Q11 */}
      <div className="card">
        <QHead n={11} title="AI 도입과 관련해 건의 사항이나 아이디어가 있다면 자유롭게 적어 주세요."
          hint="아이디어·건의·우려 모두 환영합니다"/>
        <textarea rows={7}
          placeholder="예: 수술 전 환자 설명을 QR 코드로 연결하면 좋겠다, 간호 기록을 음성으로 입력하면 편할 것 같다..."
          value={form.q11} onChange={e=>setForm(f=>({...f,q11:e.target.value}))}/>
      </div>

      {/* 제출 안내 */}
      <div style={{
        background:C.light,borderRadius:14,padding:18,
        border:`1px solid ${C.border}`,display:'flex',gap:14,alignItems:'flex-start'
      }}>
        <span style={{fontSize:22,flexShrink:0}}>🔒</span>
        <div>
          <div style={{fontWeight:700,fontSize:14,color:C.navy,marginBottom:4}}>개인정보 안내</div>
          <div style={{fontSize:13,color:C.sub,lineHeight:1.7}}>
            작성하신 내용은 에이스병원 AI 도입 전략 수립에만 활용되며 외부에 공개되지 않습니다.
            아래 "제출하기" 버튼을 눌러 완료해 주세요.
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 감사 페이지 ───────────────────────────────────────────────────────────────
function ThanksView({ onNew }) {
  return (
    <div style={{
      minHeight:'100vh',background:C.navy3,
      display:'flex',alignItems:'center',justifyContent:'center',padding:24
    }}>
      <GlobalStyle/>
      <div className="si" style={{
        background:'rgba(255,255,255,.06)',
        border:'1px solid rgba(201,168,76,.28)',
        borderRadius:26,padding:'52px 44px',
        textAlign:'center',maxWidth:460,width:'100%',
        backdropFilter:'blur(18px)'
      }}>
        <div style={{
          width:66,height:66,borderRadius:'50%',
          background:C.gold,display:'flex',alignItems:'center',
          justifyContent:'center',margin:'0 auto 26px',fontSize:28
        }}>✓</div>
        <h2 style={{color:'white',fontSize:24,fontWeight:800,marginBottom:14}}>
          제출이 완료됐습니다!
        </h2>
        <p style={{color:'rgba(255,255,255,.6)',fontSize:14,lineHeight:1.85,marginBottom:14}}>
          소중한 의견을 작성해 주셔서 감사합니다.<br/>
          응답 내용을 바탕으로 <strong style={{color:C.gold}}>에이스병원 맞춤 AI 전략</strong>을<br/>
          수립하겠습니다.
        </p>
        <div style={{
          background:'rgba(201,168,76,.1)',borderRadius:12,padding:'14px 18px',
          marginBottom:30,border:'1px solid rgba(201,168,76,.22)'
        }}>
          <p style={{color:C.gold,fontSize:13,fontWeight:600}}>
            SIMPLIT × 에이스병원 AI 도입 프로젝트
          </p>
          <p style={{color:'rgba(255,255,255,.45)',fontSize:12,marginTop:3}}>
            분석 결과는 부서별로 공유될 예정입니다
          </p>
        </div>
        <button className="btn-ghost" onClick={onNew}
          style={{color:'rgba(255,255,255,.4)',borderColor:'rgba(255,255,255,.12)'}}>
          다른 사람이 작성하기
        </button>
      </div>
    </div>
  );
}

// ── 관리자 로그인 ─────────────────────────────────────────────────────────────
function AdminLoginView({ pwd, setPwd, onLogin, error, onBack }) {
  return (
    <div style={{
      minHeight:'100vh',background:C.navy3,
      display:'flex',alignItems:'center',justifyContent:'center',padding:24
    }}>
      <GlobalStyle/>
      <div style={{
        background:'rgba(255,255,255,.06)',borderRadius:22,padding:38,
        border:'1px solid rgba(255,255,255,.09)',backdropFilter:'blur(18px)',
        width:'100%',maxWidth:360,textAlign:'center'
      }}>
        <div style={{fontSize:34,marginBottom:14}}>🔑</div>
        <h3 style={{color:'white',fontSize:18,fontWeight:700,marginBottom:6}}>관리자 로그인</h3>
        <p style={{color:'rgba(255,255,255,.35)',fontSize:12,marginBottom:22}}>SIMPLIT 관리자 전용</p>
        <input type="password" placeholder="관리자 비밀번호"
          value={pwd} onChange={e=>setPwd(e.target.value)}
          onKeyDown={e=>e.key==='Enter'&&onLogin()}
          style={{
            background:'rgba(255,255,255,.08)',
            border:'1px solid rgba(255,255,255,.14)',
            color:'white',marginBottom:10
          }}/>
        {error&&<p style={{color:'#FF7070',fontSize:12,marginBottom:10}}>{error}</p>}
        <button className="btn-gold" onClick={onLogin} style={{width:'100%',marginBottom:10}}>
          입장하기
        </button>
        <button className="btn-ghost" onClick={onBack}
          style={{color:'rgba(255,255,255,.3)',borderColor:'rgba(255,255,255,.1)',width:'100%'}}>
          돌아가기
        </button>
      </div>
    </div>
  );
}

// ── 막대 차트 ─────────────────────────────────────────────────────────────────
function BarChart({ data, total }) {
  const max = Math.max(...data.map(d=>d.count),1);
  return (
    <div>
      {data.slice(0,7).map(({label,count})=>(
        <div key={label} style={{
          display:'flex',alignItems:'center',gap:10,marginBottom:9
        }}>
          <span style={{
            fontSize:12,color:'rgba(255,255,255,.6)',
            minWidth:160,maxWidth:160,lineHeight:1.3,flexShrink:0
          }}>{label}</span>
          <div style={{
            flex:1,height:7,background:'rgba(255,255,255,.1)',
            borderRadius:4,overflow:'hidden'
          }}>
            <div style={{
              height:'100%',background:C.gold,borderRadius:4,
              width:`${(count/max)*100}%`,transition:'width 1s ease'
            }}/>
          </div>
          <span style={{fontSize:13,fontWeight:700,color:C.gold,minWidth:22}}>{count}</span>
          <span style={{fontSize:11,color:'rgba(255,255,255,.3)',minWidth:32}}>
            {total>0?Math.round(count/total*100):0}%
          </span>
        </div>
      ))}
    </div>
  );
}

// ── 관리자 대시보드 ───────────────────────────────────────────────────────────
function AdminView({ responses, onBack, onRefresh, aiAnalysis, isAnalyzing, onAnalyze, countChoices, countSingle }) {
  const [tab, setTab] = useState('overview');
  const [expanded, setExpanded] = useState(null);
  const total = responses.length;

  const deptC  = countSingle('dept');
  const toolC  = countChoices('q1',TOOLS);
  const levelC = countSingle('q3');
  const wishC  = countChoices('q7',WISHES);
  const concC  = countChoices('q8',CONCERNS);
  const eduC   = countSingle('q9');

  return (
    <div style={{minHeight:'100vh',background:C.navy3}}>
      <GlobalStyle/>
      {/* 헤더 */}
      <div style={{
        background:'rgba(255,255,255,.04)',
        borderBottom:'1px solid rgba(255,255,255,.07)',
        padding:'14px 24px',position:'sticky',top:0,zIndex:100,
        backdropFilter:'blur(18px)'
      }}>
        <div style={{maxWidth:1060,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{
              width:26,height:26,borderRadius:6,background:C.gold,
              display:'flex',alignItems:'center',justifyContent:'center'
            }}>
              <span style={{color:C.navy,fontWeight:900,fontSize:11}}>S</span>
            </div>
            <span style={{color:'white',fontWeight:700,fontSize:14,letterSpacing:2}}>SIMPLIT</span>
            <span style={{color:'rgba(255,255,255,.25)',fontSize:12}}>관리자 대시보드</span>
          </div>
          <div style={{display:'flex',gap:8}}>
            <button onClick={onRefresh} className="btn-ghost"
              style={{color:'rgba(255,255,255,.45)',borderColor:'rgba(255,255,255,.12)',fontSize:12}}>
              🔄 새로고침
            </button>
            <button onClick={onBack} className="btn-ghost"
              style={{color:'rgba(255,255,255,.45)',borderColor:'rgba(255,255,255,.12)',fontSize:12}}>
              ← 나가기
            </button>
          </div>
        </div>
      </div>

      <div style={{maxWidth:1060,margin:'0 auto',padding:'24px 20px'}}>
        {/* 요약 카드 */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:24}}>
          {[
            {icon:'📋',label:'총 응답',val:`${total}명`,sub:'수집된 설문'},
            {icon:'🏢',label:'참여 부서',val:`${deptC.length}개`,sub:`${DEPTS.length}개 부서 중`},
            {icon:'✨',label:'AI 1순위 희망',val:(wishC[0]?.label||'-').slice(0,8),sub:`${wishC[0]?.count||0}명`},
            {icon:'⚠️',label:'1순위 우려',val:(concC[0]?.label||'-').slice(0,8),sub:`${concC[0]?.count||0}명`},
          ].map((c,i)=>(
            <div key={i} style={{
              background:'rgba(255,255,255,.05)',borderRadius:16,padding:18,
              border:'1px solid rgba(255,255,255,.07)'
            }}>
              <div style={{fontSize:22,marginBottom:7}}>{c.icon}</div>
              <div style={{color:C.gold,fontSize:20,fontWeight:800,marginBottom:3}}>{c.val}</div>
              <div style={{color:'rgba(255,255,255,.7)',fontSize:12,fontWeight:600}}>{c.label}</div>
              <div style={{color:'rgba(255,255,255,.28)',fontSize:11,marginTop:2}}>{c.sub}</div>
            </div>
          ))}
        </div>

        {/* 탭 */}
        <div style={{
          display:'flex',gap:3,marginBottom:22,
          background:'rgba(255,255,255,.04)',padding:4,
          borderRadius:12,width:'fit-content'
        }}>
          {[['overview','📊 개요'],['details','📋 상세 응답'],['ai','🤖 AI 분석']].map(([t,l])=>(
            <button key={t} onClick={()=>setTab(t)} style={{
              padding:'7px 16px',borderRadius:8,border:'none',cursor:'pointer',
              background:tab===t?C.gold:'transparent',
              color:tab===t?C.navy:'rgba(255,255,255,.45)',
              fontFamily:"'Noto Sans KR',sans-serif",
              fontWeight:tab===t?700:400,fontSize:13
            }}>{l}</button>
          ))}
        </div>

        {/* 개요 */}
        {tab==='overview'&&(
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18}}>
            {[
              {title:'🏢 부서별 응답',data:deptC},
              {title:'🤖 사용 중인 AI 도구',data:toolC},
              {title:'📈 AI 활용 수준',data:levelC},
              {title:'✨ AI에게 바라는 것',data:wishC},
              {title:'⚠️ 주요 우려사항',data:concC},
              {title:'📚 교육 수요',data:eduC},
            ].map(({title,data})=>(
              <div key={title} className="card-dark">
                <h3 style={{color:'white',fontSize:13,fontWeight:700,marginBottom:18}}>{title}</h3>
                {total===0
                  ?<p style={{color:'rgba(255,255,255,.25)',fontSize:13}}>아직 응답이 없습니다.</p>
                  :<BarChart data={data} total={total}/>
                }
              </div>
            ))}
          </div>
        )}

        {/* 상세 응답 */}
        {tab==='details'&&(
          <div>
            {total===0
              ?<div style={{
                textAlign:'center',padding:'56px 20px',
                color:'rgba(255,255,255,.25)',fontSize:14,lineHeight:2
              }}>
                아직 응답이 없습니다.<br/>설문 링크를 각 부서 담당자에게 공유해 주세요.
              </div>
              :responses.map((r,i)=>(
                <div key={r.id} className="card-dark" style={{cursor:'pointer'}}
                  onClick={()=>setExpanded(expanded===i?null:i)}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div>
                      <span style={{
                        background:C.gold,color:C.navy,fontWeight:700,
                        fontSize:11,padding:'3px 10px',borderRadius:20,marginRight:8
                      }}>{r.dept||'미기재'}</span>
                      <span style={{color:'white',fontSize:14,fontWeight:600}}>
                        {r.name||'익명'}
                      </span>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:9}}>
                      <span style={{color:'rgba(255,255,255,.25)',fontSize:11}}>{r.submittedAt}</span>
                      <span style={{color:C.gold,fontSize:13}}>{expanded===i?'▲':'▼'}</span>
                    </div>
                  </div>
                  {expanded===i&&(
                    <div style={{
                      marginTop:16,paddingTop:16,
                      borderTop:'1px solid rgba(255,255,255,.08)'
                    }}>
                      {[
                        {l:'AI 도구',v:r.q1?.join(', ')||'-'},
                        {l:'활용 용도',v:r.q2?.join(', ')||'-'},
                        {l:'AI 수준',v:r.q3||'-'},
                        {l:'TOP3 자동화',v:r.q5?.filter(Boolean).join(' | ')||'-'},
                        {l:'시간빼앗는업무',v:r.q6||'-'},
                        {l:'AI에 바라는 것',v:r.q7?.join(', ')||'-'},
                        {l:'우려사항',v:r.q8?.join(', ')||'-'},
                        {l:'교육 수준',v:r.q9||'-'},
                        {l:'자유 의견',v:r.q11||'-'},
                      ].map(({l,v})=>(
                        <div key={l} style={{
                          display:'flex',gap:12,marginBottom:9,fontSize:13
                        }}>
                          <span style={{
                            color:C.gold,fontWeight:700,
                            minWidth:120,flexShrink:0
                          }}>{l}</span>
                          <span style={{
                            color:'rgba(255,255,255,.7)',lineHeight:1.6
                          }}>{v}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            }
          </div>
        )}

        {/* AI 분석 */}
        {tab==='ai'&&(
          <div>
            <div className="card-dark">
              <h3 style={{color:'white',fontSize:15,fontWeight:700,marginBottom:8}}>
                🤖 Claude AI 자동 분석
              </h3>
              <p style={{color:'rgba(255,255,255,.45)',fontSize:13,marginBottom:20,lineHeight:1.7}}>
                수집된 {total}개의 응답을 Claude AI가 분석하여<br/>
                부서별 Pain Point, 우선순위, 교육 수요를 자동으로 정리합니다.
              </p>
              <button className="btn-gold" onClick={onAnalyze}
                disabled={total===0||isAnalyzing}
                style={{animation:isAnalyzing?'pulse 1.4s infinite':'none'}}>
                {isAnalyzing
                  ?<span style={{display:'flex',alignItems:'center',gap:8}}>
                    <span style={{
                      width:16,height:16,border:'2px solid rgba(27,58,107,.3)',
                      borderTop:`2px solid ${C.navy}`,borderRadius:'50%',
                      animation:'spin .8s linear infinite',display:'inline-block'
                    }}/>
                    분석 중...
                  </span>
                  :`${total}개 응답 AI 분석 시작`
                }
              </button>
            </div>

            {aiAnalysis&&(
              <div style={{
                background:'rgba(201,168,76,.07)',borderRadius:18,padding:26,
                border:'1px solid rgba(201,168,76,.2)'
              }}>
                <div style={{
                  display:'flex',alignItems:'center',gap:10,
                  marginBottom:18,paddingBottom:14,
                  borderBottom:'1px solid rgba(201,168,76,.18)'
                }}>
                  <span style={{fontSize:18}}>✨</span>
                  <span style={{color:C.gold,fontWeight:700,fontSize:14}}>AI 분석 결과</span>
                </div>
                <div style={{
                  color:'rgba(255,255,255,.8)',fontSize:14,
                  lineHeight:1.9,whiteSpace:'pre-wrap'
                }}>{aiAnalysis}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── 메인 App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView]         = useState('landing');
  const [step, setStep]         = useState(1);
  const [form, setForm]         = useState(emptyForm());
  const [allResp, setAllResp]   = useState([]);
  const [adminPwd, setAdminPwd] = useState('');
  const [adminErr, setAdminErr] = useState('');
  const [aiAnal, setAiAnal]     = useState('');
  const [isAnal, setIsAnal]     = useState(false);
  const TOTAL = 5;

  useEffect(()=>{ if(view==='admin') loadResp(); },[view]);

  async function loadResp() {
    try {
      const r = await window.storage.list('ace_survey:',true);
      if(!r?.keys?.length){ setAllResp([]); return; }
      const arr = await Promise.all(
        r.keys.map(async k=>{
          try{
            const v=await window.storage.get(k,true);
            return v?JSON.parse(v.value):null;
          }catch{return null;}
        })
      );
      setAllResp(arr.filter(Boolean).sort((a,b)=>b.id-a.id));
    } catch{ setAllResp([]); }
  }

  async function submit() {
    const id=Date.now();
    const entry={id,submittedAt:new Date().toLocaleString('ko-KR'),...form};
    try{
      await window.storage.set(`ace_survey:${id}`,JSON.stringify(entry),true);
      setView('thanks');
    }catch(e){
      alert('제출 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  }

  function toggleCheck(field,val){
    setForm(f=>({
      ...f,
      [field]:f[field].includes(val)?f[field].filter(x=>x!==val):[...f[field],val]
    }));
  }

  function handleAdminLogin(){
    if(adminPwd==='SIMPLIT2026'){ setAdminErr(''); setView('admin'); }
    else setAdminErr('비밀번호가 올바르지 않습니다.');
  }

  async function runAI(){
    if(!allResp.length) return;
    setIsAnal(true); setAiAnal('');
    const summary = allResp.map((r,i)=>
      `[응답${i+1}] 부서:${r.dept} | AI수준:${r.q3} | 자동화희망:${r.q7?.join(',')} | 우려:${r.q8?.join(',')} | TOP3:${r.q5?.filter(Boolean).join('/')} | 교육:${r.q9} | 의견:${r.q11}`
    ).join('\n');
    try{
      const res=await fetch('https://api.anthropic.com/v1/messages',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          model:'claude-sonnet-4-20250514',
          max_tokens:1000,
          messages:[{role:'user',content:
            `에이스병원 AI 도입 설문 응답 분석. 한국어로 다음 구조로 답변:\n\n1️⃣ 부서별 핵심 Pain Point\n2️⃣ AI 즉시 도입 권장 TOP 3 영역 (이유 포함)\n3️⃣ 가장 많이 요청된 AI 기능 순위\n4️⃣ 교육 방향 제안\n5️⃣ 한 줄 총평\n\n응답 데이터:\n${summary}`
          }]
        })
      });
      const data=await res.json();
      setAiAnal(data.content?.[0]?.text||'분석 실패');
    }catch(e){
      setAiAnal('분석 중 오류: '+e.message);
    }
    setIsAnal(false);
  }

  function countChoices(field,choices){
    return choices.map(c=>({
      label:c,
      count:allResp.filter(r=>r[field]?.includes(c)).length
    })).sort((a,b)=>b.count-a.count);
  }
  function countSingle(field){
    const m={};
    allResp.forEach(r=>{if(r[field]) m[r[field]]=(m[r[field]]||0)+1;});
    return Object.entries(m).map(([k,v])=>({label:k,count:v})).sort((a,b)=>b.count-a.count);
  }

  // 라우팅
  if(view==='landing')    return <LandingView onStart={()=>{setStep(1);setView('form');}} onAdmin={()=>setView('adminLogin')}/>;
  if(view==='form')       return <FormView form={form} setForm={setForm} step={step} total={TOTAL}
                                    onNext={()=>step<TOTAL?setStep(s=>s+1):submit()}
                                    onPrev={()=>step>1&&setStep(s=>s-1)}
                                    toggleCheck={toggleCheck}/>;
  if(view==='thanks')     return <ThanksView onNew={()=>{setForm(emptyForm());setStep(1);setView('landing');}}/>;
  if(view==='adminLogin') return <AdminLoginView pwd={adminPwd} setPwd={setAdminPwd}
                                    onLogin={handleAdminLogin} error={adminErr}
                                    onBack={()=>setView('landing')}/>;
  if(view==='admin')      return <AdminView responses={allResp} onBack={()=>{setView('landing');setAiAnal('');}}
                                    onRefresh={loadResp} aiAnalysis={aiAnal}
                                    isAnalyzing={isAnal} onAnalyze={runAI}
                                    countChoices={countChoices} countSingle={countSingle}/>;
}
