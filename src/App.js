import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyACnrLTaXqXQaQgC4M16MyTr2X60aFjktY",
  authDomain: "crohns-tracker-5d907.firebaseapp.com",
  projectId: "crohns-tracker-5d907",
  storageBucket: "crohns-tracker-5d907.firebasestorage.app",
  messagingSenderId: "657431609369",
  appId: "1:657431609369:web:9c85079d631beefe546a88",
  databaseURL: "https://crohns-tracker-5d907-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const PASSWORD = "Sergey2013";

const LANGS = {
  en: {
    appTitle: "Crohn's Care Tracker", appSub: "Health monitoring · Taiwan",
    tabs: ["Dashboard","Treatments","Appointments","Medications","Growth","Symptoms","Notes"],
    nextInfusion:"Next Infusion", latestGrowth:"Latest Growth",
    upcoming:"Upcoming", done:"Done", cancelled:"Cancelled",
    addTreatment:"+ Add Treatment", addAppointment:"+ Add Appointment",
    addMedication:"+ Add Medication", addMeasurement:"+ Add Measurement",
    addSymptom:"+ Add Symptom Log", addNote:"+ Add Note",
    save:"Save", cancel:"Cancel",
    date:"Date", drug:"Drug", dose:"Dose", status:"Status", cost:"Cost (USD)", notes2:"Notes",
    type:"Type", time:"Time", prep:"Prep Required", medication:"Medication", frequency:"Frequency",
    weight:"Weight (kg)", height:"Height (cm)", bmi:"BMI", occasion:"Occasion",
    pain:"Pain (1-10)", stool:"Stool Freq.", blood:"Blood in Stool",
    fatigue:"Fatigue (1-10)", fever:"Fever (°C)", fistula:"Fistula Status",
    category:"Category", title:"Title", content:"Content",
    daysUntil:"In", daysAgo:"days ago", today:"Today", days:"days",
    keyMilestones:"Key Milestones", dietReminder:"Diet Reminder",
    dietText:"March 1, 2 & 3 — Strict diet required before colonoscopy on March 3rd.",
    withoutCard:"Without Catastrophic Card", withCard:"With Card",
    growthChart:"Growth Chart", weightLabel:"Weight", heightLabel:"Height",
    noData:"No data yet", catastrophicCard:"Catastrophic Illness Card",
    infusionCount:"Infusions completed", treatments:"Treatments",
    appointments:"Appointments", medications:"Medications",
    growth:"Growth", symptoms:"Symptoms", notes:"Notes",
    password:"Enter Password", passwordPlaceholder:"Password", unlock:"Unlock",
    wrongPassword:"Wrong password, try again!", syncing:"Syncing...", synced:"Synced ✓",
  },
  ru: {
    appTitle:"Трекер здоровья Крона", appSub:"Мониторинг здоровья · Тайвань",
    tabs:["Главная","Лечение","Визиты","Лекарства","Рост","Симптомы","Заметки"],
    nextInfusion:"След. Инфузия", latestGrowth:"Последние данные",
    upcoming:"Предстоит", done:"Выполнено", cancelled:"Отменено",
    addTreatment:"+ Добавить лечение", addAppointment:"+ Добавить визит",
    addMedication:"+ Добавить лекарство", addMeasurement:"+ Добавить измерение",
    addSymptom:"+ Добавить симптомы", addNote:"+ Добавить заметку",
    save:"Сохранить", cancel:"Отмена",
    date:"Дата", drug:"Препарат", dose:"Доза", status:"Статус", cost:"Стоимость (USD)", notes2:"Заметки",
    type:"Тип", time:"Время", prep:"Подготовка", medication:"Лекарство", frequency:"Частота",
    weight:"Вес (кг)", height:"Рост (см)", bmi:"ИМТ", occasion:"Повод",
    pain:"Боль (1-10)", stool:"Частота стула", blood:"Кровь в стуле",
    fatigue:"Усталость (1-10)", fever:"Температура (°C)", fistula:"Состояние свища",
    category:"Категория", title:"Заголовок", content:"Содержание",
    daysUntil:"Через", daysAgo:"дней назад", today:"Сегодня", days:"дней",
    keyMilestones:"Ключевые события", dietReminder:"Напоминание о диете",
    dietText:"1, 2 и 3 марта — строгая диета перед колоноскопией 3 марта.",
    withoutCard:"Без карты", withCard:"С картой",
    growthChart:"График роста", weightLabel:"Вес", heightLabel:"Рост",
    noData:"Данных пока нет", catastrophicCard:"Карта катастрофических заболеваний",
    infusionCount:"Завершено инфузий", treatments:"Лечение",
    appointments:"Визиты", medications:"Лекарства",
    growth:"Рост", symptoms:"Симптомы", notes:"Заметки",
    password:"Введите пароль", passwordPlaceholder:"Пароль", unlock:"Войти",
    wrongPassword:"Неверный пароль!", syncing:"Синхронизация...", synced:"Синхронизировано ✓",
  },
  zh: {
    appTitle:"克隆氏症健康追蹤器", appSub:"健康監控 · 台灣",
    tabs:["儀表板","治療","預約","藥物","生長","症狀","筆記"],
    nextInfusion:"下次輸注", latestGrowth:"最新數據",
    upcoming:"即將到來", done:"已完成", cancelled:"已取消",
    addTreatment:"+ 新增治療", addAppointment:"+ 新增預約",
    addMedication:"+ 新增藥物", addMeasurement:"+ 新增測量",
    addSymptom:"+ 新增症狀記錄", addNote:"+ 新增筆記",
    save:"儲存", cancel:"取消",
    date:"日期", drug:"藥物", dose:"劑量", status:"狀態", cost:"費用 (USD)", notes2:"備註",
    type:"類型", time:"時間", prep:"準備事項", medication:"藥物", frequency:"頻率",
    weight:"體重 (公斤)", height:"身高 (公分)", bmi:"BMI", occasion:"場合",
    pain:"疼痛 (1-10)", stool:"排便頻率", blood:"糞便出血",
    fatigue:"疲勞 (1-10)", fever:"發燒 (°C)", fistula:"瘻管狀態",
    category:"類別", title:"標題", content:"內容",
    daysUntil:"還有", daysAgo:"天前", today:"今天", days:"天",
    keyMilestones:"重要里程碑", dietReminder:"飲食提醒",
    dietText:"3月1、2、3日 — 3月3日大腸鏡檢查前需嚴格飲食控制。",
    withoutCard:"無重大傷病卡", withCard:"持卡後",
    growthChart:"生長圖表", weightLabel:"體重", heightLabel:"身高",
    noData:"尚無資料", catastrophicCard:"重大傷病卡",
    infusionCount:"已完成輸注", treatments:"治療",
    appointments:"預約", medications:"藥物",
    growth:"生長", symptoms:"症狀", notes:"筆記",
    password:"請輸入密碼", passwordPlaceholder:"密碼", unlock:"登入",
    wrongPassword:"密碼錯誤！", syncing:"同步中...", synced:"已同步 ✓",
  }
};

const INIT = {
  treatments: [
    {id:1,date:"2025-09-01",drug:"Infliximab",dose:"5mg/kg",status:"done",cost:"",notes:"1st infusion"},
    {id:2,date:"2025-09-15",drug:"Infliximab",dose:"5mg/kg",status:"done",cost:"",notes:"2nd infusion"},
    {id:3,date:"2025-10-01",drug:"Infliximab",dose:"5mg/kg",status:"done",cost:"",notes:"3rd infusion"},
    {id:4,date:"2025-11-01",drug:"Infliximab",dose:"5mg/kg",status:"done",cost:"",notes:"4th infusion"},
    {id:5,date:"2025-12-01",drug:"Infliximab",dose:"5mg/kg",status:"done",cost:"",notes:"5th infusion"},
    {id:6,date:"2026-01-01",drug:"Infliximab",dose:"5mg/kg",status:"done",cost:"",notes:"6th infusion"},
    {id:7,date:"2026-03-27",drug:"Infliximab",dose:"5mg/kg",status:"upcoming",cost:"~1000 / ~30 with card",notes:"7th infusion — Catastrophic Card pending"},
  ],
  appointments: [
    {id:1,date:"2026-03-02",time:"Morning",type:"Hospital Admission (overnight)",status:"upcoming",prep:"Diet prep Mar 1-3",notes:"Overnight stay before colonoscopy"},
    {id:2,date:"2026-03-03",time:"Morning",type:"Colonoscopy + MRI + Biopsy",status:"upcoming",prep:"Strict diet Mar 1-3",notes:"Biopsy taken. Results ~1 week."},
    {id:3,date:"2026-03-13",time:"TBD",type:"Doctor Appointment — Results",status:"upcoming",prep:"",notes:"Review results. Apply for Catastrophic Illness Card."},
    {id:4,date:"2026-03-27",time:"TBD",type:"7th Infliximab Infusion",status:"upcoming",prep:"",notes:"~$1000 without card / ~$30 with card"},
    {id:5,date:"2026-04-13",time:"TBD",type:"Catastrophic Card Expected",status:"upcoming",prep:"",notes:"~1 month after application"},
  ],
  medications: [
    {id:1,name:"Infliximab (Remicade)",type:"Biologic",dose:"5mg/kg IV",frequency:"Every 6-8 weeks",active:true,notes:"Main biologic therapy for Crohn's"},
  ],
  growth: [
    {id:1,date:"2025-08-01",weight:35,height:140,occasion:"Arrival in Taiwan",notes:""},
  ],
  symptoms: [],
  notes: [
    {id:1,date:"2026-02-23",category:"insurance",title:"NHI Health Insurance Activated",content:"National Health Insurance started Feb 23, 2026 — after 6 months waiting period."},
  ],
};

const TODAY = new Date().toISOString().split("T")[0];
const gradients = [
  "linear-gradient(135deg,#667eea,#764ba2)",
  "linear-gradient(135deg,#3b82f6,#1d4ed8)",
  "linear-gradient(135deg,#8b5cf6,#6d28d9)",
  "linear-gradient(135deg,#10b981,#065f46)",
  "linear-gradient(135deg,#f59e0b,#b45309)",
  "linear-gradient(135deg,#ef4444,#b91c1c)",
  "linear-gradient(135deg,#64748b,#334155)",
];

function safeArr(v) { return Array.isArray(v) ? v : []; }

function daysUntil(dateStr, t) {
  try {
    const d = (dateStr||"").replace("~","").trim();
    const diff = Math.ceil((new Date(d) - new Date(TODAY)) / 86400000);
    if (isNaN(diff)) return "";
    if (diff === 0) return t.today;
    if (diff < 0) return `${Math.abs(diff)} ${t.daysAgo}`;
    return `${t.daysUntil} ${diff} ${t.days}`;
  } catch { return ""; }
}

function Badge({ status, t }) {
  const cfg = { done:["#10b981","#d1fae5"], upcoming:["#3b82f6","#dbeafe"], cancelled:["#ef4444","#fee2e2"] };
  const [c, bg] = cfg[status] || ["#6b7280","#f3f4f6"];
  return <span style={{background:bg,color:c,borderRadius:20,padding:"3px 12px",fontSize:11,fontWeight:700}}>{t[status]||status}</span>;
}

function Card({ children, style={} }) {
  return <div style={{background:"#fff",borderRadius:20,padding:20,boxShadow:"0 4px 20px rgba(0,0,0,0.06)",marginBottom:16,...style}}>{children}</div>;
}

function Btn({ children, onClick, color="#3b82f6", style={} }) {
  return <button onClick={onClick} style={{background:color,color:"#fff",border:"none",borderRadius:10,padding:"9px 18px",cursor:"pointer",fontWeight:700,fontSize:13,...style}}>{children}</button>;
}

function Input({ placeholder, value, onChange, type="text" }) {
  return <input type={type} placeholder={placeholder} value={value||""} onChange={e=>onChange(e.target.value)}
    style={{width:"100%",padding:"9px 12px",border:"1.5px solid #e2e8f0",borderRadius:10,fontSize:14,marginBottom:8,boxSizing:"border-box"}}/>;
}

function Sel({ value, onChange, options }) {
  return <select value={value||""} onChange={e=>onChange(e.target.value)}
    style={{width:"100%",padding:"9px 12px",border:"1.5px solid #e2e8f0",borderRadius:10,fontSize:14,marginBottom:8,boxSizing:"border-box"}}>
    {options.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
  </select>;
}

function GrowthChart({ data, t }) {
  const arr = safeArr(data).filter(d=>d.weight&&d.height);
  if (arr.length < 2) return <div style={{color:"#94a3b8",fontSize:13,textAlign:"center",padding:20}}>{t.noData} (need 2+ entries)</div>;
  const sorted = [...arr].sort((a,b)=>(a.date||"").localeCompare(b.date||""));
  const weights = sorted.map(d=>d.weight);
  const heights = sorted.map(d=>d.height);
  const minW=Math.min(...weights)-2, maxW=Math.max(...weights)+2;
  const minH=Math.min(...heights)-2, maxH=Math.max(...heights)+2;
  const W=300,H=120,P=30;
  const xS=i=>P+(i/(sorted.length-1))*(W-P*2);
  const yW=v=>H-P-((v-minW)/(maxW-minW))*(H-P*2);
  const yH=v=>H-P-((v-minH)/(maxH-minH))*(H-P*2);
  const wPath=sorted.map((d,i)=>`${i===0?"M":"L"}${xS(i)},${yW(d.weight)}`).join(" ");
  const hPath=sorted.map((d,i)=>`${i===0?"M":"L"}${xS(i)},${yH(d.height)}`).join(" ");
  return (
    <svg width={W} height={H} style={{display:"block",margin:"0 auto"}}>
      <path d={wPath} fill="none" stroke="#3b82f6" strokeWidth={2.5} strokeLinecap="round"/>
      <path d={hPath} fill="none" stroke="#10b981" strokeWidth={2.5} strokeLinecap="round"/>
      {sorted.map((d,i)=>(
        <g key={i}>
          <circle cx={xS(i)} cy={yW(d.weight)} r={4} fill="#3b82f6"/>
          <circle cx={xS(i)} cy={yH(d.height)} r={4} fill="#10b981"/>
          <text x={xS(i)} y={H-4} textAnchor="middle" fontSize={9} fill="#94a3b8">{(d.date||"").slice(5)}</text>
        </g>
      ))}
      <text x={8} y={16} fontSize={10} fill="#3b82f6">● {t.weightLabel}</text>
      <text x={8} y={28} fontSize={10} fill="#10b981">● {t.heightLabel}</text>
    </svg>
  );
}

function PasswordScreen({ t, onUnlock }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  function tryUnlock() {
    if (pw === PASSWORD) { onUnlock(); }
    else { setErr(true); setPw(""); setTimeout(()=>setErr(false),2000); }
  }
  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#667eea,#764ba2)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:"#fff",borderRadius:24,padding:40,maxWidth:340,width:"100%",textAlign:"center",boxShadow:"0 20px 60px rgba(0,0,0,0.2)"}}>
        <div style={{fontSize:48,marginBottom:16}}>🏥</div>
        <div style={{fontSize:22,fontWeight:800,color:"#1e293b",marginBottom:4}}>{t.appTitle}</div>
        <div style={{fontSize:13,color:"#94a3b8",marginBottom:24}}>{t.appSub}</div>
        <input type="password" placeholder={t.passwordPlaceholder} value={pw}
          onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&tryUnlock()}
          style={{width:"100%",padding:"12px 16px",border:`2px solid ${err?"#ef4444":"#e2e8f0"}`,borderRadius:12,fontSize:16,marginBottom:12,boxSizing:"border-box",textAlign:"center"}}/>
        {err && <div style={{color:"#ef4444",fontSize:13,marginBottom:8,fontWeight:600}}>{t.wrongPassword}</div>}
        <button onClick={tryUnlock} style={{width:"100%",background:"linear-gradient(135deg,#667eea,#764ba2)",color:"#fff",border:"none",borderRadius:12,padding:"12px",fontSize:16,fontWeight:700,cursor:"pointer"}}>{t.unlock}</button>
        <div style={{marginTop:20,fontSize:12,color:"#94a3b8"}}>🔒 Private family health tracker</div>
      </div>
    </div>
  );
}

export default function App() {
  const [unlocked, setUnlocked] = useState(()=>sessionStorage.getItem("crohns_auth")==="1");
  const [data, setData] = useState(INIT);
  const [lang, setLang] = useState("en");
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState(null);
  const [fv, setFv] = useState({});
  const [syncStatus, setSyncStatus] = useState("synced");
  const t = LANGS[lang];

  useEffect(()=>{
    if (!unlocked) return;
    const dbRef = ref(db,"crohns/data");
    const unsub = onValue(dbRef,(snapshot)=>{
      const val = snapshot.val();
      if (val) {
        // ensure all arrays exist
        setData({
          treatments: safeArr(val.treatments),
          appointments: safeArr(val.appointments),
          medications: safeArr(val.medications),
          growth: safeArr(val.growth),
          symptoms: safeArr(val.symptoms),
          notes: safeArr(val.notes),
        });
      } else {
        set(dbRef, INIT);
      }
    });
    return ()=>unsub();
  },[unlocked]);

  function saveData(newData) {
    setSyncStatus("syncing");
    setData(newData);
    set(ref(db,"crohns/data"),newData)
      .then(()=>setSyncStatus("synced"))
      .catch(()=>setSyncStatus("synced"));
  }

  function unlock() { sessionStorage.setItem("crohns_auth","1"); setUnlocked(true); }
  function add(type,item) { const nd={...data,[type]:[...safeArr(data[type]),{id:Date.now(),...item}]}; saveData(nd); }
  function remove(type,id) { const nd={...data,[type]:safeArr(data[type]).filter(r=>r.id!==id)}; saveData(nd); }
  function startForm(name,defaults={}) { setForm(name); setFv(defaults); }
  function saveForm(type) { add(type,fv); setForm(null); setFv({}); }
  const inp = k=>({value:fv[k],onChange:v=>setFv(f=>({...f,[k]:v}))});

  if (!unlocked) return <PasswordScreen t={t} onUnlock={unlock}/>;

  const treatments = safeArr(data.treatments);
  const appointments = safeArr(data.appointments);
  const medications = safeArr(data.medications);
  const growth = safeArr(data.growth);
  const symptoms = safeArr(data.symptoms);
  const notes = safeArr(data.notes);

  const nextTr = treatments.filter(x=>x.status==="upcoming"&&x.date>=TODAY).sort((a,b)=>(a.date||"").localeCompare(b.date||""))[0];
  const latestGr = growth.length ? [...growth].sort((a,b)=>(b.date||"").localeCompare(a.date||""))[0] : null;
  const doneCount = treatments.filter(x=>x.status==="done").length;

  const milestones = [
    {done:true,  icon:"✅", text:"NHI Health Insurance activated",      date:"2026-02-23", label:"Feb 23, 2026"},
    {done:false, icon:"🍽️", text:"Strict diet days",                    date:"2026-03-01", label:"Mar 1-3, 2026"},
    {done:false, icon:"🏨", text:"Hospital admission (overnight)",      date:"2026-03-02", label:"Mar 2, 2026"},
    {done:false, icon:"🔬", text:"Colonoscopy + MRI + Biopsy",          date:"2026-03-03", label:"Mar 3, 2026"},
    {done:false, icon:"👨‍⚕️", text:"Doctor appt + apply for card",       date:"2026-03-13", label:"Mar 13, 2026"},
    {done:false, icon:"💉", text:"7th Infliximab infusion",              date:"2026-03-27", label:"Mar 27, 2026"},
    {done:false, icon:"🎉", text:"Catastrophic Card → ~$30/treatment",  date:"2026-04-13", label:"~Apr 13, 2026"},
  ];

  const delBtn=(type,id)=>(
    <button onClick={()=>remove(type,id)} style={{background:"#fee2e2",color:"#ef4444",border:"none",borderRadius:8,padding:"4px 10px",cursor:"pointer",fontSize:12,fontWeight:700,flexShrink:0}}>✕</button>
  );

  return (
    <div style={{fontFamily:"system-ui,sans-serif",background:"#f1f5f9",minHeight:"100vh"}}>
      <div style={{background:gradients[tab],color:"#fff",padding:"16px 16px 0",position:"sticky",top:0,zIndex:100}}>
        <div style={{maxWidth:680,margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:26}}>🏥</span>
              <div>
                <div style={{fontWeight:800,fontSize:17}}>{t.appTitle}</div>
                <div style={{fontSize:11,opacity:0.8}}>{t.appSub}</div>
              </div>
            </div>
            <div style={{display:"flex",gap:4,alignItems:"center"}}>
              <span style={{fontSize:10,opacity:0.8}}>{syncStatus==="syncing"?t.syncing:t.synced}</span>
              {[["EN","en"],["RU","ru"],["中","zh"]].map(([l,k])=>(
                <button key={k} onClick={()=>setLang(k)} style={{background:lang===k?"rgba(255,255,255,0.3)":"rgba(255,255,255,0.1)",color:"#fff",border:"none",borderRadius:8,padding:"4px 8px",cursor:"pointer",fontWeight:700,fontSize:11}}>{l}</button>
              ))}
            </div>
          </div>
          <div style={{display:"flex",gap:2,overflowX:"auto"}}>
            {t.tabs.map((tb,i)=>(
              <button key={i} onClick={()=>setTab(i)} style={{background:tab===i?"rgba(255,255,255,0.25)":"transparent",color:"#fff",border:"none",borderRadius:"8px 8px 0 0",padding:"7px 11px",cursor:"pointer",fontWeight:tab===i?800:500,fontSize:12,whiteSpace:"nowrap",borderBottom:tab===i?"3px solid #fff":"3px solid transparent"}}>{tb}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{maxWidth:680,margin:"0 auto",padding:16}}>

        {tab===0 && <>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:16}}>
            {[
              {label:t.nextInfusion,value:nextTr?daysUntil(nextTr.date,t):"—",sub:nextTr?.date||"",color:"#3b82f6",bg:"#dbeafe",icon:"💉"},
              {label:t.infusionCount,value:doneCount,sub:"Infliximab",color:"#10b981",bg:"#d1fae5",icon:"✅"},
              {label:t.latestGrowth,value:latestGr?`${latestGr.weight}kg`:"—",sub:latestGr?`${latestGr.height}cm`:"",color:"#f59e0b",bg:"#fef3c7",icon:"📈"},
            ].map((s,i)=>(
              <div key={i} style={{background:s.bg,borderRadius:16,padding:14,textAlign:"center"}}>
                <div style={{fontSize:22}}>{s.icon}</div>
                <div style={{fontSize:10,color:s.color,fontWeight:700,marginTop:4}}>{s.label}</div>
                <div style={{fontSize:17,fontWeight:800,color:s.color}}>{s.value}</div>
                <div style={{fontSize:10,color:"#94a3b8"}}>{s.sub}</div>
              </div>
            ))}
          </div>
          <Card>
            <div style={{fontWeight:700,color:"#1e293b",marginBottom:12,fontSize:15}}>📋 {t.keyMilestones}</div>
            {milestones.map((m,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:i<milestones.length-1?"1px solid #f1f5f9":"none"}}>
                <span style={{fontSize:20,minWidth:26}}>{m.icon}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:600,color:m.done?"#10b981":"#1e293b",textDecoration:m.done?"line-through":"none"}}>{m.text}</div>
                  <div style={{fontSize:11,color:"#94a3b8"}}>{m.label}</div>
                </div>
                {!m.done && <span style={{fontSize:11,color:"#6366f1",fontWeight:700,whiteSpace:"nowrap"}}>{daysUntil(m.date,t)}</span>}
              </div>
            ))}
          </Card>
          <Card style={{background:"linear-gradient(135deg,#fef3c7,#fffbeb)"}}>
            <div style={{fontWeight:700,color:"#92400e",marginBottom:6}}>🍽️ {t.dietReminder}</div>
            <div style={{fontSize:13,color:"#78350f"}}>{t.dietText}</div>
          </Card>
          <Card style={{background:"linear-gradient(135deg,#fee2e2,#fff1f2)"}}>
            <div style={{fontWeight:700,color:"#b91c1c",marginBottom:6}}>💳 {t.catastrophicCard}</div>
            <div style={{fontSize:13,color:"#7f1d1d"}}>
              <b>{t.withoutCard}:</b> ~$1,000 USD/treatment<br/>
              <b>{t.withCard}:</b> ~$30 USD/treatment 🎉
            </div>
          </Card>
        </>}

        {tab===1 && <>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{fontWeight:800,fontSize:17}}>💉 {t.treatments}</div>
            <Btn onClick={()=>startForm("treatment",{status:"done",drug:"Infliximab"})} color="#3b82f6">{t.addTreatment}</Btn>
          </div>
          {[...treatments].sort((a,b)=>(a.date||"").localeCompare(b.date||"")).map((tr,i)=>(
            <Card key={tr.id}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
                <div>
                  <div style={{fontWeight:700}}>#{i+1} — {tr.drug}</div>
                  <div style={{fontSize:13,color:"#64748b"}}>{tr.date} · {tr.dose}</div>
                  {tr.cost && <div style={{fontSize:12,color:"#ef4444",fontWeight:600,marginTop:2}}>💰 {tr.cost}</div>}
                  {tr.notes && <div style={{fontSize:13,color:"#64748b",marginTop:4}}>{tr.notes}</div>}
                </div>
                <div style={{display:"flex",gap:6,alignItems:"center"}}><Badge status={tr.status} t={t}/>{delBtn("treatments",tr.id)}</div>
              </div>
            </Card>
          ))}
          {form==="treatment" && <Card style={{border:"2px solid #3b82f6"}}>
            <div style={{fontWeight:700,marginBottom:12}}>New Treatment</div>
            <Input placeholder={t.date+" (YYYY-MM-DD)"} {...inp("date")}/>
            <Input placeholder={t.drug} {...inp("drug")}/>
            <Input placeholder={t.dose} {...inp("dose")}/>
            <Input placeholder={t.cost} {...inp("cost")}/>
            <Input placeholder={t.notes2} {...inp("notes")}/>
            <Sel {...inp("status")} options={[{v:"done",l:t.done},{v:"upcoming",l:t.upcoming}]}/>
            <div style={{display:"flex",gap:8}}><Btn onClick={()=>saveForm("treatments")}>{t.save}</Btn><Btn onClick={()=>setForm(null)} color="#94a3b8">{t.cancel}</Btn></div>
          </Card>}
        </>}

        {tab===2 && <>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{fontWeight:800,fontSize:17}}>📅 {t.appointments}</div>
            <Btn onClick={()=>startForm("appointment",{status:"upcoming"})} color="#8b5cf6">{t.addAppointment}</Btn>
          </div>
          {[...appointments].sort((a,b)=>(a.date||"").localeCompare(b.date||"")).map(ap=>(
            <Card key={ap.id}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700}}>{ap.type}</div>
                  <div style={{fontSize:13,color:"#64748b"}}>{ap.date}{ap.time?` · ${ap.time}`:""}</div>
                  {ap.notes && <div style={{fontSize:13,color:"#475569",marginTop:6,background:"#f8fafc",borderRadius:8,padding:"6px 10px"}}>{ap.notes}</div>}
                  <div style={{marginTop:6}}><span style={{fontSize:12,color:"#8b5cf6",fontWeight:700}}>{daysUntil(ap.date,t)}</span></div>
                </div>
                <div style={{display:"flex",gap:6,alignItems:"flex-start"}}><Badge status={ap.status} t={t}/>{delBtn("appointments",ap.id)}</div>
              </div>
            </Card>
          ))}
          {form==="appointment" && <Card style={{border:"2px solid #8b5cf6"}}>
            <div style={{fontWeight:700,marginBottom:12}}>New Appointment</div>
            <Input placeholder={t.date+" (YYYY-MM-DD)"} {...inp("date")}/>
            <Input placeholder={t.time} {...inp("time")}/>
            <Input placeholder={t.type} {...inp("type")}/>
            <Input placeholder={t.prep} {...inp("prep")}/>
            <Input placeholder={t.notes2} {...inp("notes")}/>
            <Sel {...inp("status")} options={[{v:"upcoming",l:t.upcoming},{v:"done",l:t.done}]}/>
            <div style={{display:"flex",gap:8}}><Btn onClick={()=>saveForm("appointments")} color="#8b5cf6">{t.save}</Btn><Btn onClick={()=>setForm(null)} color="#94a3b8">{t.cancel}</Btn></div>
          </Card>}
        </>}

        {tab===3 && <>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{fontWeight:800,fontSize:17}}>💊 {t.medications}</div>
            <Btn onClick={()=>startForm("medication",{active:true})} color="#10b981">{t.addMedication}</Btn>
          </div>
          {medications.map(m=>(
            <Card key={m.id}>
              <div style={{display:"flex",justifyContent:"space-between",gap:10}}>
                <div>
                  <div style={{fontWeight:700}}>{m.name}</div>
                  <div style={{fontSize:13,color:"#64748b"}}>{m.type} · {m.dose}</div>
                  <div style={{fontSize:13,color:"#64748b"}}>{m.frequency}</div>
                  {m.notes && <div style={{fontSize:13,color:"#475569",marginTop:4}}>{m.notes}</div>}
                </div>
                <div style={{display:"flex",gap:6,alignItems:"flex-start"}}><Badge status={m.active?"done":"cancelled"} t={t}/>{delBtn("medications",m.id)}</div>
              </div>
            </Card>
          ))}
          {form==="medication" && <Card style={{border:"2px solid #10b981"}}>
            <div style={{fontWeight:700,marginBottom:12}}>New Medication</div>
            <Input placeholder={t.medication} {...inp("name")}/>
            <Input placeholder={t.type} {...inp("type")}/>
            <Input placeholder={t.dose} {...inp("dose")}/>
            <Input placeholder={t.frequency} {...inp("frequency")}/>
            <Input placeholder={t.notes2} {...inp("notes")}/>
            <div style={{display:"flex",gap:8}}><Btn onClick={()=>saveForm("medications")} color="#10b981">{t.save}</Btn><Btn onClick={()=>setForm(null)} color="#94a3b8">{t.cancel}</Btn></div>
          </Card>}
        </>}

        {tab===4 && <>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{fontWeight:800,fontSize:17}}>📈 {t.growth}</div>
            <Btn onClick={()=>startForm("growth",{})} color="#f59e0b">{t.addMeasurement}</Btn>
          </div>
          <Card>
            <div style={{fontWeight:700,marginBottom:12}}>📊 {t.growthChart}</div>
            <GrowthChart data={growth} t={t}/>
          </Card>
          {[...growth].sort((a,b)=>(b.date||"").localeCompare(a.date||"")).map(g=>{
            const bmi=g.weight&&g.height?(g.weight/((g.height/100)**2)).toFixed(1):"—";
            return (
              <Card key={g.id}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}>
                  <div>
                    <div style={{fontWeight:700}}>{g.date}</div>
                    <div style={{display:"flex",gap:12,marginTop:4,flexWrap:"wrap"}}>
                      <span style={{color:"#3b82f6",fontWeight:700}}>⚖️ {g.weight} kg</span>
                      <span style={{color:"#10b981",fontWeight:700}}>📏 {g.height} cm</span>
                      <span style={{color:"#f59e0b",fontWeight:700}}>BMI {bmi}</span>
                    </div>
                    {g.occasion && <div style={{fontSize:13,color:"#64748b",marginTop:2}}>{g.occasion}</div>}
                  </div>
                  {delBtn("growth",g.id)}
                </div>
              </Card>
            );
          })}
          {form==="growth" && <Card style={{border:"2px solid #f59e0b"}}>
            <div style={{fontWeight:700,marginBottom:12}}>New Measurement</div>
            <Input placeholder={t.date+" (YYYY-MM-DD)"} {...inp("date")}/>
            <Input placeholder={t.weight} type="number" {...inp("weight")}/>
            <Input placeholder={t.height} type="number" {...inp("height")}/>
            <Input placeholder={t.occasion} {...inp("occasion")}/>
            <Input placeholder={t.notes2} {...inp("notes")}/>
            <div style={{display:"flex",gap:8}}><Btn onClick={()=>saveForm("growth")} color="#f59e0b">{t.save}</Btn><Btn onClick={()=>setForm(null)} color="#94a3b8">{t.cancel}</Btn></div>
          </Card>}
        </>}

        {tab===5 && <>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{fontWeight:800,fontSize:17}}>🩺 {t.symptoms}</div>
            <Btn onClick={()=>startForm("symptom",{})} color="#ef4444">{t.addSymptom}</Btn>
          </div>
          {symptoms.length===0 && <Card><div style={{color:"#94a3b8",textAlign:"center",padding:20}}>💡 Log symptoms during flare-ups or when something feels different.</div></Card>}
          {[...symptoms].sort((a,b)=>(b.date||"").localeCompare(a.date||"")).map(s=>(
            <Card key={s.id}>
              <div style={{display:"flex",justifyContent:"space-between",gap:10}}>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,marginBottom:8}}>{s.date}</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                    {s.pain && <span style={{background:"#fee2e2",color:"#ef4444",borderRadius:10,padding:"3px 10px",fontSize:12,fontWeight:600}}>😣 Pain: {s.pain}/10</span>}
                    {s.fatigue && <span style={{background:"#fef3c7",color:"#b45309",borderRadius:10,padding:"3px 10px",fontSize:12,fontWeight:600}}>😴 Fatigue: {s.fatigue}/10</span>}
                    {s.stool && <span style={{background:"#dbeafe",color:"#1d4ed8",borderRadius:10,padding:"3px 10px",fontSize:12,fontWeight:600}}>🚽 Stool: {s.stool}x/day</span>}
                    {s.fever && <span style={{background:"#fce7f3",color:"#be185d",borderRadius:10,padding:"3px 10px",fontSize:12,fontWeight:600}}>🌡️ {s.fever}°C</span>}
                    {s.blood && <span style={{background:"#fee2e2",color:"#b91c1c",borderRadius:10,padding:"3px 10px",fontSize:12,fontWeight:600}}>🩸 {s.blood}</span>}
                    {s.fistula && <span style={{background:"#f3e8ff",color:"#7c3aed",borderRadius:10,padding:"3px 10px",fontSize:12,fontWeight:600}}>📍 {s.fistula}</span>}
                  </div>
                  {s.notes && <div style={{fontSize:13,color:"#475569",marginTop:8}}>{s.notes}</div>}
                </div>
                {delBtn("symptoms",s.id)}
              </div>
            </Card>
          ))}
          {form==="symptom" && <Card style={{border:"2px solid #ef4444"}}>
            <div style={{fontWeight:700,marginBottom:12}}>New Symptom Log</div>
            <Input placeholder={t.date+" (YYYY-MM-DD)"} {...inp("date")}/>
            <Input placeholder={t.pain} type="number" {...inp("pain")}/>
            <Input placeholder={t.fatigue} type="number" {...inp("fatigue")}/>
            <Input placeholder={t.stool+" (times/day)"} type="number" {...inp("stool")}/>
            <Input placeholder={t.fever} type="number" {...inp("fever")}/>
            <Input placeholder={t.blood+" (Yes / No / A little)"} {...inp("blood")}/>
            <Input placeholder={t.fistula+" (Stable / Worse / Better)"} {...inp("fistula")}/>
            <Input placeholder={t.notes2} {...inp("notes")}/>
            <div style={{display:"flex",gap:8}}><Btn onClick={()=>saveForm("symptoms")} color="#ef4444">{t.save}</Btn><Btn onClick={()=>setForm(null)} color="#94a3b8">{t.cancel}</Btn></div>
          </Card>}
        </>}

        {tab===6 && <>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{fontWeight:800,fontSize:17}}>📝 {t.notes}</div>
            <Btn onClick={()=>startForm("note",{category:"medical"})} color="#64748b">{t.addNote}</Btn>
          </div>
          {[...notes].sort((a,b)=>(b.date||"").localeCompare(a.date||"")).map(n=>{
            const cc={medical:"#ef4444",insurance:"#3b82f6",admin:"#6366f1",diet:"#f59e0b",general:"#10b981"};
            const c=cc[n.category]||"#64748b";
            return (
              <Card key={n.id}>
                <div style={{display:"flex",justifyContent:"space-between",gap:10}}>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:6}}>
                      <span style={{background:c+"20",color:c,borderRadius:8,padding:"2px 10px",fontSize:11,fontWeight:700}}>{n.category}</span>
                      <span style={{fontSize:12,color:"#94a3b8"}}>{n.date}</span>
                    </div>
                    <div style={{fontWeight:700,marginBottom:4}}>{n.title}</div>
                    <div style={{fontSize:14,color:"#475569"}}>{n.content}</div>
                  </div>
                  {delBtn("notes",n.id)}
                </div>
              </Card>
            );
          })}
          {form==="note" && <Card style={{border:"2px solid #64748b"}}>
            <div style={{fontWeight:700,marginBottom:12}}>New Note</div>
            <Input placeholder={t.date+" (YYYY-MM-DD)"} {...inp("date")}/>
            <Input placeholder={t.title} {...inp("title")}/>
            <textarea placeholder={t.content} value={fv.content||""} onChange={e=>setFv(f=>({...f,content:e.target.value}))}
              style={{width:"100%",padding:"9px 12px",border:"1.5px solid #e2e8f0",borderRadius:10,fontSize:14,marginBottom:8,boxSizing:"border-box",minHeight:80,resize:"vertical"}}/>
            <Sel {...inp("category")} options={[{v:"medical",l:"Medical"},{v:"insurance",l:"Insurance"},{v:"admin",l:"Admin"},{v:"diet",l:"Diet"},{v:"general",l:"General"}]}/>
            <div style={{display:"flex",gap:8}}><Btn onClick={()=>saveForm("notes")} color="#64748b">{t.save}</Btn><Btn onClick={()=>setForm(null)} color="#94a3b8">{t.cancel}</Btn></div>
          </Card>}
        </>}

      </div>
    </div>
  );
}
