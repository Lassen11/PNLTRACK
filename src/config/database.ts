// Конфигурация Supabase
export const SUPABASE_CONFIG = {
  url: process.env.VITE_SUPABASE_URL || 'https://rdpxbbddqxwbufzqozqz.supabase.co',
  key: process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkcHhiYmRkcXh3YnVmenFvenF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNTc2ODgsImV4cCI6MjA3MTYzMzY4OH0.plxTYORPFZPTZU3rePIyU2WR_mHh47cvSrakpJEDa8I'
};

// Функция для получения конфигурации Supabase
export const getSupabaseConfig = () => {
  return SUPABASE_CONFIG;
};
