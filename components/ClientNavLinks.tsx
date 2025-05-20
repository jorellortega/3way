"use client";
import Link from "next/link";

export default function ClientNavLinks({ isSignedIn }: { isSignedIn: boolean }) {
  return (
    <>
      <Link href="/packages" className="text-purple-200 hover:text-purple-400">
        Packages
      </Link>
      {isSignedIn && (
        <Link href="/mycontent" className="text-purple-200 hover:text-purple-400">
          My Content
        </Link>
      )}
    </>
  );
} 