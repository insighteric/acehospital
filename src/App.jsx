import { useState, useEffect } from "react";

const SUPABASE_URL = 'https://auxmfksrjqbsrcliswfl.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1eG1ma3NyanFic3JjbGlzd2ZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNjcwNTMsImV4cCI6MjA4OTk0MzA1M30.PXliWOIPbXeU9rTCmfxWv4eRPlsznVbhMHDSK01dNk8'

const C = {
  navy: '#1B3A6B', navy2: '#0D2240', navy3: '#0A1628',
  blue: '#2E5090', accent: '#4A90D9',
  gold: '#C9A84C', gold2: '#F0D98A',
  white: '#FFFFFF', offwhite: '#F7FAFD',
  light: '#EEF3FA', mid: '#D6E4F4',
  text: '#0F1B2D', sub: '#5A6B82',
  border: '#C8D8EE',
};

const DEPTS = [
  '진료부','병동간호팀','수술간호팀','외래간호팀',
  '영상의학팀','진단검사의학팀','건강치료팀(물리치료팀)',
  '건강검진팀','원무팀','CRM팀','약제팀','총무팀',
  '심사팀','인사재무팀','간호행정팀','기타'
];
const TOOLS = ['ChatGPT','Claude','Gemini','뤼튼(wrtn)','Microsoft Copilot',
  '네이버 클로바X','기타 AI 도구','AI 미사용'];
const USES = ['문서·보고서 작성','이메일·공문 초안','정보 검색·요약','번역',
  '아이디어·기획','데이터 분석','이미지·영상 제작','코딩·자동화','기타'];
const LEVELS = [
  '① 전혀 모름 / AI가 생소함',
  '② 가끔 검색 수준으로만 사용',
  '③ 문서 작성 등 기본 업무 활용',
  '④ 여러 도구 조합해 적극 활용',
  '⑤ AI 자동화·워크플로우 설계 가능'
];
const WISHES = [
  '문서·보고서 자동 작성','환자 안내·문자 자동 발송',
  '데이터 분석 후 보고서 생성','법령·규정 즉시 검색·안내',
  '회의록·메모 자동 정리','SNS·블로그·유튜브 콘텐츠 초안',
  '이미지·영상 편집 보조','환자 예약·문의 24시간 대응','기타'
];
const CONCERNS = [
  '개인정보·환자정보 유출 위험','AI 오정보 제공 우려',
  '사용법 학습 부담','일자리 위협','기존 EMR 연동 어려움',
  'AI 결과물 신뢰도 (재확인 필요)','특별한 우려 없음','기타'
];
const EDU = [
  '완전 초보 (AI 기초부터)',
  '기초 — ChatGPT·Claude 활용법',
  '중급 — 부서 특화 프롬프트 작성',
  '고급 — AI 자동화 워크플로우 설계',
  '관리자용 — AI 도입 전략 이해'
];

const emptyForm = () => ({
  dept:'', deptOther:'',
  name:'', position:'', email:'',
  q1:[], q1other:'', q2:[], q2other:'', q3:'',
  q4: Array(5).fill(null).map(()=>({task:'',freq:'',time:'',hope:''})),
  q5:['','',''], q6:'',
  q7:[], q7other:'', q8:[], q8other:'',
  q9:'', q10time:'', q10format:'', q10duration:'', q10freq:'', q11:'',
});

function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;900&display=swap');
      *{box-sizing:border-box;margin:0;padding:0;}
      body{font-family:'Noto Sans KR',sans-serif;}
      ::placeholder{color:#A0B0C8;}
      ::-webkit-scrollbar{width:5px;}
      ::-webkit-scrollbar-track{background:#EEF3FA;}
      ::-webkit-scrollbar-thumb{background:#4A90D9;border-radius:3px;}
      @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
      @keyframes scaleIn{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}
      @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
      @keyframes spin{to{transform:rotate(360deg)}}
      .fu{animation:fadeUp .55s ease forwards;}
      .fu2{animation:fadeUp .55s .12s ease forwards;opacity:0;}
      .fu3{animation:fadeUp .55s .24s ease forwards;opacity:0;}
      .fu4{animation:fadeUp .55s .36s ease forwards;opacity:0;}
      .si{animation:scaleIn .35s ease forwards;}
      .cb{display:flex;align-items:center;gap:10px;padding:11px 14px;border-radius:10px;
        cursor:pointer;border:1.5px solid #C8D8EE;background:white;
        transition:all .18s ease;margin-bottom:7px;user-select:none;}
      .cb:hover{border-color:#4A90D9;background:#EEF3FA;}
      .cb.on{border-color:#C9A84C;background:#FFFCF0;}
      .rb{display:flex;align-items:center;gap:10px;padding:11px 14px;border-radius:10px;
        cursor:pointer;border:1.5px solid #C8D8EE;background:white;
        transition:all .18s ease;margin-bottom:7px;user-select:none;}
      .rb:hover{border-color:#4A90D9;background:#EEF3FA;}
      .rb.on{border-color:#C9A84C;background:#FFFCF0;}
      .btn-gold{background:#C9A84C;color:#1B3A6B;font-family:'Noto Sans KR',sans-serif;
        font-weight:700;font-size:15px;padding:13px 30px;border:none;border-radius:50px;
        cursor:pointer;transition:all .22s ease;}
      .btn-gold:hover{background:#F0D98A;transform:translateY(-2px);
        box-shadow:0 8px 22px rgba(201,168,76,.38);}
      .btn-gold:disabled{opacity:.4;cursor:not-allowed;transform:none;}
      .btn-navy{background:#1B3A6B;color:white;font-family:'Noto Sans KR',sans-serif;
        font-weight:600;font-size:14px;padding:12px 26px;border:none;border-radius:50px;
        cursor:pointer;transition:all .22s ease;}
      .btn-navy:hover{background:#2E5090;transform:translateY(-1px);}
      .btn-ghost{background:transparent;color:#5A6B82;font-family:'Noto Sans KR',sans-serif;
        font-weight:500;font-size:13px;padding:9px 18px;border:1.5px solid #C8D8EE;
        border-radius:50px;cursor:pointer;transition:all .18s ease;}
      .btn-ghost:hover{border-color:#5A6B82;color:#0F1B2D;}
      input,textarea,select{font-family:'Noto Sans KR',sans-serif;font-size:14px;
        padding:11px 14px;border:1.5px solid #C8D8EE;border-radius:10px;
        background:white;color:#0F1B2D;transition:border-color .18s ease;
        width:100%;outline:none;}
      input:focus,textarea:focus,select:focus{border-color:#C9A84C;}
      textarea{resize:vertical;line-height:1.7;}
      .card{background:white;border-radius:18px;padding:26px;
        border:1px solid #C8D8EE;margin-bottom:18px;}
      .card-dark{background:rgba(255,255,255,.05);border-radius:18px;padding:24px;
        border:1px solid rgba(255,255,255,.08);margin-bottom:16px;}
      .tag{display:inline-flex;align-items:center;background:#C9A84C;color:#1B3A6B;
        font-weight:700;font-size:11px;padding:3px 10px;border-radius:20px;
        letter-spacing:.5px;margin-right:8px;}
      .pill-btn{padding:8px 15px;border-radius:20px;cursor:pointer;
        font-family:'Noto Sans KR',sans-serif;font-size:13px;transition:all .18s ease;
        border:1.5px solid #C8D8EE;background:white;color:#5A6B82;}
      .pill-btn:hover{border-color:#4A90D9;color:#1B3A6B;}
      .pill-btn.on{border-color:#C9A84C;background:#FFFCF0;color:#1B3A6B;font-weight:700;}
    `}</style>
  );
}

function CB({ label, checked, onChange }) {
  return (
    <div className={`cb${checked?' on':''}`} onClick={onChange}>
      <div style={{width:18,height:18,borderRadius:5,flexShrink:0,transition:'all .15s',
        border:`2px solid ${checked?'#C9A84C':'#C8D8EE'}`,
        background:checked?'#C9A84C':'white',
        display:'flex',alignItems:'center',justifyContent:'center'}}>
        {checked&&<span style={{color:'white',fontSize:11,fontWeight:700,lineHeight:1}}>✓</span>}
      </div>
      <span style={{fontSize:14,color:'#0F1B2D',lineHeight:1.4}}>{label}</span>
    </div>
  );
}

function RB({ label, selected, onChange }) {
  return (
    <div className={`rb${selected?' on':''}`} onClick={onChange}>
      <div style={{width:18,height:18,borderRadius:'50%',flexShrink:0,transition:'all .15s',
        border:`2px solid ${selected?'#C9A84C':'#C8D8EE'}`,background:'white',
        display:'flex',alignItems:'center',justifyContent:'center'}}>
        {selected&&<div style={{width:9,height:9,borderRadius:'50%',background:'#C9A84C'}}/>}
      </div>
      <span style={{fontSize:14,color:'#0F1B2D',lineHeight:1.4}}>{label}</span>
    </div>
  );
}

function QHead({ n, title, hint }) {
  return (
    <div style={{marginBottom:18}}>
      <div style={{display:'flex',alignItems:'baseline',gap:8,marginBottom:hint?5:0}}>
        <span className="tag">Q{n}</span>
        <span style={{fontWeight:700,fontSize:15,color:'#1B3A6B'}}>{title}</span>
      </div>
      {hint&&<p style={{fontSize:12,color:'#5A6B82',paddingLeft:46,lineHeight:1.5}}>{hint}</p>}
    </div>
  );
}

function LandingView({ onStart, onAdmin }) {
  return (
    <div style={{minHeight:'100vh',background:'#0A1628',display:'flex',
      flexDirection:'column',position:'relative',overflow:'hidden'}}>
      <GlobalStyle/>
      <div style={{position:'absolute',inset:0,pointerEvents:'none'}}>
        <div style={{position:'absolute',top:'-15%',right:'-8%',width:550,height:550,
          borderRadius:'50%',background:'radial-gradient(circle,rgba(201,168,76,.11) 0%,transparent 65%)'}}/>
        <div style={{position:'absolute',bottom:'-8%',left:'-12%',width:480,height:480,
          borderRadius:'50%',background:'radial-gradient(circle,rgba(46,80,144,.35) 0%,transparent 65%)'}}/>
        <div style={{position:'absolute',inset:0,
          backgroundImage:'linear-gradient(rgba(201,168,76,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,.03) 1px,transparent 1px)',
          backgroundSize:'56px 56px'}}/>
      </div>
      <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',
        justifyContent:'center',padding:'60px 20px',position:'relative',zIndex:1}}>
        <div className="fu" style={{marginBottom:10,textAlign:'center'}}>
          <div style={{display:'inline-flex',flexDirection:'column',alignItems:'center',
            background:'rgba(255,255,255,.07)',border:'1.5px solid rgba(201,168,76,.4)',
            padding:'20px 36px',borderRadius:20,backdropFilter:'blur(12px)'}}>
            <div style={{width:54,height:54,borderRadius:14,
              background:'linear-gradient(135deg,#C9A84C,#F0D98A)',
              display:'flex',alignItems:'center',justifyContent:'center',
              marginBottom:10,boxShadow:'0 4px 16px rgba(201,168,76,.4)'}}>
              <span style={{color:'#1B3A6B',fontWeight:900,fontSize:22}}>A</span>
            </div>
            <span style={{color:'white',fontWeight:900,fontSize:20,letterSpacing:2,marginBottom:3}}>
              에이스병원
            </span>
            <span style={{color:'#C9A84C',fontSize:11,letterSpacing:3,fontWeight:500}}>
              ACE HOSPITAL
            </span>
          </div>
        </div>
        <div className="fu2" style={{marginBottom:28,textAlign:'center'}}>
          <span style={{color:'rgba(255,255,255,.28)',fontSize:11,letterSpacing:2}}>
            AI 컨설팅 파트너 · SIMPLIT
          </span>
        </div>
        <div className="fu2" style={{textAlign:'center',maxWidth:600,marginBottom:14}}>
          <div style={{color:'#C9A84C',fontSize:11,fontWeight:700,letterSpacing:4,
            marginBottom:20,textTransform:'uppercase'}}>
            AI 도입 부서 업무 현황 파악 설문
          </div>
          <h1 style={{color:'white',fontSize:'clamp(24px,4.2vw,42px)',
            fontWeight:900,lineHeight:1.25,marginBottom:22}}>
            에이스병원이 더 스마트하게<br/>
            <span style={{color:'#C9A84C'}}>일하는 방법</span>을<br/>
            함께 찾아봅시다
          </h1>
          <p style={{color:'rgba(255,255,255,.6)',fontSize:15,lineHeight:1.9,marginBottom:36}}>
            각 부서에서 실제로 겪고 계신 반복 업무와<br/>
            AI에게 맡기고 싶은 일을 알려주세요.<br/>
            <strong style={{color:'rgba(255,255,255,.85)'}}>소요시간: 약 10~15분</strong>
          </p>
        </div>
        <div className="fu3" style={{display:'flex',flexDirection:'column',alignItems:'center',gap:12}}>
          <button className="btn-gold" onClick={onStart} style={{fontSize:16,padding:'15px 44px'}}>
            설문 시작하기 →
          </button>
          <span style={{color:'rgba(255,255,255,.3)',fontSize:12}}>
            응답 내용은 에이스병원 AI 도입 전략에만 활용됩니다
          </span>
        </div>
        <div className="fu4" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',
          gap:12,maxWidth:480,marginTop:48,width:'100%'}}>
          {[
            {icon:'📋',t:'5개 파트 · 11개 문항'},
            {icon:'⏱',t:'약 10~15분 소요'},
            {icon:'🔒',t:'내부 전략 수립 목적'},
          ].map((c,i)=>(
            <div key={i} style={{background:'rgba(255,255,255,.05)',
              border:'1px solid rgba(255,255,255,.09)',borderRadius:14,
              padding:'16px 10px',textAlign:'center',backdropFilter:'blur(8px)'}}>
              <div style={{fontSize:20,marginBottom:6}}>{c.icon}</div>
              <div style={{color:'rgba(255,255,255,.7)',fontSize:12,lineHeight:1.6}}>{c.t}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{textAlign:'center',padding:'16px',position:'relative',zIndex:1}}>
        <button onClick={onAdmin} style={{background:'none',border:'none',
          color:'rgba(255,255,255,.1)',fontSize:11,cursor:'pointer',letterSpacing:2}}>
          관리자
        </button>
      </div>
    </div>
  );
}

function FormTopBar({ step, total }) {
  const titles = ['기본정보·AI현황','반복 업무 파악','AI에게 바라는 것','교육 수요','자유 의견'];
  const pct = (step/total)*100;
  return (
    <div style={{background:'#1B3A6B',color:'white',padding:'0 20px',
      position:'sticky',top:0,zIndex:100,boxShadow:'0 2px 18px rgba(27,58,107,.3)'}}>
      <div style={{maxWidth:720,margin:'0 auto'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 0 6px'}}>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <div style={{width:24,height:24,borderRadius:6,
              background:'linear-gradient(135deg,#C9A84C,#F0D98A)',
              display:'flex',alignItems:'center',justifyContent:'center'}}>
              <span style={{color:'#1B3A6B',fontWeight:900,fontSize:11}}>A</span>
            </div>
            <span style={{fontWeight:800,fontSize:15,letterSpacing:1}}>에이스병원</span>
            <span style={{color:'rgba(255,255,255,.25)',fontSize:11}}>AI 설문</span>
          </div>
          <span style={{color:'#C9A84C',fontSize:12,fontWeight:600}}>{step}/{total}</span>
        </div>
        <div style={{paddingBottom:8}}>
          <div style={{display:'flex',justifyContent:'space-between',
            fontSize:11,color:'rgba(255,255,255,.45)',marginBottom:4}}>
            <span>{titles[step-1]}</span>
            <span>{Math.round(pct)}%</span>
          </div>
          <div style={{height:3,background:'rgba(255,255,255,.14)',borderRadius:2}}>
            <div style={{height:'100%',background:'#C9A84C',borderRadius:2,
              width:`${pct}%`,transition:'width .4s ease'}}/>
          </div>
        </div>
        <div style={{display:'flex',gap:5,padding:'7px 0',overflowX:'auto',scrollbarWidth:'none'}}>
          {titles.map((t,i)=>(
            <div key={i} style={{fontSize:10,padding:'3px 10px',borderRadius:20,
              whiteSpace:'nowrap',flexShrink:0,
              background:i+1===step?'#C9A84C':i+1<step?'rgba(201,168,76,.28)':'rgba(255,255,255,.07)',
              color:i+1===step?'#1B3A6B':i+1<step?'#C9A84C':'rgba(255,255,255,.3)',
              fontWeight:i+1===step?700:400}}>
              {i+1<step?'✓ ':''}{t}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Step1({ form, setForm, toggleCheck }) {
  return (
    <div>
      <h2 style={{fontSize:20,fontWeight:800,color:'#1B3A6B',marginBottom:4}}>기본 정보 · AI 현황</h2>
      <p style={{color:'#5A6B82',fontSize:13,marginBottom:24}}>기본 정보와 현재 AI 활용 현황을 알려주세요.</p>
      <div className="card">
        <h3 style={{fontSize:14,fontWeight:700,color:'#1B3A6B',marginBottom:16,
          paddingBottom:10,borderBottom:'2px solid #EEF3FA'}}>📌 기본 정보</h3>
        <div style={{marginBottom:14}}>
          <label style={{fontSize:12,fontWeight:700,color:'#5A6B82',display:'block',marginBottom:6}}>
            소속 부서 *
          </label>
          <select value={form.dept} onChange={e=>setForm(f=>({...f,dept:e.target.value}))}>
            <option value="">-- 소속 부서를 선택해 주세요 --</option>
            {DEPTS.map(d=><option key={d} value={d}>{d}</option>)}
          </select>
          {form.dept==='기타'&&(
            <input type="text" placeholder="부서명을 직접 입력해 주세요"
              value={form.deptOther}
              onChange={e=>setForm(f=>({...f,deptOther:e.target.value}))}
              style={{marginTop:8}}/>
          )}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:14}}>
          <div>
            <label style={{fontSize:12,fontWeight:700,color:'#5A6B82',display:'block',marginBottom:6}}>
              성명 *
            </label>
            <input type="text" placeholder="홍길동"
              value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/>
          </div>
          <div>
            <label style={{fontSize:12,fontWeight:700,color:'#5A6B82',display:'block',marginBottom:6}}>
              직책 *
            </label>
            <input type="text" placeholder="수간호사 / 팀장 / 주임 등"
              value={form.position} onChange={e=>setForm(f=>({...f,position:e.target.value}))}/>
          </div>
        </div>
        <div>
          <label style={{fontSize:12,fontWeight:700,color:'#5A6B82',display:'block',marginBottom:6}}>
            이메일 주소
          </label>
          <input type="email" placeholder="example@acehospital.co.kr"
            value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}/>
          <p style={{fontSize:11,color:'#5A6B82',marginTop:5,paddingLeft:2}}>
            분석 결과 공유 목적으로만 사용됩니다. 선택 입력입니다.
          </p>
        </div>
      </div>
      <div className="card">
        <QHead n={1} title="현재 사용 중인 AI 도구를 모두 선택해 주세요." hint="복수 선택 가능"/>
        {TOOLS.map(t=>(
          <CB key={t} label={t} checked={form.q1.includes(t)} onChange={()=>toggleCheck('q1',t)}/>
        ))}
        {form.q1.includes('기타 AI 도구')&&(
          <input type="text" placeholder="사용 중인 AI 도구명을 입력해 주세요"
            value={form.q1other} onChange={e=>setForm(f=>({...f,q1other:e.target.value}))}
            style={{marginTop:8}}/>
        )}
      </div>
      <div className="card">
        <QHead n={2} title="AI를 주로 어떤 용도로 사용하시나요?" hint="복수 선택 가능"/>
        {USES.map(u=>(
          <CB key={u} label={u} checked={form.q2.includes(u)} onChange={()=>toggleCheck('q2',u)}/>
        ))}
      </div>
      <div className="card">
        <QHead n={3} title="현재 AI 활용 수준을 스스로 평가해 주세요."/>
        {LEVELS.map(l=>(
          <RB key={l} label={l} selected={form.q3===l} onChange={()=>setForm(f=>({...f,q3:l}))}/>
        ))}
      </div>
    </div>
  );
}

function Step2({ form, setForm }) {
  return (
    <div>
      <h2 style={{fontSize:20,fontWeight:800,color:'#1B3A6B',marginBottom:4}}>반복 업무 파악</h2>
      <p style={{color:'#5A6B82',fontSize:13,marginBottom:24}}>AI가 가장 도움이 될 수 있는 영역을 찾습니다.</p>
      <div className="card">
        <QHead n={4} title="자주 반복되는 업무를 기재해 주세요."
          hint="빈도 예시: 매일 / 주1회 / 월1회 | AI 희망도: 1(낮음) ~ 5(높음)"/>
        <div style={{display:'grid',gridTemplateColumns:'2.5fr 1fr 1fr .9fr',gap:7,marginBottom:9}}>
          {['업무명','빈도','소요시간','AI희망도'].map(h=>(
            <div key={h} style={{fontSize:11,fontWeight:700,color:'white',
              background:'#1B3A6B',padding:'7px 9px',borderRadius:7,textAlign:'center'}}>{h}</div>
          ))}
        </div>
        {form.q4.map((row,i)=>(
          <div key={i} style={{display:'grid',gridTemplateColumns:'2.5fr 1fr 1fr .9fr',
            gap:7,marginBottom:7,alignItems:'center'}}>
            <input type="text" placeholder={`업무 ${i+1}`} value={row.task}
              onChange={e=>{const q4=[...form.q4];q4[i]={...q4[i],task:e.target.value};setForm(f=>({...f,q4}));}}
              style={{fontSize:13}}/>
            <input type="text" placeholder="매일" value={row.freq}
              onChange={e=>{const q4=[...form.q4];q4[i]={...q4[i],freq:e.target.value};setForm(f=>({...f,q4}));}}
              style={{fontSize:13,textAlign:'center'}}/>
            <input type="text" placeholder="30분" value={row.time}
              onChange={e=>{const q4=[...form.q4];q4[i]={...q4[i],time:e.target.value};setForm(f=>({...f,q4}));}}
              style={{fontSize:13,textAlign:'center'}}/>
            <select value={row.hope}
              onChange={e=>{const q4=[...form.q4];q4[i]={...q4[i],hope:e.target.value};setForm(f=>({...f,q4}));}}
              style={{fontSize:13,padding:'11px 6px',textAlign:'center'}}>
              {['','1','2','3','4','5'].map(v=><option key={v} value={v}>{v||'-'}</option>)}
            </select>
          </div>
        ))}
      </div>
      <div className="card">
        <QHead n={5} title="AI로 가장 빨리 자동화하고 싶은 업무 TOP 3를 입력해 주세요."/>
        {[1,2,3].map(n=>(
          <div key={n} style={{display:'flex',gap:10,alignItems:'center',marginBottom:10}}>
            <div style={{width:30,height:30,borderRadius:7,flexShrink:0,
              display:'flex',alignItems:'center',justifyContent:'center',
              fontWeight:800,fontSize:13,color:'#1B3A6B',
              background:n===1?'#C9A84C':n===2?'#B8CCEE':'#CCBFA0'}}>{n}</div>
            <input type="text" placeholder={`${n}순위 업무`}
              value={form.q5[n-1]}
              onChange={e=>{const q5=[...form.q5];q5[n-1]=e.target.value;setForm(f=>({...f,q5}));}}/>
          </div>
        ))}
      </div>
      <div className="card">
        <QHead n={6} title="업무 중 가장 많은 시간을 빼앗기는 상황을 자유롭게 설명해 주세요."
          hint="예: 같은 안내 문구를 환자마다 반복 입력, 보고서 양식을 매번 다르게 변환 등"/>
        <textarea rows={4} placeholder="자유롭게 작성해 주세요..."
          value={form.q6} onChange={e=>setForm(f=>({...f,q6:e.target.value}))}/>
      </div>
    </div>
  );
}

function Step3({ form, setForm, toggleCheck }) {
  return (
    <div>
      <h2 style={{fontSize:20,fontWeight:800,color:'#1B3A6B',marginBottom:4}}>AI에게 바라는 것</h2>
      <p style={{color:'#5A6B82',fontSize:13,marginBottom:24}}>꿈의 AI 동료를 상상해서 답해 주세요.</p>
      <div className="card">
        <QHead n={7} title="AI가 내 업무를 도와준다면, 어떤 역할을 해줬으면 하나요?" hint="복수 선택 가능"/>
        {WISHES.map(w=>(
          <CB key={w} label={w} checked={form.q7.includes(w)} onChange={()=>toggleCheck('q7',w)}/>
        ))}
        {form.q7.includes('기타')&&(
          <input type="text" placeholder="직접 입력해 주세요" value={form.q7other}
            onChange={e=>setForm(f=>({...f,q7other:e.target.value}))} style={{marginTop:8}}/>
        )}
      </div>
      <div className="card">
        <QHead n={8} title="AI 도입 시 가장 걱정되는 점은 무엇인가요?" hint="복수 선택 가능"/>
        {CONCERNS.map(c=>(
          <CB key={c} label={c} checked={form.q8.includes(c)} onChange={()=>toggleCheck('q8',c)}/>
        ))}
        {form.q8.includes('기타')&&(
          <input type="text" placeholder="직접 입력해 주세요" value={form.q8other}
            onChange={e=>setForm(f=>({...f,q8other:e.target.value}))} style={{marginTop:8}}/>
        )}
      </div>
    </div>
  );
}

function Step4({ form, setForm }) {
  const opts = {
    q10time:['업무 시간 중','점심시간','퇴근 후','주말'],
    q10format:['집합 교육','온라인 강의','1:1 코칭','자율학습 자료'],
    q10duration:['30분 이내','1시간','2시간','반나절'],
    q10freq:['1회성','주 1회','월 1~2회','집중 단기'],
  };
  return (
    <div>
      <h2 style={{fontSize:20,fontWeight:800,color:'#1B3A6B',marginBottom:4}}>교육 수요 파악</h2>
      <p style={{color:'#5A6B82',fontSize:13,marginBottom:24}}>AI 교육 과정 설계에 활용됩니다.</p>
      <div className="card">
        <QHead n={9} title="AI 교육을 받는다면 어떤 수준이 필요하신가요?"/>
        {EDU.map(e=>(
          <RB key={e} label={e} selected={form.q9===e} onChange={()=>setForm(f=>({...f,q9:e}))}/>
        ))}
      </div>
      <div className="card">
        <QHead n={10} title="교육 방식 선호도를 알려 주세요."/>
        {[
          {label:'선호 교육 시간',field:'q10time'},
          {label:'선호 교육 방식',field:'q10format'},
          {label:'1회 적정 시간',field:'q10duration'},
          {label:'교육 희망 횟수',field:'q10freq'},
        ].map(({label,field})=>(
          <div key={field} style={{marginBottom:18}}>
            <div style={{fontSize:13,fontWeight:600,color:'#1B3A6B',marginBottom:8}}>{label}</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:7}}>
              {opts[field].map(o=>(
                <button key={o} className={`pill-btn${form[field]===o?' on':''}`}
                  onClick={()=>setForm(f=>({...f,[field]:o}))}>{o}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Step5({ form, setForm }) {
  return (
    <div>
      <h2 style={{fontSize:20,fontWeight:800,color:'#1B3A6B',marginBottom:4}}>자유 의견</h2>
      <p style={{color:'#5A6B82',fontSize:13,marginBottom:24}}>마지막 단계입니다. 어떤 내용이든 편하게 적어 주세요.</p>
      <div className="card">
        <QHead n={11} title="AI 도입과 관련해 건의 사항이나 아이디어가 있다면 자유롭게 적어 주세요."
          hint="아이디어 · 건의 · 우려 모두 환영합니다"/>
        <textarea rows={7}
          placeholder="예: 수술 전 환자 설명을 QR 코드로 연결하면 좋겠다, 간호 기록을 음성으로 입력하면 편할 것 같다..."
          value={form.q11} onChange={e=>setForm(f=>({...f,q11:e.target.value}))}/>
      </div>
      <div style={{background:'#EEF3FA',borderRadius:14,padding:18,
        border:'1px solid #C8D8EE',display:'flex',gap:14,alignItems:'flex-start'}}>
        <span style={{fontSize:22,flexShrink:0}}>🔒</span>
        <div>
          <div style={{fontWeight:700,fontSize:14,color:'#1B3A6B',marginBottom:4}}>개인정보 안내</div>
          <div style={{fontSize:13,color:'#5A6B82',lineHeight:1.7}}>
            작성하신 내용은 에이스병원 AI 도입 전략 수립에만 활용되며 외부에 공개되지 않습니다.
          </div>
        </div>
      </div>
    </div>
  );
}

function ThanksView({ onNew }) {
  return (
    <div style={{minHeight:'100vh',background:'#0A1628',
      display:'flex',alignItems:'center',justifyContent:'center',padding:24}}>
      <GlobalStyle/>
      <div className="si" style={{background:'rgba(255,255,255,.06)',
        border:'1px solid rgba(201,168,76,.28)',borderRadius:26,padding:'52px 44px',
        textAlign:'center',maxWidth:460,width:'100%',backdropFilter:'blur(18px)'}}>
        <div style={{width:64,height:64,borderRadius:'50%',background:'#C9A84C',
          display:'flex',alignItems:'center',justifyContent:'center',
          margin:'0 auto 24px',fontSize:28}}>✓</div>
        <h2 style={{color:'white',fontSize:22,fontWeight:800,marginBottom:12}}>
          제출이 완료됐습니다!
        </h2>
        <p style={{color:'rgba(255,255,255,.6)',fontSize:14,lineHeight:1.9,marginBottom:14}}>
          소중한 의견을 작성해 주셔서 감사합니다.<br/>
          응답 내용을 바탕으로<br/>
          <strong style={{color:'#C9A84C'}}>에이스병원 맞춤 AI 전략</strong>을 수립하겠습니다.
        </p>
        <div style={{background:'rgba(201,168,76,.1)',borderRadius:12,padding:'14px 18px',
          marginBottom:28,border:'1px solid rgba(201,168,76,.22)'}}>
          <p style={{color:'#C9A84C',fontSize:13,fontWeight:600}}>에이스병원 AI 도입 프로젝트</p>
          <p style={{color:'rgba(255,255,255,.4)',fontSize:12,marginTop:3}}>AI 컨설팅 파트너 · SIMPLIT</p>
        </div>
        <button className="btn-ghost" onClick={onNew}
          style={{color:'rgba(255,255,255,.35)',borderColor:'rgba(255,255,255,.1)'}}>
          다른 분이 작성하기
        </button>
      </div>
    </div>
  );
}

function AdminLoginView({ pwd, setPwd, onLogin, error, onBack }) {
  return (
    <div style={{minHeight:'100vh',background:'#0A1628',
      display:'flex',alignItems:'center',justifyContent:'center',padding:24}}>
      <GlobalStyle/>
      <div style={{background:'rgba(255,255,255,.06)',borderRadius:22,padding:38,
        border:'1px solid rgba(255,255,255,.09)',backdropFilter:'blur(18px)',
        width:'100%',maxWidth:340,textAlign:'center'}}>
        <div style={{fontSize:32,marginBottom:12}}>🔑</div>
        <h3 style={{color:'white',fontSize:17,fontWeight:700,marginBottom:5}}>관리자 로그인</h3>
        <p style={{color:'rgba(255,255,255,.3)',fontSize:12,marginBottom:20}}>SIMPLIT 관리자 전용</p>
        <input type="password" placeholder="관리자 비밀번호" value={pwd}
          onChange={e=>setPwd(e.target.value)} onKeyDown={e=>e.key==='Enter'&&onLogin()}
          style={{background:'rgba(255,255,255,.08)',border:'1px solid rgba(255,255,255,.14)',
            color:'white',marginBottom:10}}/>
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

function BarChart({ data, total }) {
  const max = Math.max(...data.map(d=>d.count),1);
  return (
    <div>
      {data.slice(0,8).map(({label,count})=>(
        <div key={label} style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
          <span style={{fontSize:12,color:'rgba(255,255,255,.6)',
            minWidth:150,maxWidth:150,lineHeight:1.3,flexShrink:0}}>{label}</span>
          <div style={{flex:1,height:7,background:'rgba(255,255,255,.1)',borderRadius:4,overflow:'hidden'}}>
            <div style={{height:'100%',background:'#C9A84C',borderRadius:4,
              width:`${(count/max)*100}%`,transition:'width 1s ease'}}/>
          </div>
          <span style={{fontSize:13,fontWeight:700,color:'#C9A84C',minWidth:20}}>{count}</span>
          <span style={{fontSize:11,color:'rgba(255,255,255,.3)',minWidth:30}}>
            {total>0?Math.round(count/total*100):0}%
          </span>
        </div>
      ))}
    </div>
  );
}

function AdminView({ responses, onBack, onRefresh, aiAnalysis, isAnalyzing, onAnalyze, countChoices, countSingle }) {
  const [tab, setTab] = useState('overview');
  const [expanded, setExpanded] = useState(null);
  const total = responses.length;
  const deptC  = countSingle('dept');
  const toolC  = countChoices('q1', TOOLS);
  const levelC = countSingle('q3');
  const wishC  = countChoices('q7', WISHES);
  const concC  = countChoices('q8', CONCERNS);
  const eduC   = countSingle('q9');

  return (
    <div style={{minHeight:'100vh',background:'#0A1628'}}>
      <GlobalStyle/>
      <div style={{background:'rgba(255,255,255,.04)',borderBottom:'1px solid rgba(255,255,255,.07)',
        padding:'14px 24px',position:'sticky',top:0,zIndex:100,backdropFilter:'blur(18px)'}}>
        <div style={{maxWidth:1060,margin:'0 auto',display:'flex',
          alignItems:'center',justifyContent:'space-between'}}>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <div style={{width:26,height:26,borderRadius:6,
              background:'linear-gradient(135deg,#C9A84C,#F0D98A)',
              display:'flex',alignItems:'center',justifyContent:'center'}}>
              <span style={{color:'#1B3A6B',fontWeight:900,fontSize:11}}>A</span>
            </div>
            <span style={{color:'white',fontWeight:800,fontSize:14}}>에이스병원</span>
            <span style={{color:'rgba(255,255,255,.25)',fontSize:11}}>AI 설문 관리자</span>
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
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:24}}>
          {[
            {icon:'📋',label:'총 응답',val:`${total}명`,sub:'수집된 설문'},
            {icon:'🏢',label:'참여 부서',val:`${deptC.length}개`,sub:'응답 완료'},
            {icon:'✨',label:'AI 1순위 희망',val:(wishC[0]?.label||'-').slice(0,8),sub:`${wishC[0]?.count||0}명`},
            {icon:'⚠️',label:'1순위 우려',val:(concC[0]?.label||'-').slice(0,8),sub:`${concC[0]?.count||0}명`},
          ].map((c,i)=>(
            <div key={i} style={{background:'rgba(255,255,255,.05)',borderRadius:16,padding:18,
              border:'1px solid rgba(255,255,255,.07)'}}>
              <div style={{fontSize:22,marginBottom:7}}>{c.icon}</div>
              <div style={{color:'#C9A84C',fontSize:20,fontWeight:800,marginBottom:3}}>{c.val}</div>
              <div style={{color:'rgba(255,255,255,.7)',fontSize:12,fontWeight:600}}>{c.label}</div>
              <div style={{color:'rgba(255,255,255,.28)',fontSize:11,marginTop:2}}>{c.sub}</div>
            </div>
          ))}
        </div>
        <div style={{display:'flex',gap:3,marginBottom:20,background:'rgba(255,255,255,.04)',
          padding:4,borderRadius:12,width:'fit-content'}}>
          {[['overview','📊 개요'],['details','📋 상세 응답'],['ai','🤖 AI 분석']].map(([t,l])=>(
            <button key={t} onClick={()=>setTab(t)} style={{padding:'7px 16px',borderRadius:8,
              border:'none',cursor:'pointer',
              background:tab===t?'#C9A84C':'transparent',
              color:tab===t?'#1B3A6B':'rgba(255,255,255,.45)',
              fontFamily:"'Noto Sans KR',sans-serif",
              fontWeight:tab===t?700:400,fontSize:13}}>{l}</button>
          ))}
        </div>
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
                <h3 style={{color:'white',fontSize:13,fontWeight:700,marginBottom:16}}>{title}</h3>
                {total===0
                  ?<p style={{color:'rgba(255,255,255,.25)',fontSize:13}}>아직 응답이 없습니다.</p>
                  :<BarChart data={data} total={total}/>
                }
              </div>
            ))}
          </div>
        )}
        {tab==='details'&&(
          <div>
            {total===0
              ?<div style={{textAlign:'center',padding:'56px 20px',
                color:'rgba(255,255,255,.25)',fontSize:14,lineHeight:2}}>
                아직 응답이 없습니다.
              </div>
              :responses.map((r,i)=>(
                <div key={r.id} className="card-dark" style={{cursor:'pointer'}}
                  onClick={()=>setExpanded(expanded===i?null:i)}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <span style={{background:'#C9A84C',color:'#1B3A6B',fontWeight:700,
                        fontSize:11,padding:'3px 10px',borderRadius:20}}>
                        {r.dept||'미기재'}
                      </span>
                      <span style={{color:'white',fontSize:14,fontWeight:600}}>{r.name||'익명'}</span>
                      {r.position&&(
                        <span style={{color:'rgba(255,255,255,.35)',fontSize:12}}>· {r.position}</span>
                      )}
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <span style={{color:'rgba(255,255,255,.25)',fontSize:11}}>{r.submittedAt}</span>
                      <span style={{color:'#C9A84C',fontSize:13}}>{expanded===i?'▲':'▼'}</span>
                    </div>
                  </div>
                  {expanded===i&&(
                    <div style={{marginTop:16,paddingTop:16,borderTop:'1px solid rgba(255,255,255,.08)'}}>
                      {[
                        {l:'소속 부서',v:r.dept||'-'},
                        {l:'성명',v:r.name||'-'},
                        {l:'직책',v:r.position||'-'},
                        {l:'이메일',v:r.email||'-'},
                        {l:'AI 도구',v:r.q1?.join(', ')||'-'},
                        {l:'활용 용도',v:r.q2?.join(', ')||'-'},
                        {l:'AI 수준',v:r.q3||'-'},
                        {l:'TOP3 자동화',v:r.q5?.filter(Boolean).join(' | ')||'-'},
                        {l:'시간 빼앗는 업무',v:r.q6||'-'},
                        {l:'AI에 바라는 것',v:r.q7?.join(', ')||'-'},
                        {l:'우려사항',v:r.q8?.join(', ')||'-'},
                        {l:'교육 수준',v:r.q9||'-'},
                        {l:'자유 의견',v:r.q11||'-'},
                      ].map(({l,v})=>(
                        <div key={l} style={{display:'flex',gap:12,marginBottom:8,fontSize:13}}>
                          <span style={{color:'#C9A84C',fontWeight:700,minWidth:130,flexShrink:0}}>{l}</span>
                          <span style={{color:'rgba(255,255,255,.7)',lineHeight:1.6}}>{v}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            }
          </div>
        )}
        {tab==='ai'&&(
          <div>
            <div className="card-dark">
              <h3 style={{color:'white',fontSize:15,fontWeight:700,marginBottom:8}}>
                🤖 Claude AI 자동 분석
              </h3>
              <p style={{color:'rgba(255,255,255,.45)',fontSize:13,marginBottom:20,lineHeight:1.7}}>
                수집된 {total}개 응답을 Claude AI가 분석하여<br/>
                부서별 Pain Point, 도입 우선순위, 교육 수요를 자동으로 정리합니다.
              </p>
              <button className="btn-gold" onClick={onAnalyze}
                disabled={total===0||isAnalyzing}
                style={{animation:isAnalyzing?'pulse 1.4s infinite':'none'}}>
                {isAnalyzing
                  ?<span style={{display:'flex',alignItems:'center',gap:8}}>
                    <span style={{width:16,height:16,border:'2px solid rgba(27,58,107,.3)',
                      borderTop:'2px solid #1B3A6B',borderRadius:'50%',
                      animation:'spin .8s linear infinite',display:'inline-block'}}/>
                    분석 중...
                  </span>
                  :`${total}개 응답 AI 분석 시작`
                }
              </button>
            </div>
            {aiAnalysis&&(
              <div style={{background:'rgba(201,168,76,.07)',borderRadius:18,padding:26,
                border:'1px solid rgba(201,168,76,.2)'}}>
                <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:18,
                  paddingBottom:14,borderBottom:'1px solid rgba(201,168,76,.18)'}}>
                  <span style={{fontSize:18}}>✨</span>
                  <span style={{color:'#C9A84C',fontWeight:700,fontSize:14}}>AI 분석 결과</span>
                </div>
                <div style={{color:'rgba(255,255,255,.8)',fontSize:14,
                  lineHeight:1.9,whiteSpace:'pre-wrap'}}>{aiAnalysis}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

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
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/responses?select=*&order=created_at.desc`,
        { headers:{ 'apikey':SUPABASE_KEY,'Authorization':`Bearer ${SUPABASE_KEY}` } }
      );
      const rows = await res.json();
      setAllResp(rows.map(r=>({id:r.id,...r.data})));
    } catch { setAllResp([]); }
  }

  async function submit() {
    const entry = { submittedAt: new Date().toLocaleString('ko-KR'), ...form };
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/responses`, {
        method:'POST',
        headers:{
          'Content-Type':'application/json',
          'apikey':SUPABASE_KEY,
          'Authorization':`Bearer ${SUPABASE_KEY}`,
          'Prefer':'return=minimal'
        },
        body: JSON.stringify({ data: entry })
      });
      if(!res.ok) throw new Error('저장 실패');
      setView('thanks');
    } catch {
      alert('제출 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    }
  }

  function toggleCheck(field, val) {
    setForm(f=>({
      ...f,
      [field]: f[field].includes(val) ? f[field].filter(x=>x!==val) : [...f[field],val]
    }));
  }

  function handleAdminLogin() {
    if(adminPwd==='SIMPLIT2026'){ setAdminErr(''); setView('admin'); }
    else setAdminErr('비밀번호가 올바르지 않습니다.');
  }

  async function runAI() {
    if(!allResp.length) return;
    setIsAnal(true); setAiAnal('');
    const summary = allResp.map((r,i)=>
      `[응답${i+1}] 부서:${r.dept} | 직책:${r.position} | AI수준:${r.q3} | 자동화희망:${r.q7?.join(',')} | 우려:${r.q8?.join(',')} | TOP3:${r.q5?.filter(Boolean).join('/')} | 교육:${r.q9} | 의견:${r.q11}`
    ).join('\n');
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          model:'claude-sonnet-4-20250514',
          max_tokens:1000,
          messages:[{role:'user',content:
            `에이스병원 AI 도입 설문 응답 분석. 한국어로 답변:\n\n1️⃣ 부서별 핵심 Pain Point\n2️⃣ AI 즉시 도입 권장 TOP 3 (이유 포함)\n3️⃣ 가장 많이 요청된 AI 기능 순위\n4️⃣ 교육 방향 제안\n5️⃣ 한 줄 총평\n\n응답 데이터:\n${summary}`
          }]
        })
      });
      const data = await res.json();
      setAiAnal(data.content?.[0]?.text||'분석 실패');
    } catch(e) { setAiAnal('분석 중 오류: '+e.message); }
    setIsAnal(false);
  }

  function countChoices(field, choices) {
    return choices.map(c=>({
      label:c,
      count:allResp.filter(r=>r[field]?.includes(c)).length
    })).sort((a,b)=>b.count-a.count);
  }
  function countSingle(field) {
    const m={};
    allResp.forEach(r=>{ if(r[field]) m[r[field]]=(m[r[field]]||0)+1; });
    return Object.entries(m).map(([k,v])=>({label:k,count:v})).sort((a,b)=>b.count-a.count);
  }

  function FormView() {
    return (
      <div style={{minHeight:'100vh',background:'#F7FAFD'}}>
        <GlobalStyle/>
        <FormTopBar step={step} total={TOTAL}/>
        <div style={{maxWidth:720,margin:'0 auto',padding:'28px 18px 100px'}}>
          <div className="si">
            {step===1&&<Step1 form={form} setForm={setForm} toggleCheck={toggleCheck}/>}
            {step===2&&<Step2 form={form} setForm={setForm}/>}
            {step===3&&<Step3 form={form} setForm={setForm} toggleCheck={toggleCheck}/>}
            {step===4&&<Step4 form={form} setForm={setForm}/>}
            {step===5&&<Step5 form={form} setForm={setForm}/>}
          </div>
        </div>
        <div style={{position:'fixed',bottom:0,left:0,right:0,background:'white',
          borderTop:'1px solid #C8D8EE',padding:'14px 20px',zIndex:100,
          boxShadow:'0 -4px 18px rgba(27,58,107,.07)'}}>
          <div style={{maxWidth:720,margin:'0 auto',
            display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            {step>1
              ?<button className="btn-ghost" onClick={()=>setStep(s=>s-1)}>← 이전</button>
              :<div/>
            }
            <button className="btn-navy" onClick={()=>step<TOTAL?setStep(s=>s+1):submit()}>
              {step===TOTAL?'✅ 제출하기':'다음 →'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if(view==='landing')    return <LandingView onStart={()=>{setStep(1);setView('form');}} onAdmin={()=>setView('adminLogin')}/>;
  if(view==='form')       return <FormView/>;
  if(view==='thanks')     return <ThanksView onNew={()=>{setForm(emptyForm());setStep(1);setView('landing');}}/>;
  if(view==='adminLogin') return <AdminLoginView pwd={adminPwd} setPwd={setAdminPwd}
                                    onLogin={handleAdminLogin} error={adminErr}
                                    onBack={()=>setView('landing')}/>;
  if(view==='admin')      return <AdminView responses={allResp}
                                    onBack={()=>{setView('landing');setAiAnal('');}}
                                    onRefresh={loadResp} aiAnalysis={aiAnal}
                                    isAnalyzing={isAnal} onAnalyze={runAI}
                                    countChoices={countChoices} countSingle={countSingle}/>;
}
