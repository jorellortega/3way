-- Fix RLS policies for subscription_payments to allow INSERT operations
-- Migration: 20240321000006_fix_subscription_payments_rls.sql

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view their own payment history" ON public.subscription_payments;
DROP POLICY IF EXISTS "Creators can view payment history for their subscriptions" ON public.subscription_payments;

-- Create new policies that allow INSERT operations
-- Users can insert payment records for their own subscriptions
CREATE POLICY "Users can insert payment records for their own subscriptions" ON public.subscription_payments
    FOR INSERT WITH CHECK (
        subscription_id IN (
            SELECT id FROM public.subscriptions WHERE user_id = auth.uid()
        )
    );

-- Users can view their own payment history
CREATE POLICY "Users can view their own payment history" ON public.subscription_payments
    FOR SELECT USING (
        subscription_id IN (
            SELECT id FROM public.subscriptions WHERE user_id = auth.uid()
        )
    );

-- Creators can view payment history for their subscriptions
CREATE POLICY "Creators can view payment history for their subscriptions" ON public.subscription_payments
    FOR SELECT USING (
        subscription_id IN (
            SELECT id FROM public.subscriptions WHERE creator_id = auth.uid()
        )
    );

-- Platform admins can manage all payment records (optional - for support purposes)
CREATE POLICY "Platform admins can manage all payment records" ON public.subscription_payments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );
