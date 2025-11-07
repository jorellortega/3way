-- Add analytics columns to users table for creators/admins
-- These columns will store aggregated statistics for quick access

alter table public.users
add column if not exists total_sales_count integer default 0,
add column if not exists total_sales_revenue decimal(10,2) default 0,
add column if not exists total_active_subscriptions integer default 0,
add column if not exists total_subscription_revenue decimal(10,2) default 0,
add column if not exists analytics_updated_at timestamp with time zone;

-- Add comments
comment on column public.users.total_sales_count is 'Total number of content sales for this creator';
comment on column public.users.total_sales_revenue is 'Total revenue from content sales';
comment on column public.users.total_active_subscriptions is 'Current number of active subscriptions';
comment on column public.users.total_subscription_revenue is 'Monthly revenue from active subscriptions';
comment on column public.users.analytics_updated_at is 'Last time analytics were updated';

-- Create index for faster queries
create index if not exists users_total_sales_revenue_idx on public.users(total_sales_revenue) where total_sales_revenue > 0;
create index if not exists users_total_subscription_revenue_idx on public.users(total_subscription_revenue) where total_subscription_revenue > 0;

-- Function to update creator analytics when a sale happens
create or replace function update_creator_sales_analytics()
returns trigger as $$
begin
    -- Update the creator's sales count and revenue when content is purchased
    update public.users
    set 
        total_sales_count = (
            select count(*) 
            from public.user_content_access uca
            join public.content c on c.id = uca.content_id
            where c.creator_id = (select creator_id from public.content where id = NEW.content_id)
        ),
        total_sales_revenue = (
            select coalesce(sum(c.price), 0)
            from public.user_content_access uca
            join public.content c on c.id = uca.content_id
            where c.creator_id = (select creator_id from public.content where id = NEW.content_id)
        ),
        analytics_updated_at = now()
    where id = (select creator_id from public.content where id = NEW.content_id);
    
    return NEW;
end;
$$ language plpgsql security definer;

-- Function to update creator subscription analytics
create or replace function update_creator_subscription_analytics()
returns trigger as $$
begin
    -- Update subscription analytics for the creator
    update public.users
    set 
        total_active_subscriptions = (
            select count(*) 
            from public.subscriptions 
            where creator_id = COALESCE(NEW.creator_id, OLD.creator_id)
            and status = 'active'
        ),
        total_subscription_revenue = (
            select coalesce(sum(amount), 0)
            from public.subscriptions 
            where creator_id = COALESCE(NEW.creator_id, OLD.creator_id)
            and status = 'active'
        ),
        analytics_updated_at = now()
    where id = COALESCE(NEW.creator_id, OLD.creator_id);
    
    return COALESCE(NEW, OLD);
end;
$$ language plpgsql security definer;

-- Drop triggers if they exist
drop trigger if exists update_sales_analytics_on_purchase on public.user_content_access;
drop trigger if exists update_subscription_analytics_on_change on public.subscriptions;

-- Create trigger for sales analytics
create trigger update_sales_analytics_on_purchase
    after insert on public.user_content_access
    for each row
    execute function update_creator_sales_analytics();

-- Create trigger for subscription analytics (on insert/update/delete)
create trigger update_subscription_analytics_on_change
    after insert or update or delete on public.subscriptions
    for each row
    execute function update_creator_subscription_analytics();

-- Initial calculation: Update analytics for all existing creators
-- This will populate the analytics columns with current data
do $$
declare
    creator_record record;
begin
    for creator_record in 
        select id from public.users where role in ('creator', 'admin')
    loop
        -- Update sales analytics
        update public.users
        set 
            total_sales_count = (
                select count(*) 
                from public.user_content_access uca
                join public.content c on c.id = uca.content_id
                where c.creator_id = creator_record.id
            ),
            total_sales_revenue = (
                select coalesce(sum(c.price), 0)
                from public.user_content_access uca
                join public.content c on c.id = uca.content_id
                where c.creator_id = creator_record.id
            ),
            total_active_subscriptions = (
                select count(*) 
                from public.subscriptions 
                where creator_id = creator_record.id
                and status = 'active'
            ),
            total_subscription_revenue = (
                select coalesce(sum(amount), 0)
                from public.subscriptions 
                where creator_id = creator_record.id
                and status = 'active'
            ),
            analytics_updated_at = now()
        where id = creator_record.id;
    end loop;
end $$;

