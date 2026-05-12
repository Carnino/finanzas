'use client';

import { useFinance } from '@/hooks/useFinance';
import { DashboardCards } from '@/components/DashboardCards';
import { TransactionForm } from '@/components/TransactionForm';
import { TransactionList } from '@/components/TransactionList';
import { FinanceCharts } from '@/components/FinanceCharts';
import { DateRangeSelector } from '@/components/DateRangeSelector';

export default function Home() {
  const {
    transactions,
    addTransaction,
    deleteTransaction,
    totalBalance,
    totalIncome,
    totalExpenses,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    isLoaded,
    error,
    clearError,
  } = useFinance();

  return (
    <main style={{ maxWidth: 820, margin: '0 auto', padding: '2rem 1rem' }}>
      <header
        style={{
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Hola 👋</h1>
          <p style={{ opacity: 0.6, fontSize: '0.9rem', marginTop: 2 }}>
            Aquí tienes el resumen de tus finanzas.
          </p>
        </div>
        <div
          aria-hidden
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary), #34d399)',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.35)',
            flexShrink: 0,
          }}
        />
      </header>

      {error && (
        <div
          role="alert"
          className="glass-card"
          style={{
            marginBottom: '1.5rem',
            borderColor: 'rgba(239, 68, 68, 0.4)',
            background: 'rgba(239, 68, 68, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <span style={{ fontSize: '0.9rem' }}>⚠️ {error}</span>
          <button type="button" onClick={clearError} className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
            Cerrar
          </button>
        </div>
      )}

      <DateRangeSelector
        startDate={startDate}
        endDate={endDate}
        onStartChange={setStartDate}
        onEndChange={setEndDate}
      />

      {!isLoaded ? (
        <SkeletonState />
      ) : (
        <>
          <DashboardCards balance={totalBalance} income={totalIncome} expenses={totalExpenses} />
          <FinanceCharts transactions={transactions} />
          <TransactionList transactions={transactions} onDelete={deleteTransaction} />
        </>
      )}

      <TransactionForm onAdd={addTransaction} />
    </main>
  );
}

const SkeletonState = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
        marginBottom: '1rem',
      }}
    >
      {[0, 1, 2].map((i) => (
        <div key={i} className="glass-card" style={{ height: 100, opacity: 0.4 }} />
      ))}
    </div>
    <div className="glass-card" style={{ height: 200, opacity: 0.4 }} />
  </div>
);
