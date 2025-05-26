"use client";
import React, { useEffect, useState } from "react";
import { User, Download, ShoppingCart, Heart, Star, Edit, CreditCard, Settings, ArrowRight, Upload, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<{ first_name: string; last_name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from("users")
        .select("first_name, last_name, email")
        .eq("id", user.id)
        .single();
      if (data) setProfile(data);
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-paradisePink via-paradiseGold to-paradiseWhite p-4">
      <div className="w-full max-w-4xl space-y-8">
        {/* User Profile Card */}
        <div className="flex flex-col sm:flex-row items-center gap-6 rounded-2xl bg-paradiseWhite bg-opacity-90 p-6 shadow-xl">
          <div className="relative h-20 w-20 overflow-hidden rounded-full border-4 border-paradiseGold">
            <Image src="/avatar-placeholder.png" alt="User avatar" fill className="object-cover" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="text-2xl font-bold text-paradisePink">
              {loading ? "Loading..." : profile ? `${profile.first_name} ${profile.last_name}` : ""}
            </div>
            <div className="text-paradiseBlack/80">
              {loading ? "" : profile ? profile.email : ""}
            </div>
            <button className="mt-2 inline-flex items-center gap-1 rounded bg-paradisePink px-3 py-1 text-sm font-semibold text-paradiseWhite hover:bg-paradiseGold hover:text-paradiseBlack transition">
              <Edit className="h-4 w-4" /> Edit Profile
            </button>
          </div>
          <div className="hidden sm:block">
            <Link href="/settings" className="inline-flex items-center gap-1 text-paradiseGold hover:text-paradisePink font-semibold">
              <Settings className="h-5 w-5" /> Settings
            </Link>
          </div>
        </div>

        {/* Subscription Status */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl bg-paradiseGold/90 p-6 shadow-md">
          <div>
            <div className="text-lg font-bold text-paradiseBlack">Premium Plan</div>
            <div className="text-paradiseBlack/80">Renews on Nov 15, 2025</div>
          </div>
          <button className="inline-flex items-center gap-1 rounded bg-paradisePink px-4 py-2 text-sm font-semibold text-paradiseWhite hover:bg-paradiseBlack hover:text-paradiseGold transition">
            <CreditCard className="h-4 w-4" /> Manage Subscription
          </button>
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
          <Link href="/settings" className="inline-flex items-center gap-2 rounded bg-paradiseBlack px-5 py-2 font-semibold text-paradiseWhite hover:bg-paradiseGold hover:text-paradiseBlack transition">
            <Settings className="h-4 w-4" /> Account Settings
          </Link>
        </div>

        {/* Recent Purchases */}
        <div className="rounded-2xl bg-paradiseWhite bg-opacity-90 p-6 shadow-lg">
          <h2 className="text-xl font-bold text-paradisePink mb-4">Recent Purchases</h2>
          <ul className="space-y-4">
            <li className="flex items-center gap-4">
              <div className="relative h-14 w-14 overflow-hidden rounded-lg border-2 border-paradiseGold">
                <Image src="/purchase1.jpg" alt="Purchase 1" fill className="object-cover" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-paradiseBlack">City Nightscape Photo Collection</div>
                <div className="text-sm text-paradiseBlack/70">Purchased 2 days ago</div>
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
                <div className="font-semibold text-paradiseBlack">3D Model Asset Bundle</div>
                <div className="text-sm text-paradiseBlack/70">Purchased 1 week ago</div>
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
                <div className="font-semibold text-paradiseBlack">Abstract Digital Art Pack</div>
                <div className="text-sm text-paradiseBlack/70">Purchased 2 weeks ago</div>
              </div>
              <button className="inline-flex items-center gap-1 rounded bg-paradiseGold px-3 py-1 text-sm font-semibold text-paradiseBlack hover:bg-paradisePink hover:text-paradiseWhite transition">
                <Download className="h-4 w-4" /> Download
              </button>
            </li>
          </ul>
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl bg-paradiseWhite bg-opacity-90 p-6 shadow-lg">
          <h2 className="text-xl font-bold text-paradisePink mb-4">Recent Activity</h2>
          <ul className="space-y-4">
            <li className="flex items-center gap-4">
              <Star className="h-6 w-6 text-paradiseGold" />
              <span className="text-paradiseBlack">Rated a creator: <span className="font-semibold text-paradisePink">DigitalDesigner</span></span>
              <span className="ml-auto text-sm text-paradiseGold">2 hours ago</span>
            </li>
            <li className="flex items-center gap-4">
              <Download className="h-6 w-6 text-paradisePink" />
              <span className="text-paradiseBlack">Downloaded <span className="font-semibold text-paradiseGold">City Nightscape Photo Collection</span></span>
              <span className="ml-auto text-sm text-paradiseGold">Yesterday</span>
            </li>
            <li className="flex items-center gap-4">
              <ShoppingCart className="h-6 w-6 text-paradiseGold" />
              <span className="text-paradiseBlack">Purchased <span className="font-semibold text-paradisePink">3D Model Asset Bundle</span></span>
              <span className="ml-auto text-sm text-paradiseGold">2 days ago</span>
            </li>
          </ul>
        </div>

        {/* My Content Card */}
        <div className="rounded-2xl bg-paradiseWhite bg-opacity-90 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-paradisePink">My Content</h2>
            <div className="flex gap-2">
              <Link href="/mycontent" className="inline-flex items-center gap-1 rounded bg-paradiseGold px-3 py-1 text-sm font-semibold text-paradiseBlack hover:bg-paradisePink hover:text-paradiseWhite transition">
                <Eye className="h-4 w-4" /> View All
              </Link>
            <button className="inline-flex items-center gap-1 rounded bg-paradisePink px-3 py-1 text-sm font-semibold text-paradiseWhite hover:bg-paradiseGold hover:text-paradiseBlack transition">
              <Upload className="h-4 w-4" /> Upload New
            </button>
          </div>
          </div>
          <Link href="/mycontent" className="block">
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <li className="rounded-lg border-2 border-paradiseGold overflow-hidden bg-paradiseWhite shadow hover:border-paradisePink transition">
              <div className="relative h-28 w-full">
                <Image src="/mycontent1.jpg" alt="Content 1" fill className="object-cover" />
              </div>
              <div className="p-3">
                <div className="font-semibold text-paradiseBlack">Urban Sunset</div>
                <div className="text-xs text-paradiseBlack/60">Uploaded 3 days ago</div>
              </div>
            </li>
              <li className="rounded-lg border-2 border-paradiseGold overflow-hidden bg-paradiseWhite shadow hover:border-paradisePink transition">
              <div className="relative h-28 w-full">
                <Image src="/mycontent2.jpg" alt="Content 2" fill className="object-cover" />
              </div>
              <div className="p-3">
                <div className="font-semibold text-paradiseBlack">Neon Dreams</div>
                <div className="text-xs text-paradiseBlack/60">Uploaded 1 week ago</div>
              </div>
            </li>
              <li className="rounded-lg border-2 border-paradiseGold overflow-hidden bg-paradiseWhite shadow hover:border-paradisePink transition">
              <div className="relative h-28 w-full">
                <Image src="/mycontent3.jpg" alt="Content 3" fill className="object-cover" />
              </div>
              <div className="p-3">
                <div className="font-semibold text-paradiseBlack">Abstract Flow</div>
                <div className="text-xs text-paradiseBlack/60">Uploaded 2 weeks ago</div>
              </div>
            </li>
          </ul>
          </Link>
        </div>
      </div>
    </div>
  );
}
