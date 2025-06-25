import React from "react";

export default function AccountStatusCard() {
  return (
    <div className="rounded-xl p-6 bg-green-100 border border-green-300 shadow flex flex-col gap-2 max-w-2xl mx-auto mt-6" style={{background: 'linear-gradient(90deg, #fa709a 0%, #fee140 100%)', padding: 0}}>
      <div className="rounded-xl p-6 bg-green-100 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#D1FADF"/><path d="M8 12.5l2.5 2.5 5-5" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span className="font-bold text-green-800 text-lg">Account Status: Verified</span>
        </div>
        <div className="text-green-800">Your account is verified and in good standing.</div>
        <div className="mt-4">
          <div className="font-semibold text-green-700 mb-2">Onboarding Steps:</div>
          <ul className="space-y-1">
            <li>✅ Step 1: Identity & Age Verified</li>
            <li>✅ Step 2: Payments Setup</li>
            <li>✅ Step 3: Terms & Docs Accepted</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 