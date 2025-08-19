"use client";
import React, { useEffect, useState } from "react";
import { User, Download, ShoppingCart, Heart, Star, Edit, CreditCard, Settings, ArrowRight, Upload, Eye, ShieldCheck, ShieldAlert } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import type { Database } from "@/types/supabase";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [supabase] = useState(() => createClientComponentClient<Database>());
  const [profile, setProfile] = useState<{ first_name: string; last_name: string; email: string; role: string; profile_image?: string | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");
  const [subscriptionTiers, setSubscriptionTiers] = useState<any[]>([]);
  const [tiersLoading, setTiersLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setEditFirstName(profile.first_name);
      setEditLastName(profile.last_name);
    }
  }, [profile]);

  // Fetch subscription tiers when profile is loaded and user is a creator
  useEffect(() => {
    if (profile?.role === 'creator' && user) {
      fetchSubscriptionTiers();
    }
  }, [profile, user]);

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
          .select("first_name, last_name, email, role, profile_image")
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
              .select("first_name, last_name, email, role")
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
          <div className="relative h-20 w-20 overflow-hidden rounded-full border-4 border-paradiseGold">
            {profile?.profile_image ? (
              <Image 
                src={supabase.storage.from('files').getPublicUrl(profile.profile_image).data.publicUrl} 
                alt="User avatar" 
                fill 
                className="object-cover" 
              />
            ) : (
              <Image src="/avatar-placeholder.png" alt="User avatar" fill className="object-cover" />
            )}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="text-2xl font-bold text-paradisePink">
              {loading ? "Loading..." : profile ? `${profile.first_name} ${profile.last_name}` : ""}
            </div>
            <div className="text-white">
              {loading ? "" : profile ? profile.email : ""}
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
                    .update({ first_name: editFirstName, last_name: editLastName })
                    .eq("id", user.id);
                  setEditLoading(false);
                  if (error) {
                    setEditError("Failed to update profile. Please try again.");
                  } else {
                    setEditSuccess("Profile updated successfully!");
                    setProfile((prev) => prev ? { ...prev, first_name: editFirstName, last_name: editLastName } : prev);
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

        {/* Account Status - Only for creators */}
        {profile?.role === 'creator' && (
          <div className="rounded-xl bg-[#141414] border border-paradiseGold/30 p-6 shadow-md flex flex-col gap-2">
            <div className="flex items-center gap-4">
              {profile.first_name !== 'User' ? (
                <ShieldCheck className="h-8 w-8 text-green-400" />
              ) : (
                <ShieldAlert className="h-8 w-8 text-yellow-400" />
              )}
              <div>
                <h3 className={`font-bold ${profile.first_name !== 'User' ? 'text-green-400' : 'text-yellow-400'}`}>
                  Account Status: {profile.first_name !== 'User' ? 'Verified' : 'Not Verified'}
                </h3>
                <p className={`text-sm ${profile.first_name !== 'User' ? 'text-green-300' : 'text-yellow-300'}`}>
                  {profile.first_name !== 'User'
                    ? 'Your account is verified and in good standing.'
                    : 'Please complete your profile to become a verified user.'}
                </p>
              </div>
            </div>
            {/* Onboarding Steps (mock data, all complete) */}
            <div className="mt-4">
              <div className="font-semibold text-green-400 mb-2">Onboarding Steps:</div>
              <ul className="space-y-1 text-white font-semibold">
                <li>
                  ✅ Step 1: Identity & Age Verified
                  <a href="/onboarding" className="ml-3 inline-block px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-xs font-bold hover:bg-green-500/30 transition underline">
                    Documents submitted
                  </a>
                </li>
                <li>
                  ✅ Step 2: Payments Setup
                  <a href="/payments" className="ml-3 inline-block px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-xs font-bold hover:bg-green-500/30 transition underline">
                    Manage payments
                  </a>
                </li>
                <li>✅ Step 3: Terms & Docs Accepted</li>
              </ul>
            </div>
            {profile.first_name === 'User' && (
              <Link href="/settings">
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold">
                  Complete Profile
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

        {/* Content Management Cards - Different for creators vs users */}
        {profile?.role === 'creator' ? (
          /* Creator Content Card */
          <div className="rounded-2xl bg-[#141414] border border-paradiseGold/30 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-paradisePink">My Content</h2>
              <div className="flex gap-2">
                <Link href="/mycontent" className="inline-flex items-center gap-1 rounded bg-paradiseGold px-3 py-1 text-sm font-semibold text-paradiseBlack hover:bg-paradisePink hover:text-paradiseWhite transition">
                  <Eye className="h-4 w-4" /> View All
                </Link>
                <Link href="/baddieupload" className="inline-flex items-center gap-1 rounded bg-paradisePink px-3 py-1 text-sm font-semibold text-paradiseWhite hover:bg-paradiseGold hover:text-paradiseBlack transition">
                  <Upload className="h-4 w-4" /> Upload New
                </Link>
              </div>
            </div>
            <Link href="/mycontent" className="block">
              <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <li className="rounded-lg border-2 border-paradiseGold overflow-hidden bg-[#141414] shadow hover:border-paradisePink transition">
                  <div className="relative h-28 w-full">
                    <Image src="/mycontent1.jpg" alt="Content 1" fill className="object-cover" />
                  </div>
                  <div className="p-3">
                    <div className="font-semibold text-white">Urban Sunset</div>
                    <div className="text-xs text-gray-300">Uploaded 3 days ago</div>
                  </div>
                </li>
                <li className="rounded-lg border-2 border-paradiseGold overflow-hidden bg-[#141414] shadow hover:border-paradisePink transition">
                  <div className="relative h-28 w-full">
                    <Image src="/mycontent2.jpg" alt="Content 2" fill className="object-cover" />
                  </div>
                  <div className="p-3">
                    <div className="font-semibold text-white">Neon Dreams</div>
                    <div className="text-xs text-gray-300">Uploaded 1 week ago</div>
                  </div>
                </li>
                <li className="rounded-lg border-2 border-paradiseGold overflow-hidden bg-[#141414] shadow hover:border-paradisePink transition">
                  <div className="relative h-28 w-full">
                    <Image src="/mycontent3.jpg" alt="Content 3" fill className="object-cover" />
                  </div>
                  <div className="p-3">
                    <div className="font-semibold text-white">Abstract Flow</div>
                    <div className="text-xs text-gray-300">Uploaded 2 weeks ago</div>
                  </div>
                </li>
              </ul>
            </Link>
          </div>
        ) : (
          /* User Content Library Card */
          <div className="rounded-2xl bg-[#141414] border border-paradiseGold/30 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-paradisePink">My Content Library</h2>
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
        )}

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

        {/* My Packages Card - Only for creators */}
        {profile?.role === 'creator' && (
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

        {/* Creator Subscription Management Card - Only show for creators */}
        {profile?.role === 'creator' && (
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
