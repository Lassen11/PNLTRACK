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

async function viewData() {
  console.log('👀 Просмотр данных в MySQL...');
  
  let connection;
  
  try {
    connection = await mysql.createConnection(config);
    console.log('✅ Подключение к MySQL установлено');
    
    // Показываем пользователей
    const [users] = await connection.query('SELECT * FROM users ORDER BY created_at DESC');
    console.log('\n👤 Пользователи:');
    users.forEach(user => {
      console.log(`  - ${user.email} (ID: ${user.id})`);
    });
    
    // Показываем транзакции
    const [transactions] = await connection.query(`
      SELECT 
        t.*,
        u.email as user_email
      FROM transactions t
      LEFT JOIN users u ON t.user_id = u.id
      ORDER BY t.date DESC, t.created_at DESC
    `);
    
    console.log('\n💰 Транзакции:');
    transactions.forEach(tx => {
      const amount = parseFloat(tx.amount).toLocaleString('ru-RU');
      const account = tx.type === 'income' ? tx.account_to : tx.account_from;
      console.log(`  ${tx.date} | ${tx.type === 'income' ? '📈' : '📉'} ${tx.category} | ${amount} ₽ | ${account || 'Не указан'}`);
      if (tx.client_name) {
        console.log(`    Клиент: ${tx.client_name}`);
      }
      if (tx.description) {
        console.log(`    Описание: ${tx.description}`);
      }
      console.log('');
    });
    
    // Статистика
    const [stats] = await connection.query(`
      SELECT 
        type,
        SUM(amount) as total,
        COUNT(*) as count,
        AVG(amount) as avg_amount
      FROM transactions 
      GROUP BY type
    `);
    
    console.log('📊 Статистика:');
    stats.forEach(stat => {
      const total = parseFloat(stat.total).toLocaleString('ru-RU');
      const avg = parseFloat(stat.avg_amount).toLocaleString('ru-RU');
      console.log(`  ${stat.type === 'income' ? 'Доходы' : 'Расходы'}: ${total} ₽ (${stat.count} операций, средняя: ${avg} ₽)`);
    });
    
    const totalIncome = stats.find(s => s.type === 'income')?.total || 0;
    const totalExpense = stats.find(s => s.type === 'expense')?.total || 0;
    const profit = totalIncome - totalExpense;
    
    console.log(`\n💵 Прибыль: ${profit.toLocaleString('ru-RU')} ₽`);
    
  } catch (error) {
    console.error('❌ Ошибка при просмотре данных:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Запускаем просмотр данных
viewData().catch(console.error);
