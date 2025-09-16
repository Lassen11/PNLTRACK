// Конфигурация базы данных
export const DATABASE_CONFIG = {
  // Тип базы данных: 'supabase' или 'mysql'
  type: process.env.VITE_APP_DATABASE_TYPE || 'mysql',
  
  // Настройки MySQL
  mysql: {
    host: process.env.MYSQL_HOST || '5.129.252.214',
    port: parseInt(process.env.MYSQL_PORT || '3306'),
    user: process.env.MYSQL_USER || 'gen_user',
    password: process.env.MYSQL_PASSWORD || 'dfguZ_H:+>$^~5',
    database: process.env.MYSQL_DATABASE || 'default_db',
  },
  
  // Настройки Supabase
  supabase: {
    url: 'https://rdpxbbddqxwbufzqozqz.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkcHhiYmRkcXh3YnVmenFvenF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNTc2ODgsImV4cCI6MjA3MTYzMzY4OH0.plxTYORPFZPTZU3rePIyU2WR_mHh47cvSrakpJEDa8I'
  }
};

// Функция для получения текущей конфигурации
export const getDatabaseConfig = () => {
  return DATABASE_CONFIG;
};

// Функция для проверки типа базы данных
export const isMySQL = () => DATABASE_CONFIG.type === 'mysql';
export const isSupabase = () => DATABASE_CONFIG.type === 'supabase';
