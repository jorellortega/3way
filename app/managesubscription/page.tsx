'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, CreditCard, Download, Settings, Crown, Star, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Subscription {
  id: string;
  plan: string;
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  startDate: string;
  endDate: string;
  nextBilling: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  downloadsUsed: number;
  downloadsLimit: number;
}

interface BillingHistory {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  description: string;
}

export default function ManageSubscriptionPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [billingHistory, setBillingHistory] = useState<BillingHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate loading subscription data
    setTimeout(() => {
      // Mock subscription data - replace with real API call later
      setSubscription({
        id: 'sub_123456',
        plan: 'Premium',
        status: 'active',
        startDate: '2024-01-15',
        endDate: '2025-01-15',
        nextBilling: '2025-02-15',
        price: 19.99,
        billingCycle: 'monthly',
        downloadsUsed: 23,
        downloadsLimit: 50
      });

      setBillingHistory([
        {
          id: 'inv_001',
          date: '2024-01-15',
          amount: 19.99,
          status: 'paid',
          description: 'Premium Plan - Monthly'
        },
        {
          id: 'inv_002',
          date: '2024-02-15',
          amount: 19.99,
          status: 'paid',
          description: 'Premium Plan - Monthly'
        },
        {
          id: 'inv_003',
          date: '2024-03-15',
          amount: 19.99,
          status: 'paid',
          description: 'Premium Plan - Monthly'
        }
      ]);

      setIsLoading(false);
    }, 1000);
  }, []);

  const handleCancelSubscription = () => {
    if (confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.')) {
      setSubscription(prev => prev ? { ...prev, status: 'cancelled' as const } : null);
      toast({
        title: "Subscription Cancelled",
        description: "Your subscription will remain active until the end of your billing period.",
      });
    }
  };

  const handleReactivateSubscription = () => {
    setSubscription(prev => prev ? { ...prev, status: 'active' as const } : null);
    toast({
      title: "Subscription Reactivated",
      description: "Your subscription is now active again!",
    });
  };

  const getPlanIcon = (plan: string) => {
    switch (plan.toLowerCase()) {
      case 'basic':
        return <Star className="h-5 w-5" />;
      case 'premium':
        return <Crown className="h-5 w-5" />;
      case 'pro':
        return <Zap className="h-5 w-5" />;
      default:
        return <Star className="h-5 w-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      case 'expired':
        return <Badge variant="secondary">Expired</Badge>;
      case 'trial':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Trial</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="mx-auto max-w-4xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="mx-auto max-w-2xl text-center">
          <div className="rounded-lg border border-paradiseGold bg-[#141414] p-8">
            <h1 className="text-2xl font-bold text-paradisePink mb-4">No Active Subscription</h1>
            <p className="text-paradiseGold mb-6">
              You don't have an active subscription. Subscribe to a plan to access premium features.
            </p>
            <Button asChild className="bg-paradisePink hover:bg-paradiseGold text-white">
              <a href="/subscriptions">View Plans</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-paradisePink mb-2">Manage Subscription</h1>
          <p className="text-paradiseGold">View and manage your subscription details</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Current Subscription */}
          <Card className="bg-[#141414] border-paradiseGold/30 shadow-[0_0_15px_rgba(249,200,70,0.15)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-paradisePink">
                {getPlanIcon(subscription.plan)}
                {subscription.plan} Plan
              </CardTitle>
              <CardDescription className="text-paradiseGold">
                Your current subscription details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-paradiseGold">Status:</span>
                {getStatusBadge(subscription.status)}
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-paradiseGold">Billing Cycle:</span>
                <span className="text-white capitalize">{subscription.billingCycle}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-paradiseGold">Price:</span>
                <span className="text-white">${subscription.price}/{subscription.billingCycle === 'monthly' ? 'month' : 'year'}</span>
              </div>
              
              <Separator className="bg-paradiseGold/20" />
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-paradiseGold">Downloads Used:</span>
                  <span className="text-white">{subscription.downloadsUsed} / {subscription.downloadsLimit}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-paradisePink h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(subscription.downloadsUsed / subscription.downloadsLimit) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <Separator className="bg-paradiseGold/20" />
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-paradiseGold">Started:</span>
                  <span className="text-white">{new Date(subscription.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-paradiseGold">Next Billing:</span>
                  <span className="text-white">{new Date(subscription.nextBilling).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="pt-4 space-y-3">
                {subscription.status === 'active' ? (
                  <Button 
                    onClick={handleCancelSubscription}
                    variant="outline" 
                    className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  >
                    Cancel Subscription
                  </Button>
                ) : subscription.status === 'cancelled' ? (
                  <Button 
                    onClick={handleReactivateSubscription}
                    className="w-full bg-paradisePink hover:bg-paradiseGold text-white"
                  >
                    Reactivate Subscription
                  </Button>
                ) : null}
                
                <Button variant="outline" className="w-full border-paradiseGold text-paradisePink hover:bg-paradiseGold/10">
                  <Settings className="h-4 w-4 mr-2" />
                  Update Payment Method
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Billing History */}
          <Card className="bg-[#141414] border-paradiseGold/30 shadow-[0_0_15px_rgba(249,200,70,0.15)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-paradisePink">
                <CreditCard className="h-5 w-5" />
                Billing History
              </CardTitle>
              <CardDescription className="text-paradiseGold">
                Your recent billing transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {billingHistory.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-white">{item.description}</span>
                        {item.status === 'paid' && (
                          <Badge className="bg-green-500 hover:bg-green-600 text-xs">Paid</Badge>
                        )}
                        {item.status === 'pending' && (
                          <Badge className="bg-yellow-500 hover:bg-yellow-600 text-xs">Pending</Badge>
                        )}
                        {item.status === 'failed' && (
                          <Badge variant="destructive" className="text-xs">Failed</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-paradiseGold">
                        <Calendar className="h-3 w-3" />
                        {new Date(item.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-white">${item.amount}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-paradiseGold/20">
                <Button variant="outline" className="w-full border-paradiseGold text-paradisePink hover:bg-paradiseGold/10">
                  <Download className="h-4 w-4 mr-2" />
                  Download Invoice
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Plan Comparison */}
        <Card className="bg-[#141414] mt-8 border-paradiseGold/30 shadow-[0_0_15px_rgba(249,200,70,0.15)]">
          <CardHeader>
            <CardTitle className="text-paradisePink">Plan Comparison</CardTitle>
            <CardDescription className="text-paradiseGold">
              Compare your current plan with other available options
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              {['Basic', 'Premium', 'Pro'].map((plan) => (
                <div
                  key={plan}
                  className={`p-4 rounded-lg border-2 ${
                    plan === subscription.plan
                      ? 'border-paradisePink bg-paradisePink/10'
                      : 'border-paradiseGold/30'
                  }`}
                >
                  <div className="text-center mb-4">
                    <h3 className={`font-bold text-lg ${
                      plan === subscription.plan ? 'text-paradisePink' : 'text-white'
                    }`}>
                      {plan}
                    </h3>
                    {plan === subscription.plan && (
                      <Badge className="mt-2 bg-paradisePink">Current Plan</Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-paradiseGold">Downloads:</span>
                      <span className="text-white">
                        {plan === 'Basic' ? '10/month' : plan === 'Premium' ? '50/month' : 'Unlimited'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-paradiseGold">Resolution:</span>
                      <span className="text-white">
                        {plan === 'Basic' ? 'Standard' : plan === 'Premium' ? 'High' : 'Maximum'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-paradiseGold">Support:</span>
                      <span className="text-white">
                        {plan === 'Basic' ? 'Basic' : plan === 'Premium' ? 'Priority' : '24/7'}
                      </span>
                    </div>
                  </div>
                  
                  {plan !== subscription.plan && (
                    <Button 
                      variant="outline" 
                      className="w-full mt-4 border-paradiseGold text-paradisePink hover:bg-paradiseGold/10"
                    >
                      Switch to {plan}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 