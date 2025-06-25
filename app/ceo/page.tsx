"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Settings, Image as ImageIcon } from 'lucide-react';

export default function CEOPage() {
  const { user } = useAuth();
  const [supabase] = useState(() => createClientComponentClient<Database>());
  const [role, setRole] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchRole = async () => {
      if (!user) return;
      const { data, error } = await supabase.from("users").select("role").eq("id", user.id).single();
      if (error) console.error('fetchRole error:', error);
      setRole(data?.role || null);
    };
    const fetchLogo = async () => {
      const { data, error } = await supabase.storage.from('files').download('logo.png');
      if (error) console.error('fetchLogo error:', error);
      if (data) {
        const url = URL.createObjectURL(data);
        setLogoUrl(url);
      } else {
        setLogoUrl(null);
      }
    };
    fetchRole();
    fetchLogo();
  }, [user]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(""); setSuccess("");
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { error: uploadError } = await supabase.storage.from('files').upload('logo.png', file, { upsert: true });
    setUploading(false);
    if (uploadError) {
      setError(uploadError.message);
    } else {
      setSuccess("Logo uploaded!");
      // Update branding table
      const { error: upsertError } = await supabase.from('branding').upsert({ logo_url: `logo.png`, updated_by: user.id });
      if (upsertError) console.error('branding upsert error:', upsertError);
      // Refresh logo
      const { data: newLogo, error: downloadError } = await supabase.storage.from('files').download('logo.png');
      if (downloadError) console.error('download after upload error:', downloadError);
      if (newLogo) setLogoUrl(URL.createObjectURL(newLogo));
    }
  };

  const handleDelete = async () => {
    setError(""); setSuccess("");
    const { error: removeError } = await supabase.storage.from('files').remove(['logo.png']);
    if (removeError) {
      setError(removeError.message);
    } else {
      setSuccess("Logo deleted!");
      setLogoUrl(null);
      const { error: deleteError } = await supabase.from('branding').delete().neq('id', '');
      if (deleteError) console.error('branding delete error:', deleteError);
    }
  };

  if (!user) return <div className="p-8 text-center">You must be signed in.</div>;
  if (role !== "ceo" && role !== "admin") return <div className="p-8 text-center">Access denied.</div>;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Branding</CardTitle>
            <ImageIcon className="h-5 w-5 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <div className="w-32 h-32 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4 overflow-hidden">
                {logoUrl ? (
                  <Image src={logoUrl} alt="Logo" width={96} height={96} className="object-contain" />
                ) : (
                  <span className="text-xl text-gray-500 font-bold">Logo</span>
                )}
              </div>
              <input type="file" id="logo-upload" accept="image/*" onChange={handleUpload} disabled={uploading} className="hidden" />
              <label htmlFor="logo-upload" className="cursor-pointer">
                <Button asChild variant="outline">
                  <span>{uploading ? "Uploading..." : "Upload Logo"}</span>
                </Button>
              </label>
              <Button onClick={handleDelete} variant="destructive" size="sm" disabled={!logoUrl}>Delete Logo</Button>
              {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
              {success && <div className="text-green-500 text-sm mt-2">{success}</div>}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Site Settings</CardTitle>
            <Settings className="h-5 w-5 text-gray-500" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Manage other site settings and configurations.
            </CardDescription>
            <Link href="/ceo/bookingedit" passHref>
              <Button>Manage Booking Options</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 