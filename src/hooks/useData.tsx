import { useState, useEffect } from 'react';
import { Transaction } from '@/components/TransactionTable';
import { isMySQL } from '@/config/database';
import { getTransactions as getMySQLTransactions, getFinancialStats as getMySQLStats } from '@/lib/mysqlData';
import { useAuth } from './useAuthMySQL';

// Импорты для Supabase (если нужно)
// import { supabase } from '@/integrations/supabase/client';

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

      if (isMySQL()) {
        const data = await getMySQLTransactions(user.id);
        setTransactions(data);
      } else {
        // Здесь будет код для Supabase
        // const { data, error } = await supabase
        //   .from('transactions')
        //   .select('*')
        //   .eq('user_id', user.id)
        //   .order('date', { ascending: false });
        
        // if (error) throw error;
        // setTransactions(data || []);
        setTransactions([]);
      }
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

      if (isMySQL()) {
        const data = await getMySQLStats(user.id, startDate, endDate);
        setStats(data);
      } else {
        // Здесь будет код для Supabase
        setStats({
          totalIncome: 0,
          totalExpense: 0,
          incomeCount: 0,
          expenseCount: 0,
          profit: 0
        });
      }
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
