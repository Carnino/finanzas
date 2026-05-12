'use client';

import { useState, useMemo } from 'react';
import { useFinance } from '@/hooks/useFinance';
import { DateRangeSelector } from '@/components/DateRangeSelector';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis } from 'recharts';
import { CATEGORIES, formatCurrency } from '@/types/finance';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#84cc16'];

interface TooltipPayload {
  name: string;
  value: number;
  payload?: { name: string; value: number };
}

const ChartTooltip = ({ active, payload, label }: { active?: boolean; payload?: TooltipPayload[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  const p = payload[0];
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
      <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>{label ?? p.payload?.name ?? p.name}</div>
      <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{formatCurrency(p.value)}</div>
    </div>
  );
};

const toIsoDate = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const parseLocalDate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export default function StatsPage() {
  const { transactions, startDate, endDate, setStartDate, setEndDate, isLoaded } = useFinance();
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');

  const filteredData = useMemo(() => {
    if (selectedCategory === 'Todas') return transactions;
    return transactions.filter((t) => t.category === selectedCategory);
  }, [transactions, selectedCategory]);

  const pieData = useMemo(() => {
    const grouped = new Map<string, number>();
    for (const t of transactions) {
      if (t.type !== 'expense') continue;
      grouped.set(t.category, (grouped.get(t.category) ?? 0) + t.amount);
    }
    return Array.from(grouped, ([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [transactions]);

  const totalExpenses = useMemo(() => pieData.reduce((a, p) => a + p.value, 0), [pieData]);

  const trendData = useMemo(() => {
    const start = parseLocalDate(startDate);
    const end = parseLocalDate(endDate);
    const diffDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);

    type Bucket = 'day' | 'week' | 'month';
    const bucket: Bucket = diffDays <= 31 ? 'day' : diffDays <= 180 ? 'week' : 'month';

    const buckets = new Map<string, { label: string; total: number }>();

    if (bucket === 'day') {
      for (let i = 0; i < diffDays; i++) {
        const d = new Date(start);
        d.setDate(d.getDate() + i);
        buckets.set(toIsoDate(d), {
          label: d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' }),
          total: 0,
        });
      }
    } else if (bucket === 'week') {
      const cursor = new Date(start);
      while (cursor <= end) {
        const weekStart = new Date(cursor);
        const weekEnd = new Date(cursor);
        weekEnd.setDate(weekEnd.getDate() + 6);
        buckets.set(toIsoDate(weekStart), {
          label: weekStart.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' }),
          total: 0,
        });
        cursor.setDate(cursor.getDate() + 7);
      }
    } else {
      const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
      while (cursor <= end) {
        const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}`;
        buckets.set(key, {
          label: cursor.toLocaleDateString('es-AR', { month: 'short', year: '2-digit' }),
          total: 0,
        });
        cursor.setMonth(cursor.getMonth() + 1);
      }
    }

    const keyFor = (date: Date): string => {
      if (bucket === 'day') return toIsoDate(date);
      if (bucket === 'week') {
        const diff = Math.floor((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        const weekIndex = Math.floor(diff / 7);
        const weekStart = new Date(start);
        weekStart.setDate(start.getDate() + weekIndex * 7);
        return toIsoDate(weekStart);
      }
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    };

    for (const t of filteredData) {
      if (t.type !== 'expense') continue;
      const d = new Date(t.date);
      d.setHours(0, 0, 0, 0);
      const k = keyFor(d);
      const slot = buckets.get(k);
      if (slot) slot.total += t.amount;
    }

    return Array.from(buckets.values());
  }, [filteredData, startDate, endDate]);

  return (
    <main style={{ maxWidth: 820, margin: '0 auto', padding: '2rem 1rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Estadísticas 📊</h1>
        <p style={{ opacity: 0.6, fontSize: '0.9rem', marginTop: 2 }}>Analiza tus hábitos de gasto.</p>
      </header>

      <DateRangeSelector
        startDate={startDate}
        endDate={endDate}
        onStartChange={setStartDate}
        onEndChange={setEndDate}
      />

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', opacity: 0.7, fontSize: '0.85rem', marginBottom: '0.75rem' }}>
          Filtrar por Categoría
        </label>
        <div className="chips">
          <button
            type="button"
            onClick={() => setSelectedCategory('Todas')}
            className={selectedCategory === 'Todas' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '0.45rem 0.9rem', whiteSpace: 'nowrap', fontSize: '0.8rem' }}
          >
            Todas
          </button>
          {CATEGORIES.expense.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '0.45rem 0.9rem', whiteSpace: 'nowrap', fontSize: '0.8rem' }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>Distribución de Gastos</h3>
          <span style={{ fontSize: '0.85rem', opacity: 0.6 }}>{formatCurrency(totalExpenses)}</span>
        </div>
        {pieData.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 0', opacity: 0.5, fontSize: '0.9rem' }}>
            Sin gastos en este periodo.
          </div>
        ) : (
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0.25)" strokeWidth={1} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={32}
                  wrapperStyle={{ fontSize: '0.78rem' }}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '1rem' }}>
          Gastos en el tiempo · <span style={{ opacity: 0.6, fontWeight: 500 }}>{selectedCategory}</span>
        </h3>
        {trendData.every((d) => d.total === 0) ? (
          <div style={{ textAlign: 'center', padding: '2rem 0', opacity: 0.5, fontSize: '0.9rem' }}>
            Sin datos para este rango.
          </div>
        ) : (
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ left: 4, right: 4, top: 4, bottom: 4 }}>
                <XAxis
                  dataKey="label"
                  tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} content={<ChartTooltip />} />
                <Bar dataKey="total" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {!isLoaded && (
        <div style={{ opacity: 0.5, textAlign: 'center', fontSize: '0.85rem', padding: '1rem' }}>Cargando…</div>
      )}
    </main>
  );
}
