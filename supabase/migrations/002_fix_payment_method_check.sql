-- ============================================================
-- Fix orders.payment_method CHECK constraint
-- Run in: Supabase Dashboard → SQL Editor → New Query
--
-- The original constraint only allowed ('cod','online_placeholder') / ('cod','online'),
-- but the app writes 'cashfree', 'razorpay', and 'upi' (WhatsApp+UPI orders) too.
-- Without this, any non-COD order insert fails silently and never reaches the admin panel.
-- ============================================================

alter table orders drop constraint if exists orders_payment_method_check;

alter table orders
  add constraint orders_payment_method_check
  check (payment_method in ('cod', 'cashfree', 'razorpay', 'upi', 'online_placeholder'));

select 'orders.payment_method constraint updated!' as result;
