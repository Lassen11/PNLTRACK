# Настройка Supabase для PNLTRACK

## ✅ Что было исправлено

1. **Активирован код Supabase** в `src/hooks/useData.tsx`
2. **Созданы функции для работы с данными** в `src/lib/supabaseData.ts`
3. **Настроена конфигурация** для использования Supabase по умолчанию
4. **Обновлен Supabase клиент** для использования переменных окружения

## 🔧 Настройка переменных окружения в Timeweb Cloud

В панели управления Timeweb Cloud добавьте следующие переменные окружения:

```
VITE_APP_DATABASE_TYPE=supabase
VITE_SUPABASE_URL=https://rdpxbbddqxwbufzqozqz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkcHhiYmRkcXh3YnVmenFvenF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNTc2ODgsImV4cCI6MjA3MTYzMzY4OH0.plxTYORPFZPTZU3rePIyU2WR_mHh47cvSrakpJEDa8I
```

## 📊 Структура таблиц в Supabase

### Таблица `users`
- `id` - UUID пользователя
- `email` - Email пользователя
- `created_at` - Дата создания
- `updated_at` - Дата обновления

### Таблица `transactions`
- `id` - UUID транзакции
- `user_id` - ID пользователя (ссылка на users.id)
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

## 🚀 После настройки

1. **Пересоберите приложение** в Timeweb Cloud
2. **Проверьте работу** на https://lassen11-pnltrack-44b3.twc1.net/
3. **Протестируйте сохранение данных** - добавьте транзакцию
4. **Проверьте в панели Supabase** - данные должны появиться в таблице `transactions`

## 🔍 Проверка работы

1. Откройте приложение в браузере
2. Войдите в систему (аутентификация через Supabase)
3. Добавьте новую транзакцию
4. Проверьте в панели Supabase, что данные сохранились

## ⚠️ Важные замечания

- Убедитесь, что в Supabase включена аутентификация
- Проверьте, что таблицы `users` и `transactions` существуют
- Убедитесь, что RLS (Row Level Security) настроен правильно
- Проверьте, что пользователи могут создавать записи в таблице `transactions`
