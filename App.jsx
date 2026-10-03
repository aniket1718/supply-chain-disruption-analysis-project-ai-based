import React, { useMemo, useState } from "react";
import {
  Activity, AlertTriangle, Bell, Brain, Boxes, ChevronRight, Factory,
  FileText, Menu, Package, RefreshCw, Route, Search, Ship, Sparkles,
  TrendingUp, Users, X, CheckCircle2, MapPin, Database
} from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, BarChart, Bar
} from "recharts";

const riskData = [
  { month: "Oct", risk: 48 }, { month: "Nov", risk: 53 }, { month: "Dec", risk: 51 },
  { month: "Jan", risk: 60 }, { month: "Feb", risk: 69 }, { month: "Mar", risk: 66 },
  { month: "Apr", risk: 75 }, { month: "May", risk: 80 }, { month: "Jun", risk: 72 },
  { month: "Jul", risk: 86 }, { month: "Aug", risk: 92 }, { month: "Sep", risk: 89 }
];

const driverData = [
  { name: "Steel", value: 83 }, { name: "Port", value: 72 },
  { name: "Rail", value: 48 }, { name: "Demand", value: 83 },
  { name: "Weather", value: 67 }
];

const disruptions = [
  { event: "Port congestion", time: "34 min ago", location: "Nhava Sheva, IN", severity: "High", impact: "18–26 hrs", status: "Active" },
  { event: "Heavy rainfall", time: "2 hrs ago", location: "Odisha corridor", severity: "Medium", impact: "8–14 hrs", status: "Monitoring" },
  { event: "Supplier capacity drop", time: "4 hrs ago", location: "Bhilai, IN", severity: "High", impact: "12–20%", status: "Active" },
  { event: "Rail maintenance", time: "Yesterday", location: "Nagpur–Mumbai", severity: "Low", impact: "3–6 hrs", status: "Resolved" }
];

const navItems = [
  ["Overview", Activity], ["Disruptions", AlertTriangle], ["Forecasting", TrendingUp],
  ["AI Risk Analysis", Brain], ["Shipments", Ship], ["Suppliers", Users],
  ["Reports", FileText], ["ML Model", Database], ["Project Architecture", Boxes]
];

function StatCard({ icon: Icon, label, value, delta }) {
  return <div className="stat-card">
    <div className="stat-top"><span>{label}</span><div className="icon-box"><Icon size={16}/></div></div>
    <strong>{value}</strong>
    <span className="delta">↗ {delta}</span>
  </div>;
}

function Badge({ children }) {
  return <span className={`badge ${String(children).toLowerCase()}`}>{children}</span>;
}

function Dashboard({ onNavigate }) {
  const [query, setQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState("");

  const filtered = useMemo(() =>
    disruptions.filter(d => JSON.stringify(d).toLowerCase().includes(query.toLowerCase())), [query]);

  const notify = (msg) => {
    setToast(msg);
    window.clearTimeout(window.__sfToast);
    window.__sfToast = window.setTimeout(() => setToast(""), 2400);
  };

  const refresh = () => {
    setRefreshing(true);
    notify("AI analysis refreshed");
    setTimeout(() => setRefreshing(false), 900);
  };

  return <div className="dashboard">
    <div className="page-head">
      <div>
        <p className="eyebrow">LIVE INTELLIGENCE · 03 OCT 2026</p>
        <h1>Supply Chain Command Center</h1>
        <p>AI-powered visibility across steel suppliers, ports, rail, road and customer demand.</p>
      </div>
      <button className="primary" onClick={refresh} disabled={refreshing}>
        <RefreshCw size={15} className={refreshing ? "spin" : ""}/>
        {refreshing ? "Analyzing..." : "Refresh analysis"}
      </button>
    </div>

    <div className="stats">
      <StatCard icon={Activity} label="Network risk" value="68 / 100" delta="8.4% vs last week"/>
      <StatCard icon={Package} label="At-risk shipments" value="12" delta="3 new today"/>
      <StatCard icon={TrendingUp} label="Forecast demand" value="74.2k t" delta="6.8% next 30 days"/>
      <StatCard icon={Users} label="Supplier reliability" value="91.4%" delta="1.7% vs last month"/>
    </div>

    <div className="grid two">
      <section className="card">
        <div className="card-head">
          <div><h2>Disruption Risk Forecast</h2><p>AI predicted network risk score</p></div>
          <Badge>12 months</Badge>
        </div>
        <div className="legend"><span><i/>Predicted risk</span><span>Baseline 50</span></div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={riskData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf0f5"/>
            <XAxis dataKey="month" tick={{fontSize:10,fill:"#929bae"}} axisLine={false} tickLine={false}/>
            <YAxis domain={[30,100]} tick={{fontSize:10,fill:"#929bae"}} axisLine={false} tickLine={false}/>
            <Tooltip />
            <Line type="monotone" dataKey="risk" stroke="#2864e6" strokeWidth={3} dot={false}/>
          </LineChart>
        </ResponsiveContainer>
      </section>

      <section className="card">
        <div className="card-head"><div><h2>Risk Drivers</h2><p>Current contribution to network risk</p></div></div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={driverData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf0f5"/>
            <XAxis dataKey="name" tick={{fontSize:10,fill:"#929bae"}} axisLine={false} tickLine={false}/>
            <YAxis hide/>
            <Tooltip />
            <Bar dataKey="value" fill="#5c86e8" radius={[5,5,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
        <div className="driver-list">
          <div><span>Port congestion</span><b>83%</b></div>
          <div><span>Demand volatility</span><b>72%</b></div>
          <div><span>Supplier capacity</span><b>67%</b></div>
        </div>
      </section>
    </div>

    <div className="grid lower">
      <section className="card">
        <div className="card-head">
          <div><h2>Live Disruptions</h2><p>Events detected by rules + AI monitoring</p></div>
          <button className="text-btn" onClick={() => onNavigate("Disruptions")}>View all <ChevronRight size={14}/></button>
        </div>
        <div className="table-tools"><div className="table-search"><Search size={14}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Filter events..."/></div></div>
        <div className="table-wrap"><table><thead><tr><th>Event</th><th>Location</th><th>Severity</th><th>Impact</th><th>Status</th></tr></thead>
        <tbody>{filtered.map((d,i)=><tr key={i}>
          <td><b>{d.event}</b><small>{d.time}</small></td><td><MapPin size={12}/> {d.location}</td>
          <td><Badge>{d.severity}</Badge></td><td>{d.impact}</td><td><span className={`status-dot ${d.status.toLowerCase()}`}>● {d.status}</span></td>
        </tr>)}</tbody></table></div>
      </section>

      <section className="card ai-card">
        <div className="ai-orb"><Sparkles size={21}/></div>
        <p className="eyebrow">AI RECOMMENDATION</p>
        <h2>Re-route 2 shipments</h2>
        <p>Model detects elevated congestion on the Nhava Sheva corridor. Moving SH-24092 via Mundra is estimated to reduce delay exposure.</p>
        <div className="confidence"><span>Model confidence</span><b>87%</b><div><i style={{width:"87%"}}/></div></div>
        <button className="secondary" onClick={() => {
          const ok = window.confirm("AI recommendation: reroute SH-24092 via Mundra.\\n\\nEstimated delay reduction: 18–26 hrs → 6–10 hrs.\\n\\nApply recommendation?");
          notify(ok ? "Reroute recommendation approved" : "Recommendation kept for review");
        }}>Review recommendation</button>
      </section>
    </div>

    {toast && <div className="toast">{toast}</div>}
  </div>;
}

function Workspace({ name }) {
  const content = {
    Disruptions: ["Disruption Monitoring", "Track active events, severity, locations and estimated operational impact."],
    Forecasting: ["Demand & Risk Forecasting", "Review future demand, disruption risk and AI-generated forecast signals."],
    "AI Risk Analysis": ["AI Risk Analysis", "Explainable AI assessment of network risk and recommended mitigation actions."],
    Shipments: ["Shipment Control Tower", "Monitor shipment status, routes, delays and rerouting recommendations."],
    Suppliers: ["Supplier Intelligence", "Compare supplier reliability, capacity exposure and disruption contribution."],
    Reports: ["Reports & Analytics", "Generate management-ready disruption, forecast and supplier reports."],
    "ML Model": ["ML Model Intelligence", "Dataset-backed shipping-time prediction prototype trained with Gradient Boosting."],
    "Project Architecture": ["Project Architecture", "Complete implementation path from dataset to AI-powered supply-chain dashboard."]
  };
  const [title, desc] = content[name] || ["SteelFlow", ""];
  return <div className="workspace-page">
    <div className="page-head"><div><p className="eyebrow">STEELFLOW WORKSPACE</p><h1>{title}</h1><p>{desc}</p></div></div>
    {name === "ML Model" ? <MLModel/> : name === "Project Architecture" ? <Architecture/> : <GenericWorkspace name={name}/>}
  </div>;
}

function GenericWorkspace({name}) {
  return <div className="workspace-grid">
    <section className="card hero-work"><div className="ai-orb"><Sparkles size={22}/></div><h2>{name}</h2><p>This workspace is ready for live Spring Boot API data. The UI layer is already structured for the next backend integration.</p><button className="primary">Connect API</button></section>
    <section className="card"><div className="card-head"><div><h2>Module status</h2><p>Frontend implementation</p></div><Badge>Ready</Badge></div>
      {["UI components","Filtering & interactions","Charts","API integration"].map((x,i)=><div className="check-row" key={x}><CheckCircle2 size={16}/><span>{x}</span><b>{i<3?"Ready":"Next"}</b></div>)}
    </section>
  </div>;
}

function MLModel() {
  return <div className="card">
    <div className="card-head"><div><h2>Trained ML Model</h2><p>Initial model trained on the supply-chain dataset</p></div><Badge>Trained</Badge></div>
    <div className="mini-stats"><div><span>Dataset</span><strong>100</strong><small>records</small></div><div><span>Target</span><strong>Shipping</strong><small>time</small></div><div><span>MAE</span><strong>2.21</strong><small>test set</small></div><div><span>R²</span><strong>-0.10</strong><small>prototype</small></div></div>
    <div className="callout"><Sparkles size={18}/><div><b>Gradient Boosting selected</b><p>80% training / 20% holdout. Sample: SKU0 actual shipping time 4, predicted 5.43. The small dataset limits accuracy, so this is an initial research prototype.</p></div></div>
  </div>;
}

function Architecture() {
  const modules = [
    ["01","React Frontend","Dashboard, disruptions, forecasting, shipments and suppliers","Ready"],
    ["02","Spring Boot API","Authentication, RBAC, CRUD, database and business APIs","Next"],
    ["03","MySQL Database","Users, suppliers, shipments, disruptions, forecasts and alerts","Next"],
    ["04","Python AI Layer","Preprocessing, shipping-time prediction and future risk models","Prototype"]
  ];
  return <div className="card"><div className="card-head"><div><h2>SteelFlow End-to-End Architecture</h2><p>React → Spring Boot → MySQL → Python AI</p></div></div>
    <div className="arch-grid">{modules.map(m=><div className="arch-item" key={m[0]}><div className="arch-num">{m[0]}</div><div><b>{m[1]}</b><p>{m[2]}</p></div><Badge>{m[3]}</Badge></div>)}</div>
    <div className="callout"><Route size={18}/><div><b>Recommended build order</b><p>Freeze database schema → Spring Boot APIs → connect React → train/evaluate ML → connect Python prediction API → add explainable AI and reports.</p></div></div>
  </div>;
}

export default function App() {
  const [active, setActive] = useState("Overview");
  const [mobile, setMobile] = useState(false);
  const [notice, setNotice] = useState(false);

  const select = (name) => { setActive(name); setMobile(false); };

  return <div className="app">
    <aside className={`sidebar ${mobile ? "open" : ""}`}>
      <div className="brand"><div className="brand-mark">SF</div><div><b>SteelFlow</b><small>AI Supply Intelligence</small></div><button className="close" onClick={()=>setMobile(false)}><X size={18}/></button></div>
      <div className="nav-label">WORKSPACE</div>
      {navItems.map(([name,Icon])=><button key={name} className={`nav ${active===name?"active":""}`} onClick={()=>select(name)}><Icon size={16}/><span>{name}</span>{name==="Disruptions"&&<em>4</em>}</button>)}
      <div className="side-bottom"><div className="ai-mini"><Sparkles size={15}/><div><b>AI Engine</b><small>Online · 99.2% uptime</small></div><span/></div></div>
    </aside>

    <main>
      <header><button className="hamb" onClick={()=>setMobile(true)}><Menu size={21}/></button><div className="crumb">SteelFlow / <b>{active}</b></div>
        <div className="header-actions"><div className="global-search"><Search size={14}/><input placeholder="Search disruptions, suppliers..."/></div>
          <button className="icon-btn" onClick={()=>setNotice(!notice)}><Bell size={18}/><i/></button><div className="avatar" onClick={()=>alert("Profile: Supply Intelligence Analyst")}>AK</div>
        </div>
        {notice&&<div className="notification"><b>4 active alerts</b><span>Port congestion requires attention.</span></div>}
      </header>
      <div className="content">
        {active==="Overview" ? <Dashboard onNavigate={select}/> : <Workspace name={active}/>}
      </div>
    </main>
  </div>;
}