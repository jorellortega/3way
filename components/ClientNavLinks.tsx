"use client";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function ClientNavLinks({ isSignedIn }: { isSignedIn: boolean }) {
  const { user } = useAuth();
  
  return (
    <>
      <Link href="/packages" className="text-purple-200 hover:text-purple-400">
        Packages
      </Link>
      {isSignedIn && user?.role === 'creator' && (
        <Link href="/mycontent" className="text-purple-200 hover:text-purple-400">
          My Content
        </Link>
      )}
      {isSignedIn && user?.role !== 'creator' && (
        <Link href="/purchased-content" className="text-purple-200 hover:text-purple-400">
          My Library
        </Link>
      )}
    </>
  );
} 