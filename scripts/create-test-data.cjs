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

async function createTestData() {
  console.log('🧪 Создание тестовых данных для демонстрации...');
  
  let connection;
  
  try {
    connection = await mysql.createConnection(config);
    console.log('✅ Подключение к MySQL установлено');
    
    // Создаем тестового пользователя
    const testUserId = 'test-user-' + Date.now();
    const now = new Date().toISOString();
    
    await connection.query(
      'INSERT INTO users (id, email, created_at, updated_at) VALUES (?, ?, ?, ?)',
      [testUserId, 'test@pnltrack.com', now, now]
    );
    console.log('✅ Тестовый пользователь создан');
    
    // Создаем тестовые транзакции
    const testTransactions = [
      {
        id: 'tx-1-' + Date.now(),
        user_id: testUserId,
        date: '2024-01-15',
        type: 'income',
        category: 'Продажи',
        subcategory: 'Консультации',
        amount: 50000,
        description: 'Консультация по недвижимости',
        client_name: 'Иванов Иван Иванович',
        contract_amount: 100000,
        first_payment: 20000,
        installment_period: 4,
        lump_sum: 20000,
        company: 'Спасение',
        account_to: 'Расчетный счет',
        created_at: now,
        updated_at: now
      },
      {
        id: 'tx-2-' + Date.now(),
        user_id: testUserId,
        date: '2024-01-16',
        type: 'expense',
        category: 'Зарплата Генерального Директора',
        subcategory: 'Оклад',
        amount: 30000,
        description: 'Зарплата за январь',
        company: 'Спасение',
        account_from: 'Расчетный счет',
        created_at: now,
        updated_at: now
      },
      {
        id: 'tx-3-' + Date.now(),
        user_id: testUserId,
        date: '2024-01-17',
        type: 'income',
        category: 'Услуги',
        subcategory: 'Агентские услуги',
        amount: 25000,
        description: 'Агентские услуги по сделке',
        client_name: 'Петров Петр Петрович',
        company: 'Спасение',
        account_to: 'Касса',
        created_at: now,
        updated_at: now
      },
      {
        id: 'tx-4-' + Date.now(),
        user_id: testUserId,
        date: '2024-01-18',
        type: 'expense',
        category: 'Аренда офиса',
        subcategory: 'Аренда',
        amount: 15000,
        description: 'Аренда офиса за январь',
        company: 'Спасение',
        account_from: 'Расчетный счет',
        created_at: now,
        updated_at: now
      },
      {
        id: 'tx-5-' + Date.now(),
        user_id: testUserId,
        date: '2024-01-19',
        type: 'expense',
        category: 'Реклама Авито',
        subcategory: 'Объявления',
        amount: 5000,
        description: 'Размещение объявлений на Авито',
        company: 'Спасение',
        account_from: 'Карта',
        created_at: now,
        updated_at: now
      }
    ];
    
    for (const transaction of testTransactions) {
      await connection.query(
        `INSERT INTO transactions (
          id, user_id, date, type, category, subcategory, amount, description,
          client_name, contract_amount, first_payment, installment_period, lump_sum,
          company, account_from, account_to, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
          transaction.account_from,
          transaction.account_to,
          transaction.created_at,
          transaction.updated_at
        ]
      );
    }
    
    console.log(`✅ Создано ${testTransactions.length} тестовых транзакций`);
    
    // Проверяем результаты
    const [userCount] = await connection.query('SELECT COUNT(*) as count FROM users');
    const [transactionCount] = await connection.query('SELECT COUNT(*) as count FROM transactions');
    
    console.log('📊 Итоги:');
    console.log(`   - Пользователей: ${userCount[0].count}`);
    console.log(`   - Транзакций: ${transactionCount[0].count}`);
    
    // Показываем статистику
    const [stats] = await connection.query(`
      SELECT 
        type,
        SUM(amount) as total,
        COUNT(*) as count
      FROM transactions 
      WHERE user_id = ?
      GROUP BY type
    `, [testUserId]);
    
    console.log('💰 Статистика по транзакциям:');
    stats.forEach(stat => {
      console.log(`   - ${stat.type === 'income' ? 'Доходы' : 'Расходы'}: ${stat.total} ₽ (${stat.count} операций)`);
    });
    
    console.log('🎉 Тестовые данные успешно созданы!');
    
  } catch (error) {
    console.error('❌ Ошибка при создании тестовых данных:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Запускаем создание тестовых данных
createTestData().catch(console.error);
