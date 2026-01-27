-- Add Stripe related columns to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_intent_id TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_info JSONB;
CREATE INDEX IF NOT EXISTS idx_orders_payment_intent ON orders(payment_intent_id);
