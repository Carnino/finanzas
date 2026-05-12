'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Transaction, TransactionType } from '@/types/finance';
import { supabase } from '@/lib/supabase';

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

const normalize = (row: Transaction): Transaction => ({
  ...row,
  amount: Number(row.amount),
});

export interface NewTransaction {
  amount: number;
  type: TransactionType;
  category: string;
  description?: string;
}

export const useFinance = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    return toIsoDate(new Date(d.getFullYear(), d.getMonth(), 1));
  });
  const [endDate, setEndDate] = useState(() => toIsoDate(new Date()));

  const fetchTransactions = useCallback(async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (fetchError) throw fetchError;
      setTransactions((data ?? []).map(normalize));
      setError(null);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      console.error('Error fetching data:', message);
      setError(message);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTransactions();
  }, [fetchTransactions]);

  const filteredTransactions = useMemo(() => {
    const start = parseLocalDate(startDate);
    const end = parseLocalDate(endDate);
    end.setHours(23, 59, 59, 999);

    return transactions.filter((t) => {
      const d = new Date(t.date);
      return d >= start && d <= end;
    });
  }, [transactions, startDate, endDate]);

  const addTransaction = useCallback(async (transaction: NewTransaction) => {
    try {
      const { data, error: insertError } = await supabase
        .from('transactions')
        .insert([transaction])
        .select();

      if (insertError) throw insertError;
      if (data?.[0]) {
        const inserted = normalize(data[0] as Transaction);
        setTransactions((prev) => [inserted, ...prev]);
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      console.error('Error adding transaction:', message);
      setError(message);
      throw e;
    }
  }, []);

  const deleteTransaction = useCallback(async (id: string) => {
    const snapshot = transactions;
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    try {
      const { error: deleteError } = await supabase.from('transactions').delete().eq('id', id);
      if (deleteError) throw deleteError;
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      console.error('Error deleting transaction:', message);
      setError(message);
      setTransactions(snapshot);
    }
  }, [transactions]);

  const { totalIncome, totalExpenses } = useMemo(() => {
    let income = 0;
    let expenses = 0;
    for (const t of filteredTransactions) {
      if (t.type === 'income') income += t.amount;
      else expenses += t.amount;
    }
    return { totalIncome: income, totalExpenses: expenses };
  }, [filteredTransactions]);

  const totalBalance = totalIncome - totalExpenses;

  return {
    transactions: filteredTransactions,
    allTransactions: transactions,
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
    clearError: () => setError(null),
    refetch: fetchTransactions,
  };
};
