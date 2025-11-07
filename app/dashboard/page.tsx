"use client";
import React, { useEffect, useState } from "react";
import { User, Download, ShoppingCart, Heart, Star, Edit, CreditCard, Settings, ArrowRight, Upload, Eye, ShieldCheck, ShieldAlert, UserCircle, TrendingUp, DollarSign, Users, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import type { Database } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import { AvatarUpload } from "@/components/ui/avatar-upload";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [supabase] = useState(() => createClientComponentClient<Database>());
  const [profile, setProfile] = useState<{ first_name: string; last_name: string; email: string; role: string; profile_image?: string | null; creator_name?: string | null; account_status?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editCreatorName, setEditCreatorName] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");
  const [subscriptionTiers, setSubscriptionTiers] = useState<any[]>([]);
  const [tiersLoading, setTiersLoading] = useState(false);
  const [onboardingProgress, setOnboardingProgress] = useState<any>(null);
  const [analyticsExpanded, setAnalyticsExpanded] = useState(false);
  const [uploadedContent, setUploadedContent] = useState<any[]>([]);
  const [contentLoading, setContentLoading] = useState(false);
  const [analytics, setAnalytics] = useState<{
    totalSales: number;
    totalSalesRevenue: number;
    activeSubscriptions: number;
    subscriptionRevenue: number;
    totalRevenue: number;
    loading: boolean;
  }>({
    totalSales: 0,
    totalSalesRevenue: 0,
    activeSubscriptions: 0,
    subscriptionRevenue: 0,
    totalRevenue: 0,
    loading: true
  });

  useEffect(() => {
    if (profile) {
      setEditFirstName(profile.first_name);
      setEditLastName(profile.last_name);
      setEditCreatorName(profile.creator_name || "");
    }
  }, [profile]);

  // Fetch subscription tiers when profile is loaded and user is a creator or admin
  useEffect(() => {
    if ((profile?.role === 'creator' || profile?.role === 'admin') && user) {
      fetchSubscriptionTiers();
      fetchOnboardingProgress();
      fetchAnalytics();
      fetchUploadedContent();
    }
  }, [profile, user]);

  // Fetch uploaded content for creators/admins
  const fetchUploadedContent = async () => {
    if (!user) return;
    
    setContentLoading(true);
    try {
      const { data, error } = await supabase
        .from("content")
        .select("id, title, price, type, thumbnail_url, status, created_at")
        .eq("creator_id", user.id)
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) {
        console.error("Error fetching uploaded content:", error);
      } else {
        setUploadedContent(data || []);
      }
    } catch (error) {
      console.error("Error fetching uploaded content:", error);
    } finally {
      setContentLoading(false);
    }
  };

  // Fetch analytics data for creators/admins
  const fetchAnalytics = async () => {
    if (!user) return;
    
    setAnalytics(prev => ({ ...prev, loading: true }));
    
    try {
      // First, get all content IDs for this creator
      const { data: creatorContent, error: contentError } = await supabase
        .from("content")
        .select("id, price")
        .eq("creator_id", user.id);

      if (contentError) {
        console.error("Error fetching creator content:", contentError);
      }

      const contentIds = (creatorContent || []).map(c => c.id);
      
      // Fetch sales data (content purchases) for this creator's content
      let salesData: any[] = [];
      if (contentIds.length > 0) {
        const { data: accessData, error: salesError } = await supabase
          .from("user_content_access")
          .select(`
            content_id,
            created_at,
            content:content_id (
              price
            )
          `)
          .in("content_id", contentIds);

        if (salesError) {
          console.error("Error fetching sales data:", salesError);
        } else {
          salesData = accessData || [];
        }
      }

      // Fetch active subscriptions
      const { data: subscriptionsData, error: subscriptionsError } = await supabase
        .from("subscriptions")
        .select("id, amount, status")
        .eq("creator_id", user.id)
        .eq("status", "active");

      if (subscriptionsError) {
        console.error("Error fetching subscriptions:", subscriptionsError);
      }

      // Calculate sales metrics
      const totalSales = salesData.length;
      const totalSalesRevenue = salesData.reduce((sum, sale) => {
        const price = typeof sale.content === 'object' && sale.content ? parseFloat(sale.content.price || 0) : 0;
        return sum + price;
      }, 0);

      // Calculate subscription metrics
      const subscriptions = subscriptionsData || [];
      const activeSubscriptions = subscriptions.length;
      const subscriptionRevenue = subscriptions.reduce((sum, sub) => {
        return sum + parseFloat(sub.amount || 0);
      }, 0);

      // Calculate total revenue (monthly for subscriptions)
      const totalRevenue = totalSalesRevenue + subscriptionRevenue;

      setAnalytics({
        totalSales,
        totalSalesRevenue,
        activeSubscriptions,
        subscriptionRevenue,
        totalRevenue,
        loading: false
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setAnalytics(prev => ({ ...prev, loading: false }));
    }
  };

  // Fetch onboarding progress for creators
  const fetchOnboardingProgress = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("onboarding_progress")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching onboarding progress:", error);
        return;
      }

      setOnboardingProgress(data || null);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchSubscriptionTiers = async () => {
    try {
      setTiersLoading(true);
      const { data, error } = await supabase
        .from('subscription_tiers')
        .select('*')
        .eq('creator_id', user?.id)
        .eq('is_active', true)
        .order('price', { ascending: true });

      if (error) {
        console.error('Error fetching subscription tiers:', error);
        return;
      }

      setSubscriptionTiers(data || []);
    } catch (err) {
      console.error('Error fetching subscription tiers:', err);
    } finally {
      setTiersLoading(false);
    }
  };

  const handleAvatarUpdate = (newAvatarUrl: string | null) => {
    setProfile((prev: any) => prev ? { ...prev, profile_image: newAvatarUrl } : null);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      // Wait for the auth hook to finish loading
      if (authLoading) {
        return;
      }

      console.log('Dashboard - User:', user);
      if (!user) {
        console.log('Dashboard - No user, redirecting to signin');
        router.push('/auth/signin');
        return;
      }
      
      // Try to fetch profile with retry logic
      let retries = 0;
      const maxRetries = 3;
      
      const attemptFetch = async () => {
        console.log('Dashboard - Attempting to fetch profile for user:', user.id);
              const { data, error } = await supabase
          .from("users")
          .select("first_name, last_name, email, role, profile_image, creator_name, account_status")
          .eq("id", user.id)
          .single();
      
      if (error) {
          console.error('Error fetching profile (attempt ' + (retries + 1) + '):', error);
          
          // If profile doesn't exist yet (trigger might be delayed), retry
          if (error.code === 'PGRST116' && retries < maxRetries) {
            retries++;
            console.log('Profile not found, retrying in 1 second... (attempt ' + retries + ')');
            setTimeout(attemptFetch, 1000);
            return;
          }
          
          // If still no profile after retries, create one manually
          if (retries >= maxRetries) {
            console.log('Creating profile manually after retries failed');
            const { error: createError } = await supabase
              .from('users')
              .insert({
                id: user.id,
                email: user.email,
                first_name: user.user_metadata?.first_name || 'User',
                last_name: user.user_metadata?.last_name || '',
                role: 'user',
              });
            
            if (createError) {
              console.error('Error creating profile manually:', createError);
              router.push('/auth/signin');
              return;
            }
            
            // Fetch the newly created profile
            const { data: newData, error: newError } = await supabase
              .from("users")
            .select("first_name, last_name, email, role, creator_name")
            .eq("id", user.id)
            .single();
            
            if (newError) {
              console.error('Error fetching newly created profile:', newError);
              router.push('/auth/signin');
              return;
            }
            
            setProfile(newData);
            setLoading(false);
            return;
          }
          
          console.log('Dashboard - Profile fetch failed, redirecting to signin');
        router.push('/auth/signin');
        return;
      }
      
      if (data) {
          console.log('Dashboard - Profile fetched successfully:', data);
        setProfile(data);
        // If user has no role, set default role to 'user'
        if (!data.role) {
          const { error: updateError } = await supabase
            .from('users')
            .update({ role: 'user' })
            .eq('id', user.id);
          if (updateError) {
            console.error('Error updating role:', updateError);
          }
        }
      }
      setLoading(false);
      };
      
      attemptFetch();
    };
    fetchProfile();
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-paradisePink">Loading...</h2>
          <p className="text-paradiseBlack/80">Please wait while we load your dashboard.</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    // This case should ideally be handled by the loading state or redirect,
    // but as a fallback, we can show a message or redirect.
    router.push("/auth/signin");
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-paradisePink">Redirecting...</h2>
          <p className="text-paradiseBlack/80">
            You need to be signed in to view this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-paradisePink via-paradiseGold to-paradiseWhite p-4">
      <div className="w-full max-w-4xl space-y-8">
        {/* User Profile Card */}
        <div className="flex flex-col sm:flex-row items-center gap-6 rounded-2xl bg-[#141414] border border-paradiseGold/30 p-6 shadow-xl">
          <div className="cursor-pointer">
            <AvatarUpload
              currentAvatarUrl={profile?.profile_image}
              userId={user.id}
              onAvatarUpdate={handleAvatarUpdate}
              size="md"
            />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="text-2xl font-bold text-paradisePink">
              {loading ? "Loading..." : profile ? (profile.creator_name || `${profile.first_name} ${profile.last_name}`) : ""}
            </div>
            <div className="text-sm text-paradiseGold mt-1">
              Role: {profile.role || 'user'}
            </div>
            <div className="flex gap-2 mt-2">
              <button
                className="inline-flex items-center gap-1 rounded bg-paradisePink px-3 py-1 text-sm font-semibold text-paradiseWhite hover:bg-paradiseGold hover:text-paradiseBlack transition"
                onClick={() => setEditOpen(true)}
              >
                <Edit className="h-4 w-4" /> Edit Profile
              </button>
              <Link
                href="/settings"
                className="inline-flex items-center gap-1 rounded bg-paradiseGold px-3 py-1 text-sm font-semibold text-paradiseBlack hover:bg-paradisePink hover:text-paradiseWhite transition"
              >
                <Upload className="h-4 w-4" /> Upload Avatar
              </Link>
            </div>
          </div>
          <div className="hidden sm:block">
            <Link href="/settings" className="inline-flex items-center gap-1 text-paradiseGold hover:text-paradisePink font-semibold">
              <Settings className="h-5 w-5" /> Settings
            </Link>
          </div>
        </div>
        {editOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg p-8 shadow-xl max-w-sm w-full text-center">
              <h2 className="text-xl font-bold text-paradisePink mb-4">Edit Profile</h2>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setEditLoading(true);
                  setEditError("");
                  setEditSuccess("");
                  const { error } = await supabase
                    .from("users")
                    .update({ 
                      first_name: editFirstName, 
                      last_name: editLastName,
                      creator_name: editCreatorName || null
                    })
                    .eq("id", user.id);
                  setEditLoading(false);
                  if (error) {
                    setEditError("Failed to update profile. Please try again.");
                  } else {
                    setEditSuccess("Profile updated successfully!");
                    setProfile((prev) => prev ? { 
                      ...prev, 
                      first_name: editFirstName, 
                      last_name: editLastName,
                      creator_name: editCreatorName || null
                    } : prev);
                    setTimeout(() => setEditOpen(false), 1000);
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-paradiseBlack font-semibold mb-1" htmlFor="editFirstName">First Name</label>
                  <input
                    id="editFirstName"
                    type="text"
                    value={editFirstName}
                    onChange={e => setEditFirstName(e.target.value)}
                    className="w-full rounded border-2 border-paradiseGold p-2 text-white bg-paradiseBlack focus:outline-none focus:border-paradisePink"
                  />
                </div>
                <div>
                  <label className="block text-paradiseBlack font-semibold mb-1" htmlFor="editLastName">Last Name</label>
                  <input
                    id="editLastName"
                    type="text"
                    value={editLastName}
                    onChange={e => setEditLastName(e.target.value)}
                    className="w-full rounded border-2 border-paradiseGold p-2 text-white bg-paradiseBlack focus:outline-none focus:border-paradisePink"
                  />
                </div>
                <div>
                  <label className="block text-paradiseBlack font-semibold mb-1" htmlFor="editCreatorName">
                    <UserCircle className="inline h-4 w-4 mr-1" />Creator Name
                  </label>
                  <input
                    id="editCreatorName"
                    type="text"
                    value={editCreatorName}
                    onChange={e => setEditCreatorName(e.target.value)}
                    placeholder="Display name (optional)"
                    className="w-full rounded border-2 border-paradiseGold p-2 text-white bg-paradiseBlack focus:outline-none focus:border-paradisePink"
                  />
                  <p className="text-xs text-gray-500 mt-1">This name will be displayed instead of your real name</p>
                </div>
                {editError && <div className="text-red-600 text-sm">{editError}</div>}
                {editSuccess && <div className="text-green-600 text-sm">{editSuccess}</div>}
                <div className="flex gap-4 justify-center mt-4">
                  <button
                    type="button"
                    className="px-4 py-2 rounded bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300"
                    onClick={() => setEditOpen(false)}
                    disabled={editLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-paradisePink text-white font-semibold hover:bg-paradiseGold hover:text-paradiseBlack"
                    disabled={editLoading}
                  >
                    {editLoading ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Account Status - Only for creators and admins */}
        {(profile?.role === 'creator' || profile?.role === 'admin') && (
          <div className="rounded-xl bg-[#141414] border border-paradiseGold/30 p-6 shadow-md flex flex-col gap-2">
            <div className="flex items-center gap-4">
              {onboardingProgress?.identity_status === 'approved' && 
               onboardingProgress?.payments_setup && 
               onboardingProgress?.terms_accepted &&
               profile?.account_status === 'good_standing' ? (
                <ShieldCheck className="h-8 w-8 text-green-400" />
              ) : (
                <ShieldAlert className="h-8 w-8 text-yellow-400" />
              )}
              <div>
                <h3 className={`font-bold ${
                  onboardingProgress?.identity_status === 'approved' && 
                  onboardingProgress?.payments_setup && 
                  onboardingProgress?.terms_accepted &&
                  profile?.account_status === 'good_standing' 
                    ? 'text-green-400' 
                    : 'text-yellow-400'
                }`}>
                  Account Status: {
                    profile?.account_status === 'blocked' ? 'Blocked' :
                    profile?.account_status === 'paused' ? 'Paused' :
                    profile?.account_status === 'hold' ? 'On Hold' :
                    onboardingProgress?.identity_status === 'approved' && 
                    onboardingProgress?.payments_setup && 
                    onboardingProgress?.terms_accepted
                      ? 'Verified' 
                      : 'Not Verified'
                  }
                </h3>
                <p className={`text-sm ${
                  onboardingProgress?.identity_status === 'approved' && 
                  onboardingProgress?.payments_setup && 
                  onboardingProgress?.terms_accepted &&
                  profile?.account_status === 'good_standing'
                    ? 'text-green-300' 
                    : 'text-yellow-300'
                }`}>
                  {onboardingProgress?.identity_status === 'approved' && 
                   onboardingProgress?.payments_setup && 
                   onboardingProgress?.terms_accepted &&
                   profile?.account_status === 'good_standing'
                    ? 'Your account is verified and in good standing.'
                    : 'Please complete all onboarding steps to become a verified creator.'}
                </p>
              </div>
            </div>
            {/* Onboarding Steps */}
            <div className="mt-4">
              <div className="font-semibold text-paradiseGold mb-2">Onboarding Steps:</div>
              <ul className="space-y-2 text-white font-semibold">
                <li className="flex items-center gap-2">
                  {onboardingProgress?.terms_accepted ? (
                    <span className="text-green-400">✅</span>
                  ) : (
                    <span className="text-gray-400">⭕</span>
                  )}
                  <Link href="/onboarding" className="flex items-center gap-2 hover:text-paradisePink transition cursor-pointer">
                    <span>Step 1: Terms & Docs Accepted</span>
                    {onboardingProgress?.terms_accepted && (
                      <span className="ml-2 inline-block px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-xs font-bold">
                        Completed
                      </span>
                    )}
                    {!onboardingProgress?.terms_accepted && (
                      <span className="ml-2 text-xs text-paradisePink hover:underline">
                        Accept terms
                      </span>
                    )}
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  {onboardingProgress?.identity_status === 'approved' ? (
                    <span className="text-green-400">✅</span>
                  ) : onboardingProgress?.identity_status === 'submitted' || onboardingProgress?.identity_status === 'under_review' ? (
                    <span className="text-yellow-400">⏳</span>
                  ) : onboardingProgress?.identity_status === 'rejected' || onboardingProgress?.identity_status === 'resubmit_required' ? (
                    <span className="text-red-400">❌</span>
                  ) : (
                    <span className="text-gray-400">⭕</span>
                  )}
                  <Link href="/onboarding" className="flex items-center gap-2 hover:text-paradisePink transition cursor-pointer">
                    <span>Step 2: Identity & Age Verified</span>
                    {onboardingProgress?.identity_status === 'submitted' || onboardingProgress?.identity_status === 'under_review' ? (
                      <span className="ml-2 inline-block px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400 text-xs font-bold">
                        Under Review
                      </span>
                    ) : onboardingProgress?.identity_status === 'rejected' || onboardingProgress?.identity_status === 'resubmit_required' ? (
                      <span className="ml-2 text-xs text-red-400 hover:underline">
                        Resubmit required
                      </span>
                    ) : onboardingProgress?.identity_status === 'approved' ? (
                      <span className="ml-2 inline-block px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-xs font-bold">
                        Verified
                      </span>
                    ) : (
                      <span className="ml-2 text-xs text-paradisePink hover:underline">
                        Upload documents
                      </span>
                    )}
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  {onboardingProgress?.payments_setup ? (
                    <span className="text-green-400">✅</span>
                  ) : (
                    <span className="text-gray-400">⭕</span>
                  )}
                  <Link href="/payments" className="flex items-center gap-2 hover:text-paradisePink transition cursor-pointer">
                    <span>Step 3: Payments Setup</span>
                    {onboardingProgress?.payments_setup && (
                      <span className="ml-2 inline-block px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-xs font-bold">
                        Completed
                      </span>
                    )}
                    {!onboardingProgress?.payments_setup && (
                      <span className="ml-2 text-xs text-paradisePink hover:underline">
                        Setup payments
                      </span>
                    )}
                  </Link>
                </li>
              </ul>
            </div>
            {(onboardingProgress?.identity_status !== 'approved' || 
              !onboardingProgress?.payments_setup || 
              !onboardingProgress?.terms_accepted) && (
              <Link href="/onboarding">
                <Button className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold">
                  Complete Onboarding
                </Button>
              </Link>
            )}
          </div>
        )}

        {/* Subscription Status */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl bg-paradiseGold/90 p-6 shadow-md">
          <div>
            <div className="text-lg font-bold text-paradiseBlack">Premium Plan</div>
            <div className="text-paradiseBlack/80">Renews on Nov 15, 2025</div>
          </div>
          <Link href="/managesubscription" className="inline-flex items-center gap-1 rounded bg-paradisePink px-4 py-2 text-sm font-semibold text-paradiseWhite hover:bg-paradiseBlack hover:text-paradiseGold transition">
            <CreditCard className="h-4 w-4" /> Manage Subscription
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="rounded-xl bg-paradisePink/90 p-6 text-center shadow-md">
            <Download className="mx-auto mb-2 h-8 w-8 text-paradiseWhite" />
            <div className="text-2xl font-bold text-paradiseWhite">128</div>
            <div className="text-paradiseWhite/80">Downloads</div>
          </div>
          <div className="rounded-xl bg-paradiseGold/90 p-6 text-center shadow-md">
            <ShoppingCart className="mx-auto mb-2 h-8 w-8 text-paradiseWhite" />
            <div className="text-2xl font-bold text-paradiseWhite">24</div>
            <div className="text-paradiseWhite/80">Purchases</div>
          </div>
          <div className="rounded-xl bg-paradiseBlack/90 p-6 text-center shadow-md">
            <Heart className="mx-auto mb-2 h-8 w-8 text-paradisePink" />
            <div className="text-2xl font-bold text-paradiseWhite">56</div>
            <div className="text-paradiseWhite/80">Favorites</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/browse" className="inline-flex items-center gap-2 rounded bg-paradiseGold px-5 py-2 font-semibold text-paradiseBlack hover:bg-paradisePink hover:text-paradiseWhite transition">
            <ArrowRight className="h-4 w-4" /> Browse Content
          </Link>
          <Link href="/favorites" className="inline-flex items-center gap-2 rounded bg-paradisePink px-5 py-2 font-semibold text-paradiseWhite hover:bg-paradiseGold hover:text-paradiseBlack transition">
            <Heart className="h-4 w-4" /> View Favorites
          </Link>
          {profile?.role === 'creator' ? (
            <Link href="/baddieupload" className="inline-flex items-center gap-2 rounded bg-paradisePink px-5 py-2 font-semibold text-paradiseWhite hover:bg-paradiseGold hover:text-paradiseBlack transition">
              <Upload className="h-4 w-4" /> Upload Content
            </Link>
          ) : (
            <Link href="/purchased-content" className="inline-flex items-center gap-2 rounded bg-paradisePink px-5 py-2 font-semibold text-paradiseWhite hover:bg-paradiseGold hover:text-paradiseBlack transition">
              <Eye className="h-4 w-4" /> My Library
            </Link>
          )}
          <Link href="/settings" className="inline-flex items-center gap-2 rounded bg-paradiseBlack px-5 py-2 font-semibold text-paradiseWhite hover:bg-paradiseGold hover:text-paradiseBlack transition">
            <Settings className="h-4 w-4" /> Account Settings
          </Link>
        </div>

        {/* Recent Purchases - Only for regular users */}
        {profile?.role !== 'creator' && (
          <div className="rounded-2xl bg-[#141414] border border-paradiseGold/30 p-6 shadow-lg">
          <h2 className="text-xl font-bold text-paradisePink mb-4">Recent Purchases</h2>
          <ul className="space-y-4">
            <li className="flex items-center gap-4">
              <div className="relative h-14 w-14 overflow-hidden rounded-lg border-2 border-paradiseGold">
                <Image src="/purchase1.jpg" alt="Purchase 1" fill className="object-cover" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-white">City Nightscape Photo Collection</div>
                <div className="text-sm text-gray-300">Purchased 2 days ago</div>
              </div>
              <button className="inline-flex items-center gap-1 rounded bg-paradiseGold px-3 py-1 text-sm font-semibold text-paradiseBlack hover:bg-paradisePink hover:text-paradiseWhite transition">
                <Download className="h-4 w-4" /> Download
              </button>
            </li>
            <li className="flex items-center gap-4">
              <div className="relative h-14 w-14 overflow-hidden rounded-lg border-2 border-paradiseGold">
                <Image src="/purchase2.jpg" alt="Purchase 2" fill className="object-cover" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-white">3D Model Asset Bundle</div>
                <div className="text-sm text-gray-300">Purchased 1 week ago</div>
              </div>
              <button className="inline-flex items-center gap-1 rounded bg-paradiseGold px-3 py-1 text-sm font-semibold text-paradiseBlack hover:bg-paradisePink hover:text-paradiseWhite transition">
                <Download className="h-4 w-4" /> Download
              </button>
            </li>
            <li className="flex items-center gap-4">
              <div className="relative h-14 w-14 overflow-hidden rounded-lg border-2 border-paradiseGold">
                <Image src="/purchase3.jpg" alt="Purchase 3" fill className="object-cover" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-white">Abstract Digital Art Pack</div>
                <div className="text-sm text-gray-300">Purchased 2 weeks ago</div>
              </div>
              <button className="inline-flex items-center gap-1 rounded bg-paradiseGold px-3 py-1 text-sm font-semibold text-paradiseBlack hover:bg-paradisePink hover:text-paradiseWhite transition">
                <Download className="h-4 w-4" /> Download
              </button>
            </li>
          </ul>
        </div>
        )}

        {/* Recent Activity */}
        <div className="rounded-2xl bg-[#141414] border border-paradiseGold/30 p-6 shadow-lg">
          <h2 className="text-xl font-bold text-paradisePink mb-4">Recent Activity</h2>
          <ul className="space-y-4">
            <li className="flex items-center gap-4">
              <Star className="h-6 w-6 text-paradiseGold" />
              <span className="text-white">Rated a creator: <span className="font-semibold text-paradisePink">DigitalDesigner</span></span>
              <span className="ml-auto text-sm text-paradiseGold">2 hours ago</span>
            </li>
            <li className="flex items-center gap-4">
              <Download className="h-6 w-6 text-paradisePink" />
              <span className="text-white">Downloaded <span className="font-semibold text-paradiseGold">City Nightscape Photo Collection</span></span>
              <span className="ml-auto text-sm text-paradiseGold">Yesterday</span>
            </li>
            <li className="flex items-center gap-4">
              <ShoppingCart className="h-6 w-6 text-paradiseGold" />
              <span className="text-white">Purchased <span className="font-semibold text-paradisePink">3D Model Asset Bundle</span></span>
              <span className="ml-auto text-sm text-paradiseGold">2 days ago</span>
            </li>
          </ul>
        </div>

        {/* My Uploaded Content - Only for creators and admins */}
        {(profile?.role === 'creator' || profile?.role === 'admin') && (
          <div className="rounded-2xl bg-[#141414] border border-paradiseGold/30 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-paradisePink">My Uploaded Content</h2>
              <div className="flex gap-2">
                <Link href="/mycontent" className="inline-flex items-center gap-1 rounded bg-paradiseGold px-3 py-1 text-sm font-semibold text-paradiseBlack hover:bg-paradisePink hover:text-paradiseWhite transition">
                  <Eye className="h-4 w-4" /> View All
                </Link>
                <Link href="/baddieupload" className="inline-flex items-center gap-1 rounded bg-paradisePink px-3 py-1 text-sm font-semibold text-paradiseWhite hover:bg-paradiseGold hover:text-paradiseBlack transition">
                  <Upload className="h-4 w-4" /> Upload New
                </Link>
              </div>
            </div>
            {contentLoading ? (
              <div className="text-center py-8">
                <div className="text-paradiseGold">Loading content...</div>
              </div>
            ) : uploadedContent.length > 0 ? (
              <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {uploadedContent.map((item) => (
                  <Link key={item.id} href={`/mycontent/edit/${item.id}`} className="block">
                    <li className="rounded-lg border-2 border-paradiseGold overflow-hidden bg-[#141414] shadow hover:border-paradisePink transition">
                      <div className="relative h-28 w-full">
                        {item.thumbnail_url ? (
                          <Image 
                            src={supabase.storage.from('files').getPublicUrl(item.thumbnail_url).data.publicUrl} 
                            alt={item.title} 
                            fill 
                            className="object-cover" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-paradiseGold/10 text-paradiseGold">
                            No Thumbnail
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <div className="font-semibold text-white truncate">{item.title}</div>
                        <div className="text-xs text-gray-300">
                          {new Date(item.created_at).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-paradiseGold mt-1">
                          ${item.price?.toFixed(2)} • {item.type}
                        </div>
                      </div>
                    </li>
                  </Link>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📁</div>
                <div className="text-paradisePink font-semibold mb-2">No Content Yet</div>
                <div className="text-gray-300 mb-4">Start uploading your content to see it here</div>
                <Link href="/baddieupload" className="inline-flex items-center gap-2 rounded bg-paradisePink px-4 py-2 font-semibold text-paradiseWhite hover:bg-paradiseGold hover:text-paradiseBlack transition">
                  <Upload className="h-4 w-4" /> Upload Your First Content
                </Link>
              </div>
            )}
          </div>
        )}

        {/* My Purchased Content - For all users (creators can also purchase content) */}
        <div className="rounded-2xl bg-[#141414] border border-paradiseGold/30 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-paradisePink">My Purchased Content</h2>
            <div className="flex gap-2">
              <Link href="/purchased-content" className="inline-flex items-center gap-1 rounded bg-paradiseGold px-3 py-1 text-sm font-semibold text-paradiseBlack hover:bg-paradisePink hover:text-paradiseWhite transition">
                <Eye className="h-4 w-4" /> View Library
              </Link>
              <Link href="/browse" className="inline-flex items-center gap-1 rounded bg-paradisePink px-3 py-1 text-sm font-semibold text-paradiseWhite hover:bg-paradiseGold hover:text-paradiseBlack transition">
                <ShoppingCart className="h-4 w-4" /> Browse More
              </Link>
            </div>
          </div>
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-lg font-semibold text-paradisePink mb-2">Your Digital Library</h3>
            <p className="text-gray-300 mb-4">
              Access all your purchased content and subscription benefits in one place
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="bg-[#1a1a1a] rounded-lg p-3 border border-paradiseGold/30">
                <div className="text-2xl mb-2">🛒</div>
                <div className="text-sm font-semibold text-paradiseGold">Purchased Content</div>
                <div className="text-xs text-gray-300">One-time purchases</div>
              </div>
              <div className="bg-[#1a1a1a] rounded-lg p-3 border border-paradisePink/30">
                <div className="text-2xl mb-2">⭐</div>
                <div className="text-sm font-semibold text-paradisePink">Subscriptions</div>
                <div className="text-xs text-gray-300">Ongoing access</div>
              </div>
            </div>
            <Link href="/purchased-content" className="inline-flex items-center gap-2 rounded bg-paradisePink px-6 py-3 font-semibold text-paradiseWhite hover:bg-paradiseGold hover:text-paradiseBlack transition">
              <Eye className="h-5 w-5" /> View My Library
            </Link>
          </div>
        </div>

        {/* User Subscription Summary Card - Only for regular users */}
        {profile?.role !== 'creator' && (
          <div className="rounded-2xl bg-[#141414] border border-paradiseGold/30 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-paradisePink">My Subscriptions</h2>
              <div className="flex gap-2">
                <Link href="/purchased-content" className="inline-flex items-center gap-1 rounded bg-paradiseGold px-3 py-1 text-sm font-semibold text-paradiseBlack hover:bg-paradisePink hover:text-paradiseWhite transition">
                  <Eye className="h-4 w-4" /> View All
                </Link>
                <Link href="/creators" className="inline-flex items-center gap-1 rounded bg-paradisePink px-3 py-1 text-sm font-semibold text-paradiseWhite hover:bg-paradiseGold hover:text-paradiseBlack transition">
                  <Star className="h-4 w-4" /> Discover Creators
                </Link>
              </div>
            </div>
            <div className="text-center py-6">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-lg font-semibold text-paradisePink mb-2">Support Your Favorite Creators</h3>
              <p className="text-gray-300 mb-4">
                Subscribe to creators to get exclusive content and support their work
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="bg-[#1a1a1a] rounded-lg p-3 border border-paradiseGold/30">
                  <div className="text-lg font-semibold text-paradiseGold">0</div>
                  <div className="text-xs text-gray-300">Active Subscriptions</div>
                </div>
                <div className="bg-[#1a1a1a] rounded-lg p-3 border border-paradisePink/30">
                  <div className="text-lg font-semibold text-paradisePink">$0.00</div>
                  <div className="text-xs text-gray-300">Monthly Spending</div>
                </div>
              </div>
              <Link href="/creators" className="inline-flex items-center gap-2 rounded bg-paradisePink px-6 py-3 font-semibold text-paradiseWhite hover:bg-paradiseGold hover:text-paradiseBlack transition">
                <Star className="h-5 w-5" /> Find Creators to Support
              </Link>
            </div>
          </div>
        )}

        {/* My Packages Card - Only for creators and admins */}
        {(profile?.role === 'creator' || profile?.role === 'admin') && (
          <div className="rounded-2xl bg-[#141414] border border-paradiseGold/30 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-paradisePink">My Packages</h2>
              <div className="flex gap-2">
                <Link href="/packages" className="inline-flex items-center gap-1 rounded bg-paradiseGold px-3 py-1 text-sm font-semibold text-paradiseBlack hover:bg-paradisePink hover:text-paradiseWhite transition">
                  <Eye className="h-4 w-4" /> View All
                </Link>
                <Link href="/edit-packages" className="inline-flex items-center gap-1 rounded bg-paradiseGold px-3 py-1 text-sm font-semibold text-paradiseBlack hover:bg-paradiseGold hover:text-paradiseBlack transition">
                  <Upload className="h-4 w-4" /> Manage Packages
                </Link>
              </div>
            </div>
            <div className="text-center py-8">
              <div className="text-4xl mb-2">📦</div>
              <p className="text-gray-300 mb-4">Create and manage your content packages</p>
              <Link href="/edit-packages" className="inline-flex items-center gap-2 rounded bg-paradisePink px-4 py-2 font-semibold text-paradiseWhite hover:bg-paradiseGold hover:text-paradiseBlack transition">
                <Upload className="h-4 w-4" /> Create Your First Package
              </Link>
            </div>
          </div>
        )}

        {/* Analytics Card - Only for creators and admins */}
        {(profile?.role === 'creator' || profile?.role === 'admin') && (
          <div className="rounded-2xl bg-[#141414] border border-paradiseGold/30 p-6 shadow-lg">
            <div 
              className="flex items-center justify-between mb-4 cursor-pointer"
              onClick={() => setAnalyticsExpanded(!analyticsExpanded)}
            >
              <h2 className="text-xl font-bold text-paradisePink flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Analytics & Revenue
              </h2>
              <button
                className="text-paradiseGold hover:text-paradisePink transition-colors"
                aria-label={analyticsExpanded ? "Collapse" : "Expand"}
              >
                {analyticsExpanded ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </button>
            </div>
            
            {analyticsExpanded && (
              <>
                {analytics.loading ? (
                  <div className="text-center py-8">
                    <div className="text-paradiseGold">Loading analytics...</div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Revenue Summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-[#1a1a1a] rounded-lg p-4 border border-paradiseGold/30">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-paradiseGold">Total Revenue</span>
                          <DollarSign className="h-4 w-4 text-paradisePink" />
                        </div>
                        <div className="text-2xl font-bold text-paradisePink">
                          ${analytics.totalRevenue.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Sales + Subscriptions
                        </div>
                      </div>
                      
                      <div className="bg-[#1a1a1a] rounded-lg p-4 border border-paradiseGold/30">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-paradiseGold">Sales Revenue</span>
                          <ShoppingCart className="h-4 w-4 text-paradiseGold" />
                        </div>
                        <div className="text-2xl font-bold text-paradiseGold">
                          ${analytics.totalSalesRevenue.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {analytics.totalSales} total sales
                        </div>
                      </div>
                      
                      <div className="bg-[#1a1a1a] rounded-lg p-4 border border-paradisePink/30">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-paradiseGold">Monthly Subscriptions</span>
                          <Star className="h-4 w-4 text-paradisePink" />
                        </div>
                        <div className="text-2xl font-bold text-paradisePink">
                          ${analytics.subscriptionRevenue.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {analytics.activeSubscriptions} active
                        </div>
                      </div>
                      
                      <div className="bg-[#1a1a1a] rounded-lg p-4 border border-paradiseGold/30">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-paradiseGold">Total Sales</span>
                          <Download className="h-4 w-4 text-paradiseGold" />
                        </div>
                        <div className="text-2xl font-bold text-paradiseGold">
                          {analytics.totalSales}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Content purchases
                        </div>
                      </div>
                    </div>

                    {/* Active Subscriptions */}
                    <div className="bg-[#1a1a1a] rounded-lg p-4 border border-paradiseGold/30">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-paradisePink flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Active Subscribers
                        </h3>
                        <span className="text-2xl font-bold text-paradiseGold">
                          {analytics.activeSubscriptions}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">
                        Total active subscriptions to your content tiers
                      </p>
                    </div>

                    {/* Projected Annual Revenue */}
                    <div className="bg-[#1a1a1a] rounded-lg p-4 border border-paradisePink/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-paradisePink mb-1">Projected Annual Revenue</h3>
                          <p className="text-xs text-gray-400">Based on current subscriptions</p>
                        </div>
                        <div className="text-2xl font-bold text-paradisePink">
                          ${(analytics.subscriptionRevenue * 12 + analytics.totalSalesRevenue).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Creator Subscription Management Card - Only show for creators and admins */}
        {(profile?.role === 'creator' || profile?.role === 'admin') && (
          <div className="rounded-2xl bg-[#141414] border border-paradiseGold/30 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-paradisePink">Subscription Tiers</h2>
              <div className="flex gap-2">
                <Link href="/subscriptions" className="inline-flex items-center gap-1 rounded bg-paradiseGold px-3 py-1 text-sm font-semibold text-paradiseBlack hover:bg-paradisePink hover:text-paradiseWhite transition">
                  <Eye className="h-4 w-4" /> View Public Page
                </Link>
                <Link href="/edit-subscriptions" className="inline-flex items-center gap-1 rounded bg-paradisePink px-3 py-1 text-sm font-semibold text-paradiseWhite hover:bg-paradiseGold hover:text-paradiseBlack transition">
                  <Settings className="h-4 w-4" /> Manage Tiers
                </Link>
              </div>
            </div>
            
            {/* Current Subscription Tiers Display */}
            {tiersLoading ? (
              <div className="text-center py-8">
                <div className="text-paradiseGold">Loading subscription tiers...</div>
              </div>
            ) : subscriptionTiers.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📊</div>
                <div className="text-paradisePink font-semibold mb-2">No Subscription Tiers Yet</div>
                <div className="text-gray-300 mb-4">Create your first subscription tier to start earning from supporters</div>
                <Link href="/edit-subscriptions" className="inline-flex items-center gap-2 rounded bg-paradisePink px-4 py-2 font-semibold text-paradiseWhite hover:bg-paradiseGold hover:text-paradiseBlack transition">
                  <Settings className="h-4 w-4" /> Create First Tier
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-3 mb-6">
                {subscriptionTiers.map((tier) => (
                  <div key={tier.id} className={`p-4 border rounded-lg bg-[#1a1a1a] ${tier.popular ? 'border-2 border-paradisePink' : 'border-paradiseGold/30'}`}>
                    {tier.popular && (
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                        <span className="bg-paradisePink text-white text-xs px-2 py-1 rounded-full">Most Popular</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-paradisePink">{tier.name}</h4>
                      <span className={`text-xs px-2 py-1 rounded ${tier.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {tier.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="text-lg font-bold text-paradiseGold mb-2">${tier.price}<span className="text-sm text-gray-400">/month</span></div>
                    <div className="text-xs text-gray-300 mb-3">
                      {tier.benefits?.slice(0, 4).map((benefit: string, index: number) => (
                        <div key={index}>• {benefit}</div>
                      ))}
                      {tier.benefits && tier.benefits.length > 4 && (
                        <div className="text-paradiseGold">+{tier.benefits.length - 4} more benefits</div>
                      )}
                    </div>
                    <div className="text-xs text-paradiseGold font-medium">{tier.subscriber_count || 0} active subscribers</div>
                  </div>
                ))}
              </div>
            )}

            {/* Subscription Stats */}
            {!tiersLoading && subscriptionTiers.length > 0 && (
              <div className="grid grid-cols-3 gap-4 p-4 bg-[#1a1a1a] rounded-lg mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-paradisePink">
                    {subscriptionTiers.reduce((sum, tier) => sum + (tier.subscriber_count || 0), 0)}
                  </div>
                  <div className="text-xs text-gray-300">Total Subscribers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-paradiseGold">
                    ${subscriptionTiers.reduce((sum, tier) => sum + ((tier.price || 0) * (tier.subscriber_count || 0)), 0).toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-300">Monthly Revenue</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-paradisePink">
                    ${(subscriptionTiers.reduce((sum, tier) => sum + ((tier.price || 0) * (tier.subscriber_count || 0)), 0) * 12).toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-300">Annual Revenue</div>
                </div>
              </div>
            )}

            <div className="text-center">
              <Link href="/edit-subscriptions" className="inline-flex items-center gap-2 rounded bg-paradisePink px-6 py-3 font-semibold text-paradiseWhite hover:bg-paradiseGold hover:text-paradiseBlack transition">
                <Settings className="h-5 w-5" /> Customize Subscription Tiers
              </Link>
            </div>
          </div>
        )}

        {/* Creator Upgrade Card - Show for non-creators */}
        {profile?.role !== 'creator' && (
          <div className="rounded-2xl bg-[#141414] border border-paradiseGold/30 p-6 shadow-lg">
            <div className="text-center">
              <div className="text-4xl mb-4">🎨</div>
              <h2 className="text-xl font-bold text-paradisePink mb-2">Become a Creator</h2>
              <p className="text-gray-300 mb-4">
                Start earning from your content by creating subscription tiers for your supporters.
              </p>
              <button
                onClick={async () => {
                  try {
                    const { error } = await supabase
                      .from('users')
                      .update({ role: 'creator' })
                      .eq('id', user.id);
                    
                    if (error) {
                      console.error('Error updating role:', error);
                      alert('Failed to upgrade to creator. Please try again.');
                    } else {
                      setProfile(prev => prev ? { ...prev, role: 'creator' } : prev);
                      alert('Congratulations! You are now a creator. You can now manage subscription tiers.');
                    }
                  } catch (err) {
                    console.error('Error:', err);
                    alert('Failed to upgrade to creator. Please try again.');
                  }
                }}
                className="inline-flex items-center gap-2 rounded bg-paradisePink px-6 py-3 font-semibold text-paradiseWhite hover:bg-paradiseGold hover:text-paradiseBlack transition"
              >
                <Star className="h-5 w-5" /> Upgrade to Creator
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
