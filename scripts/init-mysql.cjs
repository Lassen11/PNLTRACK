const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

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

async function initDatabase() {
  console.log('🚀 Инициализация базы данных MySQL...');
  
  let connection;
  
  try {
    // Подключаемся к MySQL
    connection = await mysql.createConnection(config);
    console.log('✅ Подключение к MySQL установлено');
    
    // Читаем схему из файла
    const schemaPath = path.join(__dirname, '..', 'mysql', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Выполняем SQL команды
    const statements = schema.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (const statement of statements) {
      const trimmed = statement.trim();
      if (trimmed && !trimmed.startsWith('--')) {
        // Используем query для всех команд, так как некоторые не поддерживают prepared statements
        await connection.query(statement);
        console.log('✅ Выполнена команда:', trimmed.substring(0, 50) + '...');
      }
    }
    
    console.log('🎉 База данных успешно инициализирована!');
    
    // Проверяем созданные таблицы
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('📊 Созданные таблицы:', tables.map(t => Object.values(t)[0]));
    
  } catch (error) {
    console.error('❌ Ошибка при инициализации базы данных:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Запускаем инициализацию
initDatabase().catch(console.error);
