import { Transaction } from "@/components/TransactionTable";
import { transactionService } from "@/integrations/mysql/transactions";

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

// Функции для работы с транзакциями через MySQL
export const getTransactions = async (userId: string): Promise<Transaction[]> => {
  return await transactionService.getTransactions(userId);
};

export const getTransactionsByDateRange = async (
  userId: string, 
  startDate: string, 
  endDate: string
): Promise<Transaction[]> => {
  return await transactionService.getTransactionsByDateRange(userId, startDate, endDate);
};

export const createTransaction = async (transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>): Promise<Transaction> => {
  return await transactionService.createTransaction(transaction);
};

export const updateTransaction = async (id: string, updates: Partial<Transaction>): Promise<Transaction> => {
  return await transactionService.updateTransaction(id, updates);
};

export const deleteTransaction = async (id: string): Promise<boolean> => {
  return await transactionService.deleteTransaction(id);
};

export const getFinancialStats = async (userId: string, startDate?: string, endDate?: string) => {
  return await transactionService.getFinancialStats(userId, startDate, endDate);
};

export const getClientsStats = async (userId: string) => {
  return await transactionService.getClientsStats(userId);
};
