-- Fix RLS policies for order_items table
-- This table was missing policies, making it invisible to non-admin service role users

-- Disable and Re-enable RLS to be sure
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 1. Allow users to read their own order items
-- This joins with the orders table to check ownership
DROP POLICY IF EXISTS "Users can read own order items" ON order_items;
CREATE POLICY "Users can read own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- 2. Allow admins to read all order items
DROP POLICY IF EXISTS "Admins can read all order items" ON order_items;
CREATE POLICY "Admins can read all order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'Administrador'
    )
  );

-- 3. Allow insertion (if needed for client-side creation, though currently done by Edge Function)
-- Since checkout-init uses service role, it doesn't need this, but for completeness:
DROP POLICY IF EXISTS "Service role can insert order items" ON order_items;
CREATE POLICY "Service role can insert order items" ON order_items
  FOR INSERT WITH CHECK (true);

-- 4. Enable public read of product info through JOIN if needed
-- (The products table already has a policy for public select)
