import React from "react";
import Link from "next/link";

export default function HowToPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-paradisePink via-paradiseGold to-paradiseWhite p-4">
      <div className="bg-white bg-opacity-90 rounded-xl shadow-lg p-8 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-paradisePink mb-4 text-center">How Paradise Baddies Works</h1>
        <p className="text-lg text-paradiseBlack mb-6 text-center">
          Paradise Baddies is a digital marketplace where creators can share and monetize their content, and fans can discover, purchase, and enjoy exclusive works. We prioritize safety, privacy, and a seamless experience for both creators and buyers.
        </p>
        <h2 className="text-2xl font-bold text-paradisePink mb-2 mt-6">Getting Started</h2>
        <ol className="list-decimal list-inside text-paradiseBlack space-y-2 mb-6">
          <li>
            <span className="font-semibold">Sign Up:</span> <Link href="/auth/signup" className="text-paradisePink underline">Create an account</Link> as a creator or fan.
          </li>
          <li>
            <span className="font-semibold">Verify Identity & Age:</span> Upload your ID for verification to access or sell premium content.
          </li>
          <li>
            <span className="font-semibold">Set Up Payments:</span> <Link href="/payments" className="text-paradisePink underline">Add your payment method</Link> to buy or get paid for content.
          </li>
          <li>
            <span className="font-semibold">Browse & Discover:</span> <Link href="/browse" className="text-paradisePink underline">Explore content</Link> from top creators.
          </li>
          <li>
            <span className="font-semibold">Purchase or Subscribe:</span> Buy individual items or subscribe for unlimited access.
          </li>
          <li>
            <span className="font-semibold">Manage Your Content:</span> Creators can <Link href="/creatordash" className="text-paradisePink underline">upload and manage</Link> their works and track revenue.
          </li>
        </ol>
        <h2 className="text-2xl font-bold text-paradisePink mb-2 mt-6">Legal & Safety Information</h2>
        <ul className="list-disc list-inside text-paradiseBlack space-y-2 mb-6">
          <li>All users must be 18+ and complete identity verification before accessing or selling premium content.</li>
          <li>Content must comply with our <Link href="/terms" className="text-paradisePink underline">Terms of Service</Link> and <Link href="/privacy" className="text-paradisePink underline">Privacy Policy</Link>.</li>
          <li>Creators are responsible for the legality and originality of their uploads, including AI-generated works.</li>
          <li>We do not allow illegal, non-consensual, or copyright-infringing content.</li>
          <li>All payments are processed securely. We do not store your payment details.</li>
          <li>Disputes are handled according to our published policies and applicable law.</li>
        </ul>
        <div className="text-center mt-8">
          <Link href="/auth/signup" className="inline-block px-6 py-3 rounded bg-paradisePink text-white font-bold hover:bg-paradiseGold hover:text-paradiseBlack transition text-lg">
            Get Started Now
          </Link>
        </div>
      </div>
    </div>
  );
} 