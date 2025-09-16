import { mysqlClient } from './client';

export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export class AuthService {
  // Создать пользователя
  async createUser(email: string): Promise<User> {
    const id = this.generateUUID();
    const now = new Date().toISOString();
    
    const sql = `
      INSERT INTO users (id, email, created_at, updated_at) 
      VALUES (?, ?, ?, ?)
    `;
    
    await mysqlClient.query(sql, [id, email, now, now]);
    
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new Error('Failed to create user');
    }
    return user;
  }

  // Получить пользователя по email
  async getUserByEmail(email: string): Promise<User | null> {
    const sql = 'SELECT * FROM users WHERE email = ?';
    return await mysqlClient.queryOne<User>(sql, [email]);
  }

  // Получить пользователя по ID
  async getUserById(id: string): Promise<User | null> {
    const sql = 'SELECT * FROM users WHERE id = ?';
    return await mysqlClient.queryOne<User>(sql, [id]);
  }

  // Обновить пользователя
  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const now = new Date().toISOString();
    
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
    
    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    await mysqlClient.query(sql, values);
    
    const updated = await this.getUserById(id);
    if (!updated) {
      throw new Error('User not found after update');
    }
    return updated;
  }

  // Удалить пользователя
  async deleteUser(id: string): Promise<boolean> {
    // Сначала удаляем все транзакции пользователя
    await mysqlClient.query('DELETE FROM transactions WHERE user_id = ?', [id]);
    
    // Затем удаляем пользователя
    const sql = 'DELETE FROM users WHERE id = ?';
    const result = await mysqlClient.query(sql, [id]);
    return result.length > 0;
  }

  // Проверить существование пользователя
  async userExists(email: string): Promise<boolean> {
    const user = await this.getUserByEmail(email);
    return user !== null;
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
export const authService = new AuthService();
