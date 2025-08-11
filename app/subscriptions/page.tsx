'use client';

import Link from "next/link"
import { Check, Crown, Star, Zap, Heart, Users, Calendar, Gift, ArrowLeft } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"
import { useAuth } from "@/hooks/useAuth"

interface Creator {
  id: string;
  first_name: string;
  last_name: string;
  profile_image: string | null;
  bio: string | null;
  is_verified: boolean;
  subscription_tiers: SubscriptionTier[];
}

interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  description: string;
  benefits: string[];
  popular?: boolean;
  is_active: boolean;
  subscriber_count?: number;
  monthly_revenue?: number;
}

export default function SubscriptionsPage() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCreator, setSelectedCreator] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [highlightedCreator, setHighlightedCreator] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient<Database>();
  const { user } = useAuth();

  useEffect(() => {
    // Check if there's a creator ID in the URL
    const creatorId = searchParams.get('creator');
    if (creatorId) {
      setHighlightedCreator(creatorId);
      // Fetch that specific creator's data immediately
      fetchSpecificCreator(creatorId);
      // Scroll to that creator after loading
      setTimeout(() => {
        const element = document.getElementById(`creator-${creatorId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('ring-4', 'ring-paradisePink', 'ring-opacity-50');
          setTimeout(() => {
            element.classList.remove('ring-4', 'ring-paradisePink', 'ring-opacity-50');
          }, 3000);
        }
      }, 1000);
    } else {
      fetchCreators();
    }
  }, [searchParams]);

  const fetchCreators = async () => {
    try {
      console.log('Fetching creators...');
      
      // Fetch creators with their real subscription tiers
      const { data: creatorsData, error: creatorsError } = await supabase
        .from('users')
        .select('id, first_name, last_name, profile_image, bio, is_verified')
        .eq('role', 'creator')
        // Remove the is_verified filter to show all creators
        .order('created_at', { ascending: false })
        .limit(10); // Increased limit to show more creators

      if (creatorsError) {
        console.error('Error fetching creators:', creatorsError);
        setCreators([]);
        return;
      }

      console.log('Creators data:', creatorsData);

      if (!creatorsData || creatorsData.length === 0) {
        console.log('No creators found');
        setCreators([]);
        return;
      }

      // Debug profile images
      creatorsData.forEach(creator => {
        console.log(`Creator ${creator.first_name} ${creator.last_name}:`, {
          id: creator.id,
          profile_image: creator.profile_image,
          has_image: !!creator.profile_image
        });
      });

      // Fetch subscription tiers for each creator
      const creatorsWithTiers = await Promise.all(
        creatorsData.map(async (creator) => {
          console.log(`Fetching tiers for creator: ${creator.id} (${creator.first_name} ${creator.last_name})`);
          
          const { data: tiersData, error: tiersError } = await supabase
            .from('subscription_tiers')
            .select('id, name, price, description, benefits, popular, is_active, subscriber_count, monthly_revenue')
            .eq('creator_id', creator.id)
            .eq('is_active', true) // Only show active tiers
            .order('price', { ascending: true });

          if (tiersError) {
            console.error(`Error fetching tiers for creator ${creator.id}:`, tiersError);
            return {
              ...creator,
              subscription_tiers: []
            };
          }

          console.log(`Found ${tiersData?.length || 0} tiers for creator ${creator.id}`);
          return {
            ...creator,
            subscription_tiers: tiersData || []
          };
        })
      );

      // Filter out creators with no active tiers
      const creatorsWithActiveTiers = creatorsWithTiers.filter(
        creator => creator.subscription_tiers.length > 0
      );

      console.log('Final creators with active tiers:', creatorsWithActiveTiers);
      setCreators(creatorsWithActiveTiers);

    } catch (error) {
      console.error('Error fetching creators:', error);
      setCreators([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSpecificCreator = async (creatorId: string) => {
    try {
      console.log(`Fetching specific creator: ${creatorId}`);
      
      // Fetch the specific creator
      const { data: creatorData, error: creatorError } = await supabase
        .from('users')
        .select('id, first_name, last_name, profile_image, bio, is_verified')
        .eq('id', creatorId)
        .eq('role', 'creator')
        .single();

      if (creatorError) {
        console.error('Error fetching specific creator:', creatorError);
        setIsLoading(false);
        return;
      }

      if (!creatorData) {
        console.log('Creator not found');
        setIsLoading(false);
        return;
      }

      console.log('Specific creator data:', creatorData);

      // Fetch their subscription tiers
      const { data: tiersData, error: tiersError } = await supabase
        .from('subscription_tiers')
        .select('id, name, price, description, benefits, popular, is_active')
        .eq('creator_id', creatorId)
        .eq('is_active', true)
        .order('price', { ascending: true });

      if (tiersError) {
        console.error('Error fetching tiers for specific creator:', tiersError);
        setIsLoading(false);
        return;
      }

      console.log(`Found ${tiersData?.length || 0} tiers for specific creator`);

      // Create a creators array with just this creator
      const creatorWithTiers = {
        ...creatorData,
        subscription_tiers: tiersData || []
      };

      setCreators([creatorWithTiers]);
      console.log('Set specific creator with tiers:', creatorWithTiers);
      setIsLoading(false);

    } catch (error) {
      console.error('Error fetching specific creator:', error);
      setIsLoading(false);
    }
  };

  const handleSubscribe = async (creatorId: string, tierId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to subscribe to creators.",
        variant: "destructive"
      });
      return;
    }

    setSelectedCreator(creatorId);
    setIsProcessing(true);

    try {
      // Find the creator and tier details
      const creator = creators.find(c => c.id === creatorId);
      const tier = creator?.subscription_tiers.find(t => t.id === tierId);
      
      if (!creator || !tier) {
        throw new Error('Creator or tier not found');
      }

      console.log('Creating subscription:', {
        user_id: user.id,
        creator_id: creatorId,
        tier_id: tierId,
        amount: tier.price
      });

      // Create subscription record in database
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          creator_id: creatorId,
          tier_id: tierId,
          amount: tier.price,
          status: 'active',
          next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
        })
        .select()
        .single();

      if (subscriptionError) {
        console.error('Error creating subscription:', subscriptionError);
        throw new Error(`Failed to create subscription: ${subscriptionError.message}`);
      }

      console.log('Subscription created:', subscriptionData);

      // Create initial payment record
      const { error: paymentError } = await supabase
        .from('subscription_payments')
        .insert({
          subscription_id: subscriptionData.id,
          amount: tier.price,
          currency: 'USD',
          payment_method: 'platform',
          payment_status: 'completed',
          external_payment_id: `sub_${Date.now()}`
        });

      if (paymentError) {
        console.error('Error creating payment record:', paymentError);
        // Don't throw here as the subscription was created successfully
      }

      // Update tier subscriber count
      const { error: tierUpdateError } = await supabase
        .from('subscription_tiers')
        .update({ 
          subscriber_count: (tier.subscriber_count || 0) + 1,
          monthly_revenue: (tier.monthly_revenue || 0) + tier.price
        })
        .eq('id', tierId);

      if (tierUpdateError) {
        console.error('Error updating tier stats:', tierUpdateError);
        // Don't throw here as the subscription was created successfully
      }

      // Success notification
      toast({
        title: "Subscription Successful! 🎉",
        description: `You're now a ${tier.name} subscriber of ${creator.first_name} ${creator.last_name}!`,
      });

      // Redirect to creator profile after a short delay
      setTimeout(() => {
        router.push(`/creators/${creatorId}`);
      }, 2000);

    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Subscription Failed",
        description: error instanceof Error ? error.message : "Failed to create subscription. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setSelectedCreator(null);
    }
  };

  const clearHighlightedCreator = () => {
    setHighlightedCreator(null);
    router.push('/subscriptions');
  };

  if (isLoading) {
    return (
      <div className="container px-4 py-12 md:px-6 md:py-24 bg-gradient-to-br from-paradisePink via-paradiseGold to-paradiseWhite min-h-screen">
        <div className="mx-auto max-w-3xl text-center">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-white/20 rounded w-2/3 mx-auto"></div>
            <div className="h-6 bg-white/20 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
        <div className="mx-auto mt-12 grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-64 bg-white/20 rounded-lg mb-4"></div>
              <div className="h-6 bg-white/20 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-white/20 rounded w-3/4 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-white/20 rounded"></div>
                <div className="h-4 bg-white/20 rounded w-5/6"></div>
                <div className="h-4 bg-white/20 rounded w-4/6"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (creators.length === 0) {
    return (
      <div className="container px-4 py-12 md:px-6 md:py-24 bg-gradient-to-br from-paradisePink via-paradiseGold to-paradiseWhite min-h-screen">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-paradisePink">
            No Active Creators Found
          </h1>
          <p className="mt-4 text-paradiseWhite text-lg">
            There are currently no creators with active subscription tiers.
          </p>
          <div className="mt-8">
            <Link href="/creators">
              <Button className="bg-gradient-to-r from-paradisePink to-paradiseGold hover:from-paradiseGold hover:to-paradisePink text-white font-semibold">
                Browse All Creators
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-12 md:px-6 md:py-24 bg-gradient-to-br from-paradisePink via-paradiseGold to-paradiseWhite min-h-screen">
      {/* Header with back button if creator is highlighted */}
      {highlightedCreator && (
        <div className="mx-auto max-w-7xl mb-8">
          <Button
            onClick={clearHighlightedCreator}
            variant="ghost"
            className="text-paradiseGold hover:text-paradisePink hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to All Creators
          </Button>
        </div>
      )}

      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-paradisePink">
          {highlightedCreator ? 'Subscribe to Creator' : 'Support Your Favorite Creators'}
        </h1>
        <p className="mt-4 text-paradiseWhite text-lg">
          {highlightedCreator 
            ? 'Choose your subscription tier and start supporting this creator today!'
            : 'Subscribe to creators you love and get exclusive content, behind-the-scenes access, and more!'
          }
        </p>
        
        <div className="mt-8 flex items-center justify-center gap-4 text-paradiseGold">
          <Heart className="h-5 w-5" />
          <span className="text-sm">Direct creator support</span>
          <Users className="h-5 w-5" />
          <span className="text-sm">Exclusive communities</span>
          <Gift className="h-5 w-5" />
          <span className="text-sm">Unique rewards</span>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-7xl">
        <h2 className="text-2xl font-bold text-paradisePink text-center mb-12">
          {highlightedCreator ? 'Subscription Tiers' : 'Available Subscription Tiers'}
        </h2>
        
        {highlightedCreator ? (
          // Show individual tier cards when a specific creator is highlighted
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {creators.flatMap(creator => 
              creator.subscription_tiers.map((tier) => (
                <div
                  key={tier.id}
                  className="bg-[#141414] rounded-xl border-2 border-paradisePink p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 relative"
                >
                  {/* Gradient outline effect */}
                  <div className="absolute inset-0 rounded-xl border-2 border-paradiseGold pointer-events-none"></div>
                  {/* Creator Info at top of each tier card */}
                  <div className="text-center mb-6">
                    <div className="relative mx-auto mb-4">
                      <div className="w-16 h-16 mx-auto rounded-full overflow-hidden border-2 border-paradiseGold">
                        {creator.profile_image ? (
                          <>
                            {console.log('Profile image URL:', creator.profile_image)}
                            <Image
                              src={supabase.storage.from('files').getPublicUrl(creator.profile_image).data.publicUrl || ''}
                              alt={`${creator.first_name} ${creator.last_name}`}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                console.error('Image failed to load:', creator.profile_image);
                                const target = e.currentTarget as HTMLImageElement;
                                target.style.display = 'none';
                                const fallback = target.nextElementSibling as HTMLElement;
                                if (fallback) {
                                  fallback.style.display = 'flex';
                                }
                              }}
                            />
                            <div className="w-full h-full bg-paradiseGold/20 flex items-center justify-center hidden">
                              <span className="text-xl text-paradiseGold font-bold">
                                {creator.first_name[0]}{creator.last_name[0]}
                              </span>
                            </div>
                          </>
                        ) : (
                          <>
                            {console.log('No profile image for:', creator.first_name, creator.last_name)}
                            <div className="w-full h-full bg-paradiseGold/20 flex items-center justify-center">
                              <span className="text-xl text-paradiseGold font-bold">
                                {creator.first_name[0]}{creator.last_name[0]}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                      {creator.is_verified && (
                        <div className="absolute -top-1 -right-1 bg-paradisePink rounded-full p-1">
                          <Check className="h-2 w-2 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-bold text-paradisePink mb-1">
                      {creator.first_name} {creator.last_name}
                    </h3>
                    {creator.bio && (
                      <p className="text-sm text-paradiseGold mb-2 line-clamp-2">
                        {creator.bio}
                      </p>
                    )}
                  </div>

                  {/* Individual Tier Card */}
                  <div className={`p-4 rounded-lg border-2 bg-[#141414] ${
                    tier.popular 
                      ? 'border-paradisePink' 
                      : 'border-paradiseGold/50'
                  }`}>
                    {tier.popular && (
                      <div className="text-center mb-2">
                        <Badge className="bg-paradisePink text-white text-xs">Most Popular</Badge>
                      </div>
                    )}
                    
                    <div className="text-center mb-3">
                      <h4 className="font-semibold text-white mb-1">{tier.name}</h4>
                      {tier.description && (
                        <p className="text-xs text-paradiseGold mb-2">{tier.description}</p>
                      )}
                      <div className="text-2xl font-bold text-paradisePink">
                        ${tier.price}
                        <span className="text-sm text-paradiseGold">/month</span>
                      </div>
                    </div>
                    
                    {tier.benefits && tier.benefits.length > 0 && (
                      <ul className="space-y-2 mb-4">
                        {tier.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start text-xs text-paradiseGold">
                            <Check className="h-3 w-3 text-paradisePink mr-2 mt-0.5 flex-shrink-0" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    
                    <Button
                      onClick={() => handleSubscribe(creator.id, tier.id)}
                      disabled={isProcessing && selectedCreator === creator.id}
                      className={`w-full text-white font-semibold transition-all duration-200 ${
                        tier.popular
                          ? 'bg-gradient-to-r from-paradisePink to-paradiseGold hover:from-paradiseGold hover:to-paradisePink'
                          : 'bg-paradisePink hover:bg-paradiseGold'
                      }`}
                    >
                      {isProcessing && selectedCreator === creator.id ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          Processing...
                        </div>
                      ) : (
                        `Subscribe to ${tier.name}`
                      )}
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          // Show creator cards when browsing all creators
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {creators.map((creator) => (
              <div
                key={creator.id}
                id={`creator-${creator.id}`}
                className={`bg-white/10 backdrop-blur-sm rounded-xl border-2 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 ${
                  highlightedCreator === creator.id 
                    ? 'border-paradisePink shadow-[0_0_30px_rgba(236,72,153,0.4)]' 
                    : 'border-paradiseGold/30'
                }`}
              >
                {/* Creator Header */}
                <div className="text-center mb-6">
                  <div className="relative mx-auto mb-4">
                    <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-paradiseGold">
                      {creator.profile_image ? (
                        <Image
                          src={supabase.storage.from('files').getPublicUrl(creator.profile_image).data.publicUrl || ''}
                          alt={`${creator.first_name} ${creator.last_name}`}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-paradiseGold/20 flex items-center justify-center">
                          <span className="text-2xl text-paradiseGold font-bold">
                            {creator.first_name[0]}{creator.last_name[0]}
                          </span>
                        </div>
                      )}
                    </div>
                    {creator.is_verified && (
                      <div className="absolute -top-1 -right-1 bg-paradisePink rounded-full p-1">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-paradisePink mb-1">
                    {creator.first_name} {creator.last_name}
                  </h3>
                  {creator.bio && (
                    <p className="text-sm text-paradiseGold mb-3 line-clamp-2">
                      {creator.bio}
                    </p>
                  )}
                  
                  <Link 
                    href={`/subscriptions?creator=${creator.id}`}
                    className="text-xs text-paradisePink hover:text-paradiseGold underline"
                  >
                    View Subscription Tiers
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* How It Works */}
      <div className="mx-auto mt-20 max-w-4xl">
        <h2 className="text-2xl font-bold text-paradisePink text-center mb-12">How Creator Subscriptions Work</h2>
        
        <div className="grid gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-paradisePink/20 rounded-full flex items-center justify-center">
              <Heart className="h-8 w-8 text-paradisePink" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Choose Your Creator</h3>
            <p className="text-sm text-paradiseGold">
              Browse verified creators and find someone whose content inspires you
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-paradiseGold/20 rounded-full flex items-center justify-center">
              <Crown className="h-8 w-8 text-paradiseGold" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Select Your Tier</h3>
            <p className="text-sm text-paradiseGold">
              Pick a subscription tier that fits your budget and desired benefits
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-paradisePink/20 rounded-full flex items-center justify-center">
              <Gift className="h-8 w-8 text-paradisePink" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Enjoy Benefits</h3>
            <p className="text-sm text-paradiseGold">
              Get exclusive content, early access, and special creator interactions
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mx-auto mt-20 max-w-4xl rounded-lg border border-paradiseGold bg-paradiseWhite p-8">
        <h2 className="text-2xl font-bold text-paradisePink text-center mb-8">Frequently Asked Questions</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-paradisePink">How do creator subscriptions work?</h3>
              <p className="mt-1 text-sm text-paradiseGold">
                You subscribe directly to individual creators, supporting them monthly while getting exclusive benefits and content.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-paradisePink">Can I cancel anytime?</h3>
              <p className="mt-1 text-sm text-paradiseGold">
                Yes, you can cancel your subscription to any creator at any time. Your benefits continue until the end of your billing period.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-paradisePink">What payment methods do you accept?</h3>
              <p className="mt-1 text-sm text-paradiseGold">
                We accept all major credit cards, PayPal, and Apple Pay. All transactions are secure and encrypted.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-paradisePink">How much goes to the creator?</h3>
              <p className="mt-1 text-sm text-paradiseGold">
                Creators receive 80% of your subscription payment, with 20% going to platform fees and payment processing.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-paradisePink">Can I subscribe to multiple creators?</h3>
              <p className="mt-1 text-sm text-paradiseGold">
                Absolutely! You can subscribe to as many creators as you want, each with their own subscription tiers and benefits.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-paradisePink">What if a creator stops posting?</h3>
              <p className="mt-1 text-sm text-paradiseGold">
                If a creator becomes inactive, you can pause or cancel your subscription. We monitor creator activity to ensure quality.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-paradiseGold">
            Have more questions?{" "}
            <Link href="/contact" className="text-paradisePink hover:underline font-medium">
              Contact our support team
            </Link>
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mx-auto mt-16 max-w-3xl text-center">
        <div className="rounded-lg border border-paradiseGold bg-paradiseWhite p-8">
          <h2 className="text-2xl font-bold text-paradisePink mb-4">Ready to Support Creators?</h2>
          <p className="text-paradiseGold mb-6">
            Join thousands of supporters who help creators bring their vision to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => document.querySelector('h2')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-r from-paradisePink to-paradiseGold hover:from-paradiseGold hover:to-paradisePink text-white font-semibold"
            >
              Browse Creators
            </Button>
            <Button variant="outline" className="border-paradiseGold text-paradisePink hover:bg-paradiseGold/10">
              <Link href="/creators">View All Creators</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
