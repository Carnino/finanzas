'use client';

import { Calendar } from 'lucide-react';
import { useMemo } from 'react';

interface Props {
  startDate: string;
  endDate: string;
  onStartChange: (date: string) => void;
  onEndChange: (date: string) => void;
}

const toIsoDate = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

type Preset = { label: string; range: () => [string, string] };

const presets: Preset[] = [
  {
    label: 'Hoy',
    range: () => {
      const t = toIsoDate(new Date());
      return [t, t];
    },
  },
  {
    label: '7d',
    range: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 6);
      return [toIsoDate(start), toIsoDate(end)];
    },
  },
  {
    label: '30d',
    range: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 29);
      return [toIsoDate(start), toIsoDate(end)];
    },
  },
  {
    label: 'Mes',
    range: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      return [toIsoDate(start), toIsoDate(now)];
    },
  },
  {
    label: 'Año',
    range: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), 0, 1);
      return [toIsoDate(start), toIsoDate(now)];
    },
  },
];

export const DateRangeSelector = ({ startDate, endDate, onStartChange, onEndChange }: Props) => {
  const activePreset = useMemo(() => {
    return presets.find((p) => {
      const [s, e] = p.range();
      return s === startDate && e === endDate;
    })?.label;
  }, [startDate, endDate]);

  const handleStart = (value: string) => {
    onStartChange(value);
    if (endDate && value > endDate) onEndChange(value);
  };

  const handleEnd = (value: string) => {
    onEndChange(value);
    if (startDate && value < startDate) onStartChange(value);
  };

  return (
    <div className="glass-card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <Calendar size={16} color="var(--primary)" />
        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Rango de Fechas</span>
      </div>

      <div className="chips" style={{ marginBottom: '1rem' }}>
        {presets.map((p) => {
          const isActive = activePreset === p.label;
          return (
            <button
              key={p.label}
              type="button"
              onClick={() => {
                const [s, e] = p.range();
                onStartChange(s);
                onEndChange(e);
              }}
              className={isActive ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '0.45rem 0.9rem', whiteSpace: 'nowrap', fontSize: '0.8rem' }}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <label style={{ fontSize: '0.7rem', opacity: 0.5, marginLeft: '0.25rem' }}>Desde</label>
          <input
            type="date"
            value={startDate}
            max={endDate}
            onChange={(e) => handleStart(e.target.value)}
            style={{ fontSize: '0.85rem', padding: '0.55rem 0.75rem' }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <label style={{ fontSize: '0.7rem', opacity: 0.5, marginLeft: '0.25rem' }}>Hasta</label>
          <input
            type="date"
            value={endDate}
            min={startDate}
            onChange={(e) => handleEnd(e.target.value)}
            style={{ fontSize: '0.85rem', padding: '0.55rem 0.75rem' }}
          />
        </div>
      </div>
    </div>
  );
};
