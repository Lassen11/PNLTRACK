-- Apply account fields migration to Supabase
-- Run this SQL in Supabase SQL Editor

-- Add account fields to transactions table
-- account_from: счет списания (для расходов)
-- account_to: счет поступления (для доходов)

ALTER TABLE public.transactions 
ADD COLUMN IF NOT EXISTS account_from TEXT,
ADD COLUMN IF NOT EXISTS account_to TEXT;

-- Add comments for clarity
COMMENT ON COLUMN public.transactions.account_from IS 'Счет списания (используется для расходов)';
COMMENT ON COLUMN public.transactions.account_to IS 'Счет поступления (используется для доходов)';

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_transactions_account_from ON public.transactions(account_from);
CREATE INDEX IF NOT EXISTS idx_transactions_account_to ON public.transactions(account_to);
