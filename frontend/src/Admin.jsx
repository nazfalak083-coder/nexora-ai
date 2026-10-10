
import React from "react";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Bot,
  Settings,
  Activity,
  ArrowUpRight,
  Clock,
  ShieldCheck,
} from "lucide-react";

const stats = [
  { label: "Total Leads", value: "—", icon: Users },
  { label: "Conversations", value: "—", icon: MessageSquare },
  { label: "Automations", value: "0", icon: Bot },
  { label: "System Status", value: "Checking", icon: Activity },
];

export default function Admin() {
  return (
    <div style={styles.app}>
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          <div style={styles.logo}>N</div>
          <div>
            <strong>NEXORA</strong>
            <div style={styles.muted}>AI CONTROL CENTER</div>
          </div>
        </div>

        <div style={styles.section}>WORKSPACE</div>

        {[
          [LayoutDashboard, "Overview"],
          [Users, "Leads"],
          [MessageSquare, "Conversations"],
          [Bot, "Automation"],
          [Activity, "Analytics"],
          [Settings, "Settings"],
        ].map(([Icon, label], index) => (
          <div
            key={label}
            style={{
              ...styles.navItem,
              ...(index === 0 ? styles.active : {}),
            }}
          >
            <Icon size={18} />
            <span>{label}</span>
            {index === 0 && <ArrowUpRight size={15} style={{ marginLeft: "auto" }} />}
          </div>
        ))}

        <div style={styles.sidebarBottom}>
          <ShieldCheck size={18} color="#b7a0ff" />
          <div>
            <strong style={{ fontSize: 12 }}>Admin workspace</strong>
            <div style={styles.muted}>Connect authentication before launch</div>
          </div>
        </div>
      </aside>

      <main style={styles.main}>
        <header style={styles.header}>
          <div>
            <div style={styles.muted}>WORKSPACE / OVERVIEW</div>
            <h1 style={styles.heading}>Dashboard</h1>
            <p style={styles.subtitle}>
              Monitor your NEXORA AI workspace.
            </p>
          </div>
          <div style={styles.status}>
            <span style={styles.dot} />
            Dashboard preview
          </div>
        </header>

        <section style={styles.welcome}>
          <div>
            <div style={styles.eyebrow}>NEXORA AI PLATFORM</div>
            <h2 style={styles.welcomeTitle}>Your business, at a glance.</h2>
            <p style={styles.subtitle}>
              Manage leads, monitor conversations, and review activity.
            </p>
          </div>
          <div style={styles.orb}>✳</div>
        </section>

        <section style={styles.stats}>
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} style={styles.card}>
              <div style={styles.cardTop}>
                <span style={styles.muted}>{label}</span>
                <Icon size={19} color="#b7a0ff" />
              </div>
              <div style={styles.statValue}>{value}</div>
              <div style={styles.cardFoot}>Awaiting live data connection</div>
            </div>
          ))}
        </section>

        <section style={styles.bottomGrid}>
          <div style={styles.panel}>
            <div style={styles.panelHeader}>
              <div>
                <h3 style={styles.panelTitle}>Recent activity</h3>
                <p style={styles.muted}>Latest workspace events</p>
              </div>
              <Activity size={19} color="#b7a0ff" />
            </div>
            <div style={styles.empty}>
              <Clock size={25} color="#8e80b9" />
              <strong>No activity loaded yet</strong>
              <span style={styles.muted}>
                Connect the backend to show real events here.
              </span>
            </div>
          </div>

          <div style={styles.panel}>
            <div style={styles.panelHeader}>
              <div>
                <h3 style={styles.panelTitle}>System overview</h3>
                <p style={styles.muted}>Configuration checklist</p>
              </div>
              <ShieldCheck size={19} color="#b7a0ff" />
            </div>
            {[
              ["Chat interface", "Already deployed"],
              ["Lead storage", "Backend available"],
              ["Live analytics", "Not connected"],
              ["Admin security", "Not configured"],
            ].map(([label, value]) => (
              <div key={label} style={styles.checkRow}>
                <span style={styles.checkDot} />
                <span>{label}</span>
                <span style={styles.checkValue}>{value}</span>
              </div>
            ))}
          </div>
        </section>

        <footer style={styles.footer}>
          NEXORA AI · ADMIN CONSOLE · PREVIEW
        </footer>
      </main>
    </div>
  );
}

const styles = {
  app: {
    minHeight: "100vh",
    background: "#0a0910",
    color: "#f4f0ff",
    display: "flex",
    fontFamily: "Inter, Arial, sans-serif",
    fontSize: 14,
  },
  sidebar: {
    width: 235,
    flexShrink: 0,
    background: "#0e0c16",
    borderRight: "1px solid #252033",
    padding: "27px 16px",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
  },
  brand: { display: "flex", alignItems: "center", gap: 11, marginBottom: 42 },
  logo: {
    width: 39,
    height: 39,
    display: "grid",
    placeItems: "center",
    borderRadius: 12,
    background: "linear-gradient(135deg,#b7a0ff,#7650db)",
    color: "#100b1e",
    fontSize: 23,
    fontWeight: 900,
  },
  muted: { color: "#8e879f", fontSize: 12 },
  section: {
    color: "#746d85",
    fontSize: 10,
    letterSpacing: 2,
    margin: "0 0 13px 9px",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px 10px",
    marginBottom: 5,
    borderRadius: 9,
    color: "#aaa2bb",
  },
  active: {
    background: "#211932",
    color: "#d3c4ff",
    border: "1px solid #34254d",
  },
  sidebarBottom: {
    marginTop: "auto",
    border: "1px solid #302442",
    borderRadius: 12,
    padding: 12,
    display: "flex",
    gap: 10,
    alignItems: "flex-start",
  },
  main: {
    flex: 1,
    minWidth: 0,
    padding: "35px clamp(18px, 4vw, 52px)",
    boxSizing: "border-box",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 15,
    marginBottom: 28,
  },
  heading: { fontSize: 30, margin: "9px 0 6px", letterSpacing: -1 },
  subtitle: { color: "#9991aa", margin: "7px 0 0", lineHeight: 1.6 },
  status: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    border: "1px solid #332b43",
    background: "#14111d",
    borderRadius: 30,
    padding: "9px 13px",
    color: "#bdb4cf",
    fontSize: 12,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#c4a8ff",
  },
  welcome: {
    background: "linear-gradient(110deg,#211832,#171322 75%)",
    border: "1px solid #39294e",
    borderRadius: 17,
    padding: "27px 29px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
    marginBottom: 21,
  },
  eyebrow: {
    color: "#b9a0ff",
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: 700,
  },
  welcomeTitle: { fontSize: 24, margin: "12px 0 7px", letterSpacing: -0.6 },
  orb: {
    width: 65,
    height: 65,
    borderRadius: 20,
    display: "grid",
    placeItems: "center",
    fontSize: 37,
    color: "#d4c5ff",
    background: "radial-gradient(circle at 30% 25%,#7957b4,#2b1d40)",
    flexShrink: 0,
  },
  stats: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(175px,1fr))",
    gap: 15,
    marginBottom: 20,
  },
  card: {
    background: "#12101a",
    border: "1px solid #292337",
    borderRadius: 14,
    padding: 18,
    minWidth: 0,
  },
  cardTop: { display: "flex", justifyContent: "space-between", gap: 8 },
  statValue: { fontSize: 27, fontWeight: 700, margin: "18px 0 12px" },
  cardFoot: { color: "#776f87", fontSize: 11 },
  bottomGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
    gap: 17,
  },
  panel: {
    background: "#12101a",
    border: "1px solid #292337",
    borderRadius: 14,
    padding: 20,
    minWidth: 0,
  },
  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    marginBottom: 22,
  },
  panelTitle: { fontSize: 15, margin: "0 0 6px" },
  empty: {
    minHeight: 130,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    gap: 12,
  },
  checkRow: {
    display: "flex",
    alignItems: "center",
    gap: 9,
    padding: "13px 0",
    borderBottom: "1px solid #282235",
    fontSize: 12,
    flexWrap: "wrap",
  },
  checkDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#8c76b8",
  },
  checkValue: { color: "#9990ab", marginLeft: "auto", fontSize: 11 },
  footer: {
    textAlign: "center",
    color: "#615a70",
    fontSize: 10,
    letterSpacing: 2,
    marginTop: 30,
  },
};
