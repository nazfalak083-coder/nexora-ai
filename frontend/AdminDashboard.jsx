
import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Activity,
  RefreshCw,
  ArrowLeft,
  Bot
} from 'lucide-react';

const API =
  import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function AdminDashboard({ onBack }) {
  const [summary, setSummary] = useState(null);
  const [leads, setLeads] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('Overview');

  async function loadDashboard() {
    setLoading(true);
    setError('');

    try {
      const [summaryResponse, leadsResponse] = await Promise.all([
        fetch(`${API}/api/admin/summary`),
        fetch(`${API}/api/leads`)
      ]);

      if (!summaryResponse.ok || !leadsResponse.ok) {
        throw new Error(
          'Dashboard API unavailable. Backend endpoints need checking.'
        );
      }

      const summaryData = await summaryResponse.json();
      const leadsData = await leadsResponse.json();

      setSummary(summaryData);
      setLeads(
        Array.isArray(leadsData)
          ? leadsData
          : leadsData.leads || []
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const stats = [
    {
      label: 'Conversations',
      value: summary?.total_conversations ??
        summary?.conversations_count ?? '—',
      icon: MessageSquare
    },
    {
      label: 'Total Leads',
      value: summary?.total_leads ??
        summary?.leads_count ?? leads.length,
      icon: Users
    },
    {
      label: 'System Status',
      value: error ? 'Check API' : loading ? 'Loading' : 'Connected',
      icon: Activity
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0b0c10',
      color: '#f5f5f5',
      fontFamily: 'Inter, Arial, sans-serif',
      padding: '28px',
      boxSizing: 'border-box'
    }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px',
        flexWrap: 'wrap',
        marginBottom: '36px'
      }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{
            background: '#d6b878',
            color: '#111',
            padding: '12px',
            borderRadius: '12px'
          }}>
            <Bot size={25} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px' }}>
              NEXORA <span style={{ color: '#d6b878' }}>ADMIN</span>
            </h1>
            <p style={{ color: '#999', margin: '6px 0 0' }}>
              AI management dashboard
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {onBack && (
            <button onClick={onBack} style={buttonStyle}>
              <ArrowLeft size={16} /> Chatbot
            </button>
          )}
          <button onClick={loadDashboard} style={buttonStyle}>
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </header>

      <nav style={{
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap',
        marginBottom: '24px'
      }}>
        {['Overview', 'Leads', 'Conversations', 'Activity'].map(item => (
          <button
            key={item}
            onClick={() => setTab(item)}
            style={{
              ...buttonStyle,
              background: tab === item ? '#d6b878' : '#17181e',
              color: tab === item ? '#111' : '#ddd'
            }}
          >
            {item === 'Overview' && <LayoutDashboard size={16} />}
            {item === 'Leads' && <Users size={16} />}
            {item === 'Conversations' && <MessageSquare size={16} />}
            {item === 'Activity' && <Activity size={16} />}
            {item}
          </button>
        ))}
      </nav>

      {error && (
        <div style={{
          padding: '16px',
          border: '1px solid #794444',
          borderRadius: '12px',
          marginBottom: '20px',
          color: '#ffbaba'
        }}>
          {error}
          <p style={{ marginBottom: 0, color: '#ccc' }}>
            Check the backend endpoints and API response format.
          </p>
        </div>
      )}

      {loading && <p style={{ color: '#aaa' }}>Loading dashboard…</p>}

      {tab === 'Overview' && (
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '16px'
        }}>
          {stats.map(stat => {
            const Icon = stat.icon;
            return (
              <article key={stat.label} style={cardStyle}>
                <Icon size={23} color="#d6b878" />
                <p style={{ color: '#aaa', marginBottom: '8px' }}>
                  {stat.label}
                </p>
                <h2 style={{ fontSize: '28px', margin: 0 }}>
                  {stat.value}
                </h2>
              </article>
            );
          })}
          <article style={{ ...cardStyle, gridColumn: '1 / -1' }}>
            <h3>System overview</h3>
            <p style={{ color: '#aaa' }}>
              Review incoming leads and connect conversation analytics
              to monitor your AI assistant.
            </p>
          </article>
        </section>
      )}

      {tab === 'Leads' && (
        <section style={cardStyle}>
          <h2>Customer leads</h2>
          {leads.length === 0
            ? <p style={{ color: '#aaa' }}>No leads returned by the API.</p>
            : leads.map((lead, index) => (
              <article key={lead.id ?? index} style={{
                borderTop: '1px solid #303038',
                padding: '16px 0'
              }}>
                <strong>{lead.name || 'Unnamed customer'}</strong>
                <p style={{ color: '#d6b878' }}>
                  {lead.email || 'No email'}
                </p>
                <p style={{ color: '#aaa', whiteSpace: 'pre-wrap' }}>
                  {lead.message || 'No message'}
                </p>
              </article>
            ))
          }
        </section>
      )}

      {tab === 'Conversations' && (
        <section style={cardStyle}>
          <h2>Conversations</h2>
          <p style={{ color: '#aaa' }}>
            {summary?.total_conversations ??
             summary?.conversations_count ??
             'Conversation count is not available in the expected format.'}
          </p>
          <p style={{ color: '#aaa' }}>
            Full conversation history requires a backend endpoint that
            stores and returns conversation records.
          </p>
        </section>
      )}

      {tab === 'Activity' && (
        <section style={cardStyle}>
          <h2>System activity</h2>
          <p style={{ color: '#aaa' }}>
            Dashboard checked: {new Date().toLocaleString()}
          </p>
          <p style={{ color: '#aaa' }}>
            API status: {error ? 'Needs attention' : loading ? 'Loading' : 'Request completed'}
          </p>
        </section>
      )}
    </div>
  );
}

const buttonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  padding: '11px 14px',
  border: '1px solid #303038',
  borderRadius: '10px',
  background: '#17181e',
  color: '#eee',
  cursor: 'pointer'
};

const cardStyle = {
  background: '#14151b',
  border: '1px solid #292a32',
  borderRadius: '16px',
  padding: '22px'
};
