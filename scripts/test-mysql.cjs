const mysql = require('mysql2/promise');

// Конфигурация MySQL
const config = {
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

async function testConnection() {
  console.log('🧪 Тестирование подключения к MySQL...');
  
  let connection;
  
  try {
    // Подключаемся к MySQL
    connection = await mysql.createConnection(config);
    console.log('✅ Подключение к MySQL установлено');
    
    // Проверяем таблицы
    const [tables] = await connection.query('SHOW TABLES');
    console.log('📊 Таблицы в базе данных:', tables.map(t => Object.values(t)[0]));
    
    // Проверяем структуру таблицы transactions
    const [columns] = await connection.query('DESCRIBE transactions');
    console.log('📋 Структура таблицы transactions:');
    columns.forEach(col => {
      console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'}`);
    });
    
    // Проверяем структуру таблицы users
    const [userColumns] = await connection.query('DESCRIBE users');
    console.log('👤 Структура таблицы users:');
    userColumns.forEach(col => {
      console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'}`);
    });
    
    // Тестируем вставку тестовой записи
    console.log('🔬 Тестирование вставки данных...');
    
    const testUserId = 'test-user-' + Date.now();
    const testTransactionId = 'test-transaction-' + Date.now();
    
    // Вставляем тестового пользователя
    await connection.query(
      'INSERT INTO users (id, email, created_at, updated_at) VALUES (?, ?, NOW(), NOW())',
      [testUserId, 'test@example.com']
    );
    console.log('✅ Тестовый пользователь создан');
    
    // Вставляем тестовую транзакцию
    await connection.query(
      `INSERT INTO transactions (
        id, user_id, date, type, category, amount, description, company, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [testTransactionId, testUserId, '2024-01-01', 'income', 'Тест', 1000, 'Тестовая транзакция', 'Спасение']
    );
    console.log('✅ Тестовая транзакция создана');
    
    // Проверяем данные
    const [transactions] = await connection.query(
      'SELECT * FROM transactions WHERE id = ?',
      [testTransactionId]
    );
    console.log('📊 Тестовая транзакция:', transactions[0]);
    
    // Удаляем тестовые данные
    await connection.query('DELETE FROM transactions WHERE id = ?', [testTransactionId]);
    await connection.query('DELETE FROM users WHERE id = ?', [testUserId]);
    console.log('🧹 Тестовые данные удалены');
    
    console.log('🎉 Все тесты прошли успешно!');
    
  } catch (error) {
    console.error('❌ Ошибка при тестировании:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Запускаем тест
testConnection().catch(console.error);
