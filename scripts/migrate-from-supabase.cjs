const mysql = require('mysql2/promise');
const { createClient } = require('@supabase/supabase-js');

// Конфигурация Supabase
const supabaseUrl = 'https://rdpxbbddqxwbufzqozqz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkcHhiYmRkcXh3YnVmenFvenF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNTc2ODgsImV4cCI6MjA3MTYzMzY4OH0.plxTYORPFZPTZU3rePIyU2WR_mHh47cvSrakpJEDa8I';

// Конфигурация MySQL
const mysqlConfig = {
  host: '5.129.252.214',
  port: 3306,
  user: 'gen_user',
  password: 'dfguZ_H:+>$^~5',
  database: 'default_db',
  charset: 'utf8mb4',
  ssl: {
    rejectUnauthorized: false
  }
};

async function migrateData() {
  console.log('🚀 Начинаем миграцию данных из Supabase в MySQL...');
  
  // Создаем клиенты
  const supabase = createClient(supabaseUrl, supabaseKey);
  const connection = await mysql.createConnection(mysqlConfig);
  
  try {
    // 1. Миграция транзакций (пользователи создаются автоматически)
    console.log('💰 Мигрируем транзакции...');
    const { data: transactions, error: transactionsError } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (transactionsError) {
      console.error('Ошибка при получении транзакций:', transactionsError);
      return;
    }
    
    if (transactions && transactions.length > 0) {
      // Сначала создаем пользователей из транзакций
      const uniqueUserIds = [...new Set(transactions.map(t => t.user_id))];
      console.log(`👤 Создаем ${uniqueUserIds.length} пользователей...`);
      
      for (const userId of uniqueUserIds) {
        await connection.query(
          `INSERT IGNORE INTO users (id, email, created_at, updated_at) VALUES (?, ?, NOW(), NOW())`,
          [userId, `user-${userId}@migrated.com`]
        );
      }
      console.log(`✅ Создано ${uniqueUserIds.length} пользователей`);
      
      // Теперь мигрируем транзакции
      for (const transaction of transactions) {
        await connection.query(
          `INSERT INTO transactions (
            id, user_id, date, type, category, subcategory, amount, description,
            client_name, contract_amount, first_payment, installment_period, lump_sum,
            company, contract_status, termination_date, account_from, account_to,
            created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            user_id = VALUES(user_id),
            date = VALUES(date),
            type = VALUES(type),
            category = VALUES(category),
            subcategory = VALUES(subcategory),
            amount = VALUES(amount),
            description = VALUES(description),
            client_name = VALUES(client_name),
            contract_amount = VALUES(contract_amount),
            first_payment = VALUES(first_payment),
            installment_period = VALUES(installment_period),
            lump_sum = VALUES(lump_sum),
            company = VALUES(company),
            contract_status = VALUES(contract_status),
            termination_date = VALUES(termination_date),
            account_from = VALUES(account_from),
            account_to = VALUES(account_to),
            updated_at = VALUES(updated_at)`,
          [
            transaction.id,
            transaction.user_id,
            transaction.date,
            transaction.type,
            transaction.category,
            transaction.subcategory,
            transaction.amount,
            transaction.description,
            transaction.client_name,
            transaction.contract_amount,
            transaction.first_payment,
            transaction.installment_period,
            transaction.lump_sum,
            transaction.company,
            transaction.contract_status,
            transaction.termination_date,
            transaction.account_from,
            transaction.account_to,
            transaction.created_at,
            transaction.updated_at
          ]
        );
      }
      console.log(`✅ Мигрировано ${transactions.length} транзакций`);
    }
    
    // 2. Проверяем результаты
    console.log('🔍 Проверяем результаты миграции...');
    
    const [userCount] = await connection.execute('SELECT COUNT(*) as count FROM users');
    const [transactionCount] = await connection.execute('SELECT COUNT(*) as count FROM transactions');
    
    console.log(`📊 Итоги миграции:`);
    console.log(`   - Пользователей: ${userCount[0].count}`);
    console.log(`   - Транзакций: ${transactionCount[0].count}`);
    
    console.log('🎉 Миграция завершена успешно!');
    
  } catch (error) {
    console.error('❌ Ошибка при миграции:', error);
  } finally {
    await connection.end();
  }
}

// Запускаем миграцию
migrateData().catch(console.error);
