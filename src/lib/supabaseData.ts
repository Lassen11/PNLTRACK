import { Transaction } from "@/components/TransactionTable";
import { supabase } from "@/integrations/supabase/client";

export const calculateKPIs = (transactions: Transaction[]) => {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const withdrawals = transactions
    .filter(t => t.type === 'expense' && t.category === 'Вывод средств')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const expenses = transactions
    .filter(t => t.type === 'expense' && t.category !== 'Вывод средств')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const profit = income - expenses;
  const moneyInProject = profit - withdrawals;
  const margin = income > 0 ? (profit / income) * 100 : 0;
  
  return {
    income,
    expenses,
    profit,
    margin,
    withdrawals,
    moneyInProject
  };
};

// Функция для получения транзакций из Supabase
export const getTransactions = async (userId: string): Promise<Transaction[]> => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getTransactions:', error);
    throw error;
  }
};

// Функция для получения финансовой статистики из Supabase
export const getFinancialStats = async (
  userId: string, 
  startDate?: string, 
  endDate?: string
): Promise<{
  totalIncome: number;
  totalExpense: number;
  incomeCount: number;
  expenseCount: number;
  profit: number;
}> => {
  try {
    let query = supabase
      .from('transactions')
      .select('type, amount')
      .eq('user_id', userId);

    if (startDate) {
      query = query.gte('date', startDate);
    }
    if (endDate) {
      query = query.lte('date', endDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching financial stats:', error);
      throw error;
    }

    const transactions = data || [];
    
    const incomeTransactions = transactions.filter(t => t.type === 'income');
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    
    const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
    const profit = totalIncome - totalExpense;

    return {
      totalIncome,
      totalExpense,
      incomeCount: incomeTransactions.length,
      expenseCount: expenseTransactions.length,
      profit
    };
  } catch (error) {
    console.error('Error in getFinancialStats:', error);
    throw error;
  }
};

// Функция для добавления транзакции в Supabase
export const addTransaction = async (transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>): Promise<Transaction> => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .insert([transaction])
      .select()
      .single();

    if (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in addTransaction:', error);
    throw error;
  }
};

// Функция для обновления транзакции в Supabase
export const updateTransaction = async (id: string, updates: Partial<Transaction>): Promise<Transaction> => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in updateTransaction:', error);
    throw error;
  }
};

// Функция для удаления транзакции из Supabase
export const deleteTransaction = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deleteTransaction:', error);
    throw error;
  }
};