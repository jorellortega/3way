"use client";
import React from "react";
import { User, Mail, Lock, Bell, Smartphone, Save } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/supabase";
import { useAuth } from "@/hooks/useAuth";
import { AvatarUpload } from "@/components/ui/avatar-upload";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [supabase] = useState(() => createClientComponentClient<Database>());
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from("users")
        .select("first_name, last_name, email, role, profile_image, bio")
        .eq("id", user.id)
        .single();

      if (!error && data) {
        setProfile(data);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [user, supabase]);

  const handleDelete = () => {
    setShowConfirm(false);
    alert("Account deletion is not implemented yet.");
  };

  const handleAvatarUpdate = (newAvatarUrl: string | null) => {
    setProfile((prev: any) => ({ ...prev, profile_image: newAvatarUrl }));
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-paradisePink via-paradiseGold to-paradiseWhite p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-paradisePink">Loading...</h2>
          <p className="text-paradiseBlack/80">Please wait while we load your settings.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-paradisePink via-paradiseGold to-paradiseWhite p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Authentication Required</h2>
          <p className="text-paradiseBlack/80">You must be logged in to view settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-paradisePink via-paradiseGold to-paradiseWhite p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-paradiseWhite bg-opacity-90 p-8 shadow-xl space-y-8">
        <h1 className="text-3xl font-extrabold text-paradisePink mb-2 text-center">Account Settings</h1>
        
        {/* Profile Info */}
        <section className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            <AvatarUpload
              currentAvatarUrl={profile?.profile_image}
              userId={user.id}
              onAvatarUpdate={handleAvatarUpdate}
              size="lg"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-paradiseBlack font-semibold mb-1" htmlFor="firstName">
                <User className="inline h-4 w-4 mr-1" />First Name
              </label>
              <input 
                id="firstName" 
                type="text" 
                defaultValue={profile?.first_name || ''} 
                className="w-full rounded border-2 border-paradiseGold p-2 text-paradiseBlack focus:outline-none focus:border-paradisePink" 
              />
            </div>
            <div>
              <label className="block text-paradiseBlack font-semibold mb-1" htmlFor="lastName">
                <User className="inline h-4 w-4 mr-1" />Last Name
              </label>
              <input 
                id="lastName" 
                type="text" 
                defaultValue={profile?.last_name || ''} 
                className="w-full rounded border-2 border-paradiseGold p-2 text-paradiseBlack focus:outline-none focus:border-paradisePink" 
              />
            </div>
          </div>
          
          <div>
            <label className="block text-paradiseBlack font-semibold mb-1" htmlFor="email">
              <Mail className="inline h-4 w-4 mr-1" />Email
            </label>
            <input 
              id="email" 
              type="email" 
              defaultValue={profile?.email || ''} 
              disabled
              className="w-full rounded border-2 border-gray-300 p-2 text-gray-500 bg-gray-100" 
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>
          
          <div>
            <label className="block text-paradiseBlack font-semibold mb-1" htmlFor="bio">
              Bio
            </label>
            <textarea 
              id="bio" 
              rows={3}
              defaultValue={profile?.bio || ''} 
              placeholder="Tell us about yourself..."
              className="w-full rounded border-2 border-paradiseGold p-2 text-paradiseBlack focus:outline-none focus:border-paradisePink" 
            />
          </div>
          
          <div>
            <label className="block text-paradiseBlack font-semibold mb-1" htmlFor="password">
              <Lock className="inline h-4 w-4 mr-1" />Change Password
            </label>
            <input 
              id="password" 
              type="password" 
              placeholder="••••••••" 
              className="w-full rounded border-2 border-paradiseGold p-2 text-paradiseBlack focus:outline-none focus:border-paradisePink" 
            />
          </div>
        </section>
        
        {/* Notification Preferences */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-paradisePink">Notifications</h2>
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-paradisePink" defaultChecked />
              <Bell className="h-4 w-4 text-paradisePink" /> Email Notifications
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-paradiseGold" />
              <Smartphone className="h-4 w-4 text-paradiseGold" /> SMS Notifications
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-paradiseBlack" />
              <Bell className="h-4 w-4 text-paradiseBlack" /> Push Notifications
            </label>
          </div>
        </section>
        
        <Button className="mt-6 w-full bg-paradisePink hover:bg-paradiseGold text-paradiseWhite">
          <Save className="h-5 w-5 mr-2" /> Save Changes
        </Button>
        
        <button
          className="mt-4 w-full flex items-center justify-center gap-2 rounded border-2 border-red-500 bg-transparent px-6 py-3 text-lg font-bold text-red-600 hover:bg-red-500 hover:text-white transition"
          onClick={() => setShowConfirm(true)}
        >
          Delete Account
        </button>
        
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg p-8 shadow-xl max-w-sm w-full text-center">
              <h2 className="text-xl font-bold text-red-600 mb-4">Confirm Account Deletion</h2>
              <p className="mb-6 text-paradiseBlack">Are you sure you want to delete your account? This action cannot be undone.</p>
              <div className="flex gap-4 justify-center">
                <button
                  className="px-4 py-2 rounded bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300"
                  onClick={() => setShowConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700"
                  onClick={handleDelete}
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 