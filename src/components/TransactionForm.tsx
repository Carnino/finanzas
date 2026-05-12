'use client';

import { useEffect, useRef, useState } from 'react';
import { CATEGORIES, TransactionType } from '@/types/finance';
import { Plus, X } from 'lucide-react';
import type { NewTransaction } from '@/hooks/useFinance';

interface Props {
  onAdd: (data: NewTransaction) => void | Promise<void>;
}

export const TransactionForm = ({ onAdd }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<string>(CATEGORIES.expense[0]);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const amountRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    const t = setTimeout(() => amountRef.current?.focus(), 100);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
      clearTimeout(t);
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = Number(amount);
    if (!amount || !Number.isFinite(value) || value <= 0) return;
    setSubmitting(true);
    try {
      await onAdd({
        amount: value,
        type,
        category,
        description: description.trim() || undefined,
      });
      setAmount('');
      setDescription('');
      setIsOpen(false);
    } catch {
      // error surfaces via useFinance state
    } finally {
      setSubmitting(false);
    }
  };

  const switchType = (next: TransactionType) => {
    setType(next);
    setCategory(CATEGORIES[next][0]);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Nueva transacción"
        className="btn-primary"
        style={{
          position: 'fixed',
          bottom: 'calc(var(--nav-height) + env(safe-area-inset-bottom) + 1rem)',
          right: '1.25rem',
          borderRadius: '50%',
          width: 60,
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 30px rgba(16, 185, 129, 0.45)',
          zIndex: 100,
        }}
      >
        <Plus size={28} />
      </button>

      {isOpen && (
        <div
          className="modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="form-title"
        >
          <div className="glass modal-sheet">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
              <h2 id="form-title" style={{ fontSize: '1.4rem', fontWeight: 700 }}>
                Nueva Transacción
              </h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Cerrar"
                style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 4 }}
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div
                role="tablist"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.35rem',
                  background: 'var(--surface)',
                  padding: '0.25rem',
                  borderRadius: 12,
                }}
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={type === 'expense'}
                  onClick={() => switchType('expense')}
                  style={{
                    padding: '0.7rem',
                    borderRadius: 10,
                    border: 'none',
                    cursor: 'pointer',
                    background: type === 'expense' ? 'var(--expense)' : 'transparent',
                    color: type === 'expense' ? '#fff' : 'inherit',
                    fontWeight: 600,
                    transition: 'background 0.2s',
                  }}
                >
                  Egreso
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={type === 'income'}
                  onClick={() => switchType('income')}
                  style={{
                    padding: '0.7rem',
                    borderRadius: 10,
                    border: 'none',
                    cursor: 'pointer',
                    background: type === 'income' ? 'var(--income)' : 'transparent',
                    color: type === 'income' ? '#000' : 'inherit',
                    fontWeight: 600,
                    transition: 'background 0.2s',
                  }}
                >
                  Ingreso
                </button>
              </div>

              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <span style={{ opacity: 0.7, fontSize: '0.85rem' }}>Monto</span>
                <input
                  ref={amountRef}
                  type="number"
                  inputMode="decimal"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0.01"
                  step="0.01"
                  required
                  style={{ fontSize: '1.5rem', fontWeight: 700 }}
                />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <span style={{ opacity: 0.7, fontSize: '0.85rem' }}>Categoría</span>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  {CATEGORIES[type].map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <span style={{ opacity: 0.7, fontSize: '0.85rem' }}>Descripción (Opcional)</span>
                <input
                  type="text"
                  placeholder="Ej: Almuerzo con amigos"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={120}
                />
              </label>

              <button type="submit" className="btn-primary" disabled={submitting} style={{ marginTop: '0.5rem', padding: '0.95rem' }}>
                {submitting ? 'Guardando…' : 'Guardar Transacción'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
