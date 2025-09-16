import mysql from 'mysql2/promise';

// Конфигурация подключения к MySQL
const dbConfig = {
  host: process.env.MYSQL_HOST || '5.129.252.214',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  user: process.env.MYSQL_USER || 'gen_user',
  password: process.env.MYSQL_PASSWORD || 'dfguZ_H:+>$^~5',
  database: process.env.MYSQL_DATABASE || 'default_db',
  charset: 'utf8mb4',
  timezone: '+00:00',
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  ssl: {
    rejectUnauthorized: false
  }
};

// Создание пула подключений
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Интерфейс для транзакций
export interface Transaction {
  id: string;
  user_id: string;
  date: string;
  type: 'income' | 'expense';
  category: string;
  subcategory?: string | null;
  amount: number;
  description?: string | null;
  client_name?: string | null;
  contract_amount?: number | null;
  first_payment?: number | null;
  installment_period?: number | null;
  lump_sum?: number | null;
  company: string;
  contract_status?: string | null;
  termination_date?: string | null;
  account_from?: string | null;
  account_to?: string | null;
  created_at: string;
  updated_at: string;
}

// Класс для работы с базой данных
export class MySQLClient {
  private pool: mysql.Pool;

  constructor() {
    this.pool = pool;
  }

  // Получить подключение из пула
  async getConnection() {
    return await this.pool.getConnection();
  }

  // Выполнить запрос
  async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
    const connection = await this.getConnection();
    try {
      const [rows] = await connection.execute(sql, params);
      return rows as T[];
    } finally {
      connection.release();
    }
  }

  // Выполнить запрос с возвратом одного результата
  async queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
    const results = await this.query<T>(sql, params);
    return results.length > 0 ? results[0] : null;
  }

  // Выполнить транзакцию
  async transaction<T>(callback: (connection: mysql.PoolConnection) => Promise<T>): Promise<T> {
    const connection = await this.getConnection();
    try {
      await connection.beginTransaction();
      const result = await callback(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Закрыть пул подключений
  async close() {
    await this.pool.end();
  }
}

// Создаем экземпляр клиента
export const mysqlClient = new MySQLClient();

// Экспортируем пул для прямого использования
export { pool };
