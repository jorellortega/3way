"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

const PLAN_DETAILS: Record<string, { name: string; price: string; features: string[] }> = {
  basic: {
    name: "Basic",
    price: "$9.99/month",
    features: [
      "Access to standard content",
      "10 downloads per month",
      "Standard resolution",
    ],
  },
  premium: {
    name: "Premium",
    price: "$19.99/month",
    features: [
      "Access to premium content",
      "50 downloads per month",
      "High resolution",
      "Early access to new content",
    ],
  },
  pro: {
    name: "Pro",
    price: "$39.99/month",
    features: [
      "Access to all content",
      "Unlimited downloads",
      "Maximum resolution",
      "Commercial usage rights",
      "Priority support",
    ],
  },
};

export default function SubscribePlanPage() {
  const params = useParams();
  const plan = typeof params.plan === 'string' ? params.plan : Array.isArray(params.plan) ? params.plan[0] : '';
  const details = PLAN_DETAILS[plan];

  if (!details) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Plan Not Found</h1>
        <Link href="/packages" className="text-paradisePink underline">Back to Plans</Link>
      </div>
    );
  }

  return (
    <div className="container max-w-lg mx-auto py-12">
      <h1 className="text-3xl font-bold text-center mb-6">Subscribe to {details.name}</h1>
      <div className="rounded-lg bg-white/80 shadow p-8 mb-8">
        <div className="text-2xl font-bold text-paradisePink mb-2">{details.price}</div>
        <ul className="mb-6 list-disc list-inside text-gray-700">
          {details.features.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
        <div className="bg-yellow-100 border border-yellow-300 rounded p-4 text-yellow-800 text-center mb-4">
          <strong>Checkout integration coming soon!</strong>
        </div>
        <Link href="/packages" className="block text-center text-paradisePink underline mt-4">Back to Plans</Link>
      </div>
    </div>
  );
} 