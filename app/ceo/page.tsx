"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function CEOPage() {
  const { user } = useAuth();
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
    <div className="max-w-xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6">Branding Admin</h1>
      <div className="mb-6 flex flex-col items-center">
        <div className="w-32 h-32 rounded-full bg-white/30 flex items-center justify-center mb-4 overflow-hidden">
          {logoUrl ? (
            <Image src={logoUrl} alt="Logo" width={96} height={96} />
          ) : (
            <span className="text-3xl text-paradisePink font-bold">Logo</span>
          )}
        </div>
        <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} className="mb-2" />
        <Button onClick={handleDelete} variant="destructive" disabled={!logoUrl}>Delete Logo</Button>
        {error && <div className="text-red-500 mt-2">{error}</div>}
        {success && <div className="text-green-500 mt-2">{success}</div>}
      </div>
    </div>
  );
} 