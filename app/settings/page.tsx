import React from "react";
import { User, Mail, Lock, Bell, Smartphone, Save } from "lucide-react";
import Image from "next/image";

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-paradisePink via-paradiseGold to-paradiseWhite p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-paradiseWhite bg-opacity-90 p-8 shadow-xl space-y-8">
        <h1 className="text-3xl font-extrabold text-paradisePink mb-2 text-center">Account Settings</h1>
        {/* Profile Info */}
        <section className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            <div className="relative h-20 w-20 overflow-hidden rounded-full border-4 border-paradiseGold">
              <Image src="/avatar-placeholder.png" alt="User avatar" fill className="object-cover" />
            </div>
            <button className="rounded bg-paradiseGold px-3 py-1 text-sm font-semibold text-paradiseBlack hover:bg-paradisePink hover:text-paradiseWhite transition">Change Avatar</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-paradiseBlack font-semibold mb-1" htmlFor="name"><User className="inline h-4 w-4 mr-1" />Name</label>
              <input id="name" type="text" defaultValue="Jane Doe" className="w-full rounded border-2 border-paradiseGold p-2 text-paradiseBlack focus:outline-none focus:border-paradisePink" />
            </div>
            <div>
              <label className="block text-paradiseBlack font-semibold mb-1" htmlFor="email"><Mail className="inline h-4 w-4 mr-1" />Email</label>
              <input id="email" type="email" defaultValue="jane.doe@email.com" className="w-full rounded border-2 border-paradiseGold p-2 text-paradiseBlack focus:outline-none focus:border-paradisePink" />
            </div>
          </div>
          <div>
            <label className="block text-paradiseBlack font-semibold mb-1" htmlFor="password"><Lock className="inline h-4 w-4 mr-1" />Change Password</label>
            <input id="password" type="password" placeholder="••••••••" className="w-full rounded border-2 border-paradiseGold p-2 text-paradiseBlack focus:outline-none focus:border-paradisePink" />
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
        <button className="mt-6 w-full flex items-center justify-center gap-2 rounded bg-paradisePink px-6 py-3 text-lg font-bold text-paradiseWhite hover:bg-paradiseGold hover:text-paradiseBlack transition">
          <Save className="h-5 w-5" /> Save Changes
        </button>
      </div>
    </div>
  );
} 