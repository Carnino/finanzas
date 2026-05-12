'use client';

import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { formatCurrency } from '@/types/finance';

interface Props {
  balance: number;
  income: number;
  expenses: number;
}

const cardGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '1rem',
  marginBottom: '2rem',
};

const labelRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '0.75rem',
};

const iconWrap = (bg: string): React.CSSProperties => ({
  background: bg,
  padding: '0.5rem',
  borderRadius: '12px',
  display: 'flex',
});

export const DashboardCards = ({ balance, income, expenses }: Props) => {
  return (
    <div style={cardGrid}>
      <div className="glass-card">
        <div style={labelRow}>
          <span style={{ opacity: 0.7, fontSize: '0.85rem' }}>Balance</span>
          <div style={iconWrap('rgba(255,255,255,0.08)')}>
            <Wallet size={18} color="var(--primary)" />
          </div>
        </div>
        <h2
          style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: balance < 0 ? 'var(--expense)' : 'var(--foreground)',
          }}
        >
          {formatCurrency(balance)}
        </h2>
      </div>

      <div className="glass-card">
        <div style={labelRow}>
          <span style={{ opacity: 0.7, fontSize: '0.85rem' }}>Ingresos</span>
          <div style={iconWrap('rgba(16, 185, 129, 0.12)')}>
            <TrendingUp size={18} color="var(--income)" />
          </div>
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--income)', letterSpacing: '-0.02em' }}>
          {formatCurrency(income)}
        </h2>
      </div>

      <div className="glass-card">
        <div style={labelRow}>
          <span style={{ opacity: 0.7, fontSize: '0.85rem' }}>Egresos</span>
          <div style={iconWrap('rgba(239, 68, 68, 0.12)')}>
            <TrendingDown size={18} color="var(--expense)" />
          </div>
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--expense)', letterSpacing: '-0.02em' }}>
          {formatCurrency(expenses)}
        </h2>
      </div>
    </div>
  );
};
