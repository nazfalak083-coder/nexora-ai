
import React, { useState } from "react";
import {
  LayoutDashboard, Users, MessageSquare, Bot, Activity,
  Settings, ArrowLeft, Zap, ShieldCheck, Plus, Trash2
} from "lucide-react";

const items = [
  ["Overview", LayoutDashboard],
  ["Leads", Users],
  ["Conversations", MessageSquare],
  ["Automation", Bot],
  ["Analytics", Activity],
  ["Settings", Settings],
];

const cardStyle = {
  background: "#fff",
  border: "1px solid #e9e5f5",
  borderRadius: 16,
  padding: 22,
  boxShadow: "0 5px 20px #5341a008",
};

export default function Admin({ onBack = () => {} }) {
  const [page, setPage] = useState("Overview");
  const [automations, setAutomations] = useState([
    { name: "Welcome message", detail: "Greet new visitors", on: true },
    { name: "Lead collection", detail: "Collect customer enquiries", on: true },
    { name: "Follow-up reminders", detail: "Remind your team to follow up", on: false },
  ]);
  const [settings, setSettings] = useState({
    notifications: true,
    maintenance: false,
  });

  const heading = {
    Overview: "Dashboard Overview",
    Leads: "Lead Management",
    Conversations: "Conversations",
    Automation: "Automation Center",
    Analytics: "Workspace Analytics",
    Settings: "Workspace Settings",
  };

  function renderContent() {
    if (page === "Overview") {
      return <>
        <div style={{ ...cardStyle, background: "linear-gradient(120deg,#f0eaff,#eaf3ff)", marginBottom: 20 }}>
          <h2 style={{ margin: "0 0 8px" }}>Welcome to NEXORA AI ✨</h2>
          <p style={{ color: "#696780", margin: 0 }}>Manage your business AI workspace in one place.</p>
        </div>
        <div style={grid}>
          {[
            ["Total Leads", "—", Users],
            ["Conversations", "—", MessageSquare],
            ["Automations", automations.filter(a => a.on).length, Bot],
            ["System Status", "Check API", Activity],
          ].map(([label, value, Icon]) => (
            <div key={label} style={cardStyle}>
              <Icon color="#8170d9" size={22} />
              <p style={{ color: "#77748e", marginBottom: 8 }}>{label}</p>
              {label === "Total Leads" ? (
                <div style={ring}><div style={ringInner}>{value}</div></div>
              ) : <strong style={{ fontSize: 25 }}>{value}</strong>}
            </div>
          ))}
        </div>
        <div style={{ ...cardStyle, marginTop: 20 }}>
          <h3>Quick actions</h3>
          <div style={grid}>
            {items.slice(1).map(([name, Icon]) => (
              <button key={name} style={quickButton} onClick={() => setPage(name)}>
                <Icon size={18} /> {name} →
              </button>
            ))}
          </div>
        </div>
      </>;
    }

    if (page === "Leads") return <div style={cardStyle}>
      <Users color="#8170d9" size={28} />
      <h2>Leads</h2>
      <p style={muted}>Customer enquiries and contact records.</p>
      <p>Live lead records require the backend leads endpoint to be connected.</p>
      <button style={button} onClick={() => setPage("Settings")}>Check workspace setup</button>
    </div>;

    if (page === "Conversations") return <div style={cardStyle}>
      <MessageSquare color="#8170d9" size={28} />
      <h2>Conversations</h2>
      <p style={muted}>Review customer conversations with your AI assistant.</p>
      <p>Conversation history will appear here when a history endpoint is connected.</p>
    </div>;

    if (page === "Automation") return <div style={cardStyle}>
      <Bot color="#8170d9" size={28} />
      <h2>Automation rules</h2>
      <p style={muted}>Toggle the workspace rules below. These switches control this dashboard UI.</p>
      {automations.map((a, i) => <div key={a.name} style={rule}>
        <div><strong>{a.name}</strong><p style={muted}>{a.detail}</p></div>
        <button style={{ ...button, background: a.on ? "#7662d8" : "#aaa6ba" }}
          onClick={() => setAutomations(old => old.map((x, j) => i === j ? { ...x, on: !x.on } : x))}>
          {a.on ? "ON" : "OFF"}
        </button>
      </div>)}
    </div>;

    if (page === "Analytics") return <div style={cardStyle}>
      <Activity color="#8170d9" size={28} />
      <h2>Analytics</h2>
      <p style={muted}>Usage and performance overview.</p>
      <div style={grid}>
        <div style={miniCard}><strong>—</strong><p>Messages processed</p></div>
        <div style={miniCard}><strong>—</strong><p>Lead conversion rate</p></div>
        <div style={miniCard}><strong>—</strong><p>Average response time</p></div>
      </div>
      <p>Connect real backend metrics to display live analytics.</p>
    </div>;

    return <div style={cardStyle}>
      <Settings color="#8170d9" size={28} />
      <h2>Settings</h2>
      <p style={muted}>Manage dashboard preferences.</p>
      {[
        ["notifications", "Dashboard notifications"],
        ["maintenance", "Maintenance mode indicator"],
      ].map(([key, label]) => <div key={key} style={rule}>
        <strong>{label}</strong>
        <button style={{ ...button, background: settings[key] ? "#7662d8" : "#aaa6ba" }}
          onClick={() => setSettings(s => ({ ...s, [key]: !s[key] }))}>
          {settings[key] ? "ON" : "OFF"}
        </button>
      </div>)}
      <p style={muted}>These preferences are currently temporary and reset on refresh.</p>
    </div>;
  }

  return <div style={app}>
    <aside style={sidebar}>
      <div style={brand}><span style={logo}>N</span><div><strong>NEXORA</strong><small>AI WORKSPACE</small></div></div>
      <p style={section}>WORKSPACE</p>
      {items.map(([name, Icon]) => <button key={name}
        onClick={() => setPage(name)}
        style={{ ...nav, ...(page === name ? active : {}) }}>
        <Icon size={18} /> {name}
      </button>)}
      <div style={{ marginTop: "auto", ...cardStyle, padding: 14 }}>
        <ShieldCheck color="#8170d9" size={20} />
        <strong style={{ display: "block", marginTop: 8 }}>Admin workspace</strong>
        <small style={muted}>Add authentication before public launch.</small>
      </div>
    </aside>
    <main style={main}>
      <header style={top}>
        <div><small style={muted}>WORKSPACE / {page.toUpperCase()}</small><h1 style={{ margin: "8px 0" }}>{heading[page]}</h1></div>
        <button style={button} onClick={onBack}><ArrowLeft size={16} /> Back to AI</button>
      </header>
      {renderContent()}
      <footer style={{ textAlign: "center", color: "#9691aa", marginTop: 30, fontSize: 11 }}>NEXORA AI · WORKSPACE</footer>
    </main>
  </div>;
}

const app = { minHeight: "100vh", display: "flex", background: "#f7f6fc", color: "#28243b", fontFamily: "Inter,Arial,sans-serif" };
const sidebar = { width: 235, flexShrink: 0, background: "#fff", borderRight: "1px solid #e9e5f5", padding: 20, display: "flex", flexDirection: "column", gap: 7, boxSizing: "border-box" };
const brand = { display: "flex", alignItems: "center", gap: 12, marginBottom: 25 };
const logo = { width: 40, height: 40, display: "grid", placeItems: "center", borderRadius: 12, color: "#fff", fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg,#9b83f4,#648ce9)" };
const section = { fontSize: 10, letterSpacing: 2, color: "#9691aa", margin: "8px 0" };
const nav = { display: "flex", alignItems: "center", gap: 12, width: "100%", textAlign: "left", padding: "12px", border: 0, borderRadius: 10, background: "transparent", color: "#77748e", cursor: "pointer", fontSize: 14 };
const active = { background: "#f0ebff", color: "#7058ce", fontWeight: 700 };
const main = { flex: 1, minWidth: 0, padding: "32px clamp(16px,4vw,44px)", boxSizing: "border-box" };
const top = { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 28 };
const muted = { color: "#85819a", fontSize: 12 };
const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 16 };
const miniCard = { background: "#f6f3ff", padding: 16, borderRadius: 12 };
const button = { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "10px 14px", border: 0, borderRadius: 9, background: "#7662d8", color: "#fff", cursor: "pointer" };
const quickButton = { display: "flex", alignItems: "center", gap: 10, padding: 15, border: "1px solid #e9e5f5", borderRadius: 10, background: "#fff", color: "#50476d", cursor: "pointer" };
const rule = { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "16px 0", borderBottom: "1px solid #eeeaf6" };
const ring = { width: 72, height: 72, borderRadius: "50%", padding: 4, marginTop: 12, background: "conic-gradient(#ff5e7e,#ffb65e,#f7e75b,#5be7a9,#59a9ff,#9d71ff,#ff5e7e)", display: "grid", placeItems: "center" };
const ringInner = { width: "100%", height: "100%", borderRadius: "50%", display: "grid", placeItems: "center", background: "#fff", fontSize: 21, fontWeight: 800 };
