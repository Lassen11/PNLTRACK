# Миграция с Supabase на MySQL 8.4

## 🚀 Быстрый старт

### 1. Инициализация базы данных
```bash
# Установить зависимости
npm install

# Инициализировать схему MySQL
node scripts/init-mysql.js

# Мигрировать данные из Supabase
node scripts/migrate-from-supabase.js
```

### 2. Настройка переменных окружения
Скопируйте `mysql.env` в `.env`:
```bash
cp mysql.env .env
```

### 3. Запуск приложения
```bash
npm run dev
```

## 📊 Структура базы данных

### Таблица `users`
- `id` - UUID пользователя
- `email` - Email пользователя
- `created_at` - Дата создания
- `updated_at` - Дата обновления

### Таблица `transactions`
- `id` - UUID транзакции
- `user_id` - ID пользователя
- `date` - Дата транзакции
- `type` - Тип (income/expense)
- `category` - Категория
- `subcategory` - Подкатегория
- `amount` - Сумма
- `description` - Описание
- `client_name` - Имя клиента
- `contract_amount` - Сумма договора
- `first_payment` - Первый платеж
- `installment_period` - Период рассрочки
- `lump_sum` - Ежемесячный платеж
- `company` - Компания
- `contract_status` - Статус договора
- `termination_date` - Дата расторжения
- `account_from` - Счет списания (для расходов)
- `account_to` - Счет поступления (для доходов)
- `created_at` - Дата создания
- `updated_at` - Дата обновления

## 🔧 Конфигурация

### Переменные окружения
```env
MYSQL_HOST=5.129.252.214
MYSQL_PORT=3306
MYSQL_DATABASE=default_db
MYSQL_USER=gen_user
MYSQL_PASSWORD=dfguZ_H:+>$^~5
VITE_APP_DATABASE_TYPE=mysql
```

### Переключение между базами данных
В `src/config/database.ts` измените:
```typescript
type: 'mysql' // или 'supabase'
```

## 📁 Структура файлов

```
src/
├── integrations/
│   ├── mysql/
│   │   ├── client.ts          # MySQL клиент
│   │   ├── auth.ts            # Сервис аутентификации
│   │   └── transactions.ts    # Сервис транзакций
│   └── supabase/              # Старые файлы Supabase
├── hooks/
│   ├── useAuthMySQL.tsx       # Хук аутентификации для MySQL
│   └── useData.tsx            # Универсальный хук для данных
├── lib/
│   └── mysqlData.ts           # Функции для работы с MySQL
└── config/
    └── database.ts            # Конфигурация базы данных

mysql/
└── schema.sql                 # Схема базы данных

scripts/
├── init-mysql.js              # Инициализация БД
└── migrate-from-supabase.js   # Миграция данных
```

## 🛠️ API

### TransactionService
```typescript
// Получить все транзакции
await transactionService.getTransactions(userId);

// Создать транзакцию
await transactionService.createTransaction(transaction);

// Обновить транзакцию
await transactionService.updateTransaction(id, updates);

// Удалить транзакцию
await transactionService.deleteTransaction(id);

// Получить статистику
await transactionService.getFinancialStats(userId, startDate, endDate);
```

### AuthService
```typescript
// Создать пользователя
await authService.createUser(email);

// Получить пользователя
await authService.getUserByEmail(email);

// Обновить пользователя
await authService.updateUser(id, updates);
```

## 🔍 Мониторинг

### Проверка подключения
```bash
# Проверить статус MySQL
mysql -h 5.129.252.214 -P 3306 -u gen_user -p default_db

# Проверить таблицы
SHOW TABLES;

# Проверить данные
SELECT COUNT(*) FROM transactions;
SELECT COUNT(*) FROM users;
```

## 🚨 Устранение неполадок

### Ошибки подключения
1. Проверьте правильность данных подключения
2. Убедитесь, что MySQL сервер доступен
3. Проверьте настройки файрвола

### Ошибки миграции
1. Убедитесь, что Supabase доступен
2. Проверьте права доступа к MySQL
3. Проверьте логи в консоли

### Ошибки приложения
1. Проверьте переменные окружения
2. Убедитесь, что база данных инициализирована
3. Проверьте логи браузера

## 📈 Производительность

### Рекомендации
- Используйте индексы для часто запрашиваемых полей
- Настройте пул подключений
- Регулярно делайте бэкапы

### Мониторинг
- Следите за размером базы данных
- Мониторьте время выполнения запросов
- Проверяйте использование памяти
