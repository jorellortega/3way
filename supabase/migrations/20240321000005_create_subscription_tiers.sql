-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create subscription_tiers table
CREATE TABLE IF NOT EXISTS public.subscription_tiers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    creator_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    description TEXT,
    benefits TEXT[] DEFAULT '{}',
    popular BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    subscriber_count INTEGER DEFAULT 0,
    monthly_revenue DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_subscription_tiers_creator_id FOREIGN KEY (creator_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- Create subscriptions table for user subscriptions to creators
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL,
    creator_id UUID NOT NULL,
    tier_id UUID NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'paused')),
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    next_billing_date TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 month'),
    amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_subscriptions_user_id FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
    CONSTRAINT fk_subscriptions_creator_id FOREIGN KEY (creator_id) REFERENCES public.users(id) ON DELETE CASCADE,
    CONSTRAINT fk_subscriptions_tier_id FOREIGN KEY (tier_id) REFERENCES public.subscription_tiers(id) ON DELETE CASCADE,
    UNIQUE(user_id, creator_id, tier_id)
);

-- Create subscription_payments table for payment tracking
CREATE TABLE IF NOT EXISTS public.subscription_payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    subscription_id UUID NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_method VARCHAR(50),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    external_payment_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_subscription_payments_subscription_id FOREIGN KEY (subscription_id) REFERENCES public.subscriptions(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subscription_tiers_creator_id ON public.subscription_tiers(creator_id);
CREATE INDEX IF NOT EXISTS idx_subscription_tiers_active ON public.subscription_tiers(is_active);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_creator_id ON public.subscriptions(creator_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscription_payments_subscription_id ON public.subscription_payments(subscription_id);

-- Create RLS policies for subscription_tiers
ALTER TABLE public.subscription_tiers ENABLE ROW LEVEL SECURITY;

-- Anyone can view active subscription tiers
CREATE POLICY "Anyone can view active subscription tiers" ON public.subscription_tiers
    FOR SELECT USING (is_active = true);

-- Creators can manage their own subscription tiers
CREATE POLICY "Creators can manage their own subscription tiers" ON public.subscription_tiers
    FOR ALL USING (creator_id = auth.uid());

-- Create RLS policies for subscriptions
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can view their own subscriptions
CREATE POLICY "Users can view their own subscriptions" ON public.subscriptions
    FOR SELECT USING (user_id = auth.uid());

-- Creators can view subscriptions to their content
CREATE POLICY "Creators can view subscriptions to their content" ON public.subscriptions
    FOR SELECT USING (creator_id = auth.uid());

-- Users can manage their own subscriptions
CREATE POLICY "Users can manage their own subscriptions" ON public.subscriptions
    FOR ALL USING (user_id = auth.uid());

-- Create RLS policies for subscription_payments
ALTER TABLE public.subscription_payments ENABLE ROW LEVEL SECURITY;

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

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_subscription_tiers_updated_at 
    BEFORE UPDATE ON public.subscription_tiers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at 
    BEFORE UPDATE ON public.subscriptions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to ensure only one popular tier per creator
CREATE OR REPLACE FUNCTION ensure_single_popular_tier()
RETURNS TRIGGER AS $$
BEGIN
    -- If this tier is being marked as popular, unmark all others for this creator
    IF NEW.popular = true THEN
        UPDATE public.subscription_tiers 
        SET popular = false 
        WHERE creator_id = NEW.creator_id 
        AND id != NEW.id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to ensure only one popular tier per creator
CREATE TRIGGER ensure_single_popular_tier_trigger
    BEFORE INSERT OR UPDATE ON public.subscription_tiers
    FOR EACH ROW EXECUTE FUNCTION ensure_single_popular_tier();

-- Insert some sample subscription tiers for testing (optional)
-- You can remove this if you don't want sample data
INSERT INTO public.subscription_tiers (creator_id, name, price, description, benefits, popular, is_active) VALUES
    ('00000000-0000-0000-0000-000000000001', 'Supporter', 4.99, 'Basic support for your favorite creator', ARRAY['Exclusive behind-the-scenes content', 'Early access to new releases', 'Supporter badge on profile', 'Monthly creator update'], false, true),
    ('00000000-0000-0000-0000-000000000001', 'Fan', 9.99, 'Enhanced creator experience', ARRAY['All Supporter benefits', 'Exclusive creator content', 'Direct message access', 'Custom creator requests', 'Monthly Q&A sessions'], true, true),
    ('00000000-0000-0000-0000-000000000001', 'VIP', 19.99, 'Ultimate creator connection', ARRAY['All Fan benefits', 'Priority creator support', 'Exclusive merchandise', 'Personal creator shoutout', 'Quarterly creator calls', 'Custom content creation'], false, true)
ON CONFLICT DO NOTHING;
