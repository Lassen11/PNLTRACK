import { useState, useEffect } from 'react';
import { Transaction } from '@/components/TransactionTable';
import { getTransactions, getFinancialStats } from '@/lib/supabaseData';
import { useAuth } from './useAuth';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchTransactions = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await getTransactions(user.id);
      setTransactions(data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err instanceof Error ? err.message : 'Ошибка загрузки транзакций');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  return {
    transactions,
    loading,
    error,
    refetch: fetchTransactions
  };
};

export const useFinancialStats = (startDate?: string, endDate?: string) => {
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    incomeCount: 0,
    expenseCount: 0,
    profit: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchStats = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await getFinancialStats(user.id, startDate, endDate);
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError(err instanceof Error ? err.message : 'Ошибка загрузки статистики');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user, startDate, endDate]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
};
