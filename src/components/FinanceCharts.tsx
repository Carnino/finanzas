'use client';

import { useMemo } from 'react';
import { Transaction, formatCurrency } from '@/types/finance';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Props {
  transactions: Transaction[];
}

interface TooltipPayload {
  payload: { name: string; value: number };
}

const ChartTooltip = ({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) => {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div
      style={{
        background: 'rgba(0,0,0,0.85)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 12,
        backdropFilter: 'blur(10px)',
        padding: '0.5rem 0.75rem',
      }}
    >
      <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>{item.name}</div>
      <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{formatCurrency(item.value)}</div>
    </div>
  );
};

export const FinanceCharts = ({ transactions }: Props) => {
  const expenseData = useMemo(() => {
    const grouped = new Map<string, number>();
    for (const t of transactions) {
      if (t.type !== 'expense') continue;
      grouped.set(t.category, (grouped.get(t.category) ?? 0) + t.amount);
    }
    return Array.from(grouped, ([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [transactions]);

  if (expenseData.length === 0) return null;

  return (
    <div className="glass-card" style={{ marginBottom: '2rem' }}>
      <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '1.25rem' }}>Gastos por Categoría</h3>
      <div style={{ width: '100%', height: Math.max(180, expenseData.length * 36 + 20) }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={expenseData} layout="vertical" margin={{ left: 0, right: 20, top: 4, bottom: 4 }}>
            <XAxis type="number" hide />
            <YAxis
              dataKey="name"
              type="category"
              tick={{ fill: 'rgba(255,255,255,0.65)', fontSize: 12 }}
              width={110}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} content={<ChartTooltip />} />
            <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={18}>
              {expenseData.map((_, index) => (
                <Cell key={index} fill={`hsla(160, 75%, ${Math.max(35, 55 - index * 4)}%, 0.85)`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
