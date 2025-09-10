# Инструкции для деплоя на Timeweb Cloud

## Настройки приложения в Timeweb Cloud

### 1. Основные настройки деплоя:
- **Framework:** React
- **Build команда:** `npm run build`
- **Директория сборки:** `/` (корень)
- **SPA fallback:** включить

### 2. Переменные окружения:
Добавьте в настройки приложения:
```
VITE_SUPABASE_URL=https://rdpxbbddqxwbufzqozqz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkcHhiYmRkcXh3YnVmenFvenF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNTc2ODgsImV4cCI6MjA3MTYzMzY4OH0.plxTYORPFZPTZU3rePIyU2WR_mHh47cvSrakpJEDa8I
```

### 3. Nginx конфигурация:
Добавьте в настройки nginx:
```nginx
location ~* \.js$ {
    add_header Content-Type "application/javascript; charset=utf-8";
    expires 1y;
    add_header Cache-Control "public, immutable";
}

location ~* \.css$ {
    add_header Content-Type "text/css; charset=utf-8";
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# SPA fallback - redirect all requests to index.html
location / {
    try_files $uri $uri/ /index.html;
}
```

### 4. После настройки:
1. Запустите публикацию последнего коммита
2. Проверьте сайт: https://lassen11-pnltrack-44b3.twc1.net/
3. Если есть проблемы - проверьте логи публикации
