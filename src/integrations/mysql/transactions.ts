import { mysqlClient, Transaction } from './client';

export class TransactionService {
  // Получить все транзакции пользователя
  async getTransactions(userId: string): Promise<Transaction[]> {
    const sql = `
      SELECT * FROM transactions 
      WHERE user_id = ? 
      ORDER BY date DESC, created_at DESC
    `;
    return await mysqlClient.query<Transaction>(sql, [userId]);
  }

  // Получить транзакции за период
  async getTransactionsByDateRange(
    userId: string, 
    startDate: string, 
    endDate: string
  ): Promise<Transaction[]> {
    const sql = `
      SELECT * FROM transactions 
      WHERE user_id = ? AND date BETWEEN ? AND ?
      ORDER BY date DESC, created_at DESC
    `;
    return await mysqlClient.query<Transaction>(sql, [userId, startDate, endDate]);
  }

  // Получить транзакцию по ID
  async getTransactionById(id: string): Promise<Transaction | null> {
    const sql = 'SELECT * FROM transactions WHERE id = ?';
    return await mysqlClient.queryOne<Transaction>(sql, [id]);
  }

  // Создать новую транзакцию
  async createTransaction(transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>): Promise<Transaction> {
    const id = this.generateUUID();
    const now = new Date().toISOString();
    
    const sql = `
      INSERT INTO transactions (
        id, user_id, date, type, category, subcategory, amount, description,
        client_name, contract_amount, first_payment, installment_period, lump_sum,
        company, contract_status, termination_date, account_from, account_to,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      id, transaction.user_id, transaction.date, transaction.type, transaction.category,
      transaction.subcategory, transaction.amount, transaction.description,
      transaction.client_name, transaction.contract_amount, transaction.first_payment,
      transaction.installment_period, transaction.lump_sum, transaction.company,
      transaction.contract_status, transaction.termination_date, transaction.account_from,
      transaction.account_to, now, now
    ];

    await mysqlClient.query(sql, params);
    
    // Возвращаем созданную транзакцию
    const created = await this.getTransactionById(id);
    if (!created) {
      throw new Error('Failed to create transaction');
    }
    return created;
  }

  // Обновить транзакцию
  async updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction> {
    const now = new Date().toISOString();
    
    // Строим динамический SQL для обновления
    const fields = [];
    const values = [];
    
    Object.entries(updates).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'created_at' && value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });
    
    if (fields.length === 0) {
      throw new Error('No fields to update');
    }
    
    fields.push('updated_at = ?');
    values.push(now, id);
    
    const sql = `UPDATE transactions SET ${fields.join(', ')} WHERE id = ?`;
    await mysqlClient.query(sql, values);
    
    const updated = await this.getTransactionById(id);
    if (!updated) {
      throw new Error('Transaction not found after update');
    }
    return updated;
  }

  // Удалить транзакцию
  async deleteTransaction(id: string): Promise<boolean> {
    const sql = 'DELETE FROM transactions WHERE id = ?';
    const result = await mysqlClient.query(sql, [id]);
    return result.length > 0;
  }

  // Получить статистику по доходам и расходам
  async getFinancialStats(userId: string, startDate?: string, endDate?: string) {
    let whereClause = 'WHERE user_id = ?';
    const params: any[] = [userId];
    
    if (startDate && endDate) {
      whereClause += ' AND date BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }
    
    const sql = `
      SELECT 
        type,
        SUM(amount) as total,
        COUNT(*) as count
      FROM transactions 
      ${whereClause}
      GROUP BY type
    `;
    
    const results = await mysqlClient.query(sql, params);
    
    const stats = {
      totalIncome: 0,
      totalExpense: 0,
      incomeCount: 0,
      expenseCount: 0,
      profit: 0
    };
    
    results.forEach((row: any) => {
      if (row.type === 'income') {
        stats.totalIncome = parseFloat(row.total);
        stats.incomeCount = row.count;
      } else if (row.type === 'expense') {
        stats.totalExpense = parseFloat(row.total);
        stats.expenseCount = row.count;
      }
    });
    
    stats.profit = stats.totalIncome - stats.totalExpense;
    
    return stats;
  }

  // Получить клиентов с их статистикой
  async getClientsStats(userId: string) {
    const sql = `
      SELECT 
        client_name,
        COUNT(*) as transaction_count,
        SUM(amount) as total_amount,
        AVG(amount) as avg_amount,
        MIN(date) as first_transaction,
        MAX(date) as last_transaction
      FROM transactions 
      WHERE user_id = ? AND type = 'income' AND client_name IS NOT NULL
      GROUP BY client_name
      ORDER BY total_amount DESC
    `;
    
    return await mysqlClient.query(sql, [userId]);
  }

  // Генерация UUID
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

// Экспортируем экземпляр сервиса
export const transactionService = new TransactionService();
