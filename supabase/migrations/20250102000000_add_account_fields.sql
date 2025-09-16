-- Add account fields to transactions table
-- account_from: счет списания (для расходов)
-- account_to: счет поступления (для доходов)

ALTER TABLE public.transactions 
ADD COLUMN account_from TEXT,
ADD COLUMN account_to TEXT;

-- Add comments for clarity
COMMENT ON COLUMN public.transactions.account_from IS 'Счет списания (используется для расходов)';
COMMENT ON COLUMN public.transactions.account_to IS 'Счет поступления (используется для доходов)';

-- Add indexes for better performance
CREATE INDEX idx_transactions_account_from ON public.transactions(account_from);
CREATE INDEX idx_transactions_account_to ON public.transactions(account_to);
