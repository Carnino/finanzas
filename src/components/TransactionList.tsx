'use client';

import { useEffect, useState } from 'react';
import { Transaction, CATEGORY_ICONS, formatCurrency } from '@/types/finance';
import { Trash2, AlertTriangle, Inbox } from 'lucide-react';

interface Props {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const dateFormatter = new Intl.DateTimeFormat('es-AR', {
  day: 'numeric',
  month: 'short',
});

export const TransactionList = ({ transactions, onDelete }: Props) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!deletingId) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDeletingId(null);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [deletingId]);

  const handleConfirmDelete = () => {
    if (deletingId) {
      onDelete(deletingId);
      setDeletingId(null);
    }
  };

  if (transactions.length === 0) {
    return (
      <div
        className="glass-card"
        style={{
          textAlign: 'center',
          padding: '3rem 1.5rem',
          opacity: 0.7,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.75rem',
        }}
      >
        <Inbox size={32} style={{ opacity: 0.5 }} />
        <p style={{ fontWeight: 600 }}>Sin movimientos</p>
        <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>Agrega tu primera transacción con el botón +.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingBottom: '5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Actividad Reciente</h3>
        <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>{transactions.length} movimientos</span>
      </div>

      {transactions.map((t) => {
        const isIncome = t.type === 'income';
        return (
          <div
            key={t.id}
            className="glass-card"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.9rem 1.1rem',
              gap: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', gap: '0.9rem', alignItems: 'center', minWidth: 0, flex: 1 }}>
              <div
                aria-hidden
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: isIncome ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  flexShrink: 0,
                }}
              >
                {CATEGORY_ICONS[t.category] ?? (isIncome ? '💰' : '💸')}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{t.category}</p>
                {t.description && (
                  <p
                    style={{
                      fontSize: '0.8rem',
                      opacity: 0.6,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {t.description}
                  </p>
                )}
                <p style={{ fontSize: '0.72rem', opacity: 0.4 }}>{dateFormatter.format(new Date(t.date))}</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
              <span
                style={{
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  color: isIncome ? 'var(--income)' : 'var(--expense)',
                  whiteSpace: 'nowrap',
                }}
              >
                {isIncome ? '+' : '-'}
                {formatCurrency(t.amount)}
              </span>
              <button
                type="button"
                onClick={() => setDeletingId(t.id)}
                aria-label={`Eliminar ${t.category}`}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--expense)',
                  cursor: 'pointer',
                  opacity: 0.55,
                  padding: 6,
                  borderRadius: 8,
                  display: 'flex',
                }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        );
      })}

      {deletingId && (
        <div
          className="modal-backdrop"
          style={{ alignItems: 'center' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setDeletingId(null);
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
        >
          <div className="glass modal-centered" style={{ textAlign: 'center' }}>
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                color: 'var(--expense)',
              }}
            >
              <AlertTriangle size={28} />
            </div>
            <h2 id="confirm-title" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              ¿Borrar transacción?
            </h2>
            <p style={{ opacity: 0.7, marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Esta acción no se puede deshacer.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button type="button" onClick={() => setDeletingId(null)} className="btn-secondary">
                Cancelar
              </button>
              <button type="button" onClick={handleConfirmDelete} className="btn-danger">
                Borrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
