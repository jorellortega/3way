"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function EditContentPage() {
  const params = useParams();
  const router = useRouter();
  const [supabase] = useState(() => createClientComponentClient<Database>());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [content, setContent] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      if (!params.id) return;
      setLoading(true);
      const { data, error } = await supabase
        .from("content")
        .select("id, title, description, price, thumbnail_url, content_url, creator_id")
        .eq("id", params.id)
        .single();
      if (error) {
        setError(error.message);
      } else if (data) {
        setContent(data);
        setTitle(data.title || "");
        setDescription(data.description || "");
        setPrice(data.price?.toString() || "");
        if (data.thumbnail_url) setThumbnailPreview(supabase.storage.from('files').getPublicUrl(data.thumbnail_url).data.publicUrl);
        if (data.content_url) setFilePreview(supabase.storage.from('files').getPublicUrl(data.content_url).data.publicUrl);
      }
      setLoading(false);
    };
    fetchContent();
  }, [params.id, supabase]);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setThumbnail(f || null);
    if (f) {
      setThumbnailPreview(URL.createObjectURL(f));
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setFile(f || null);
    if (f && f.type.startsWith("image/")) {
      setFilePreview(URL.createObjectURL(f));
    } else {
      setFilePreview(null);
    }
  };

  const sanitizeFileName = (name: string) => encodeURIComponent(name.replace(/\s+/g, "_").replace(/[^\w.-]/g, ""));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    let newThumbUrl = content.thumbnail_url;
    let newFileUrl = content.content_url;
    // Fetch user profile for folder naming
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("first_name, last_name")
      .eq("id", content.creator_id)
      .single();
    if (profileError || !profile) {
      setError("Could not fetch user profile for upload path.");
      return;
    }
    const safeName = `${profile.first_name}_${profile.last_name}`.replace(/\s+/g, '_').toLowerCase();
    const folder = `baddies/${safeName}_${content.creator_id}`;
    // Upload new thumbnail if selected
    if (thumbnail) {
      const thumbPath = `${folder}/thumbnails/${sanitizeFileName(thumbnail.name)}`;
      const { error: thumbError } = await supabase.storage.from('files').upload(thumbPath, thumbnail, { upsert: true });
      if (thumbError) {
        setError(`Thumbnail upload failed: ${thumbError.message}`);
        return;
      }
      newThumbUrl = thumbPath;
    }
    // Upload new main file if selected
    if (file) {
      const filePath = `${folder}/${sanitizeFileName(file.name)}`;
      const { error: fileError } = await supabase.storage.from('files').upload(filePath, file, { upsert: true });
      if (fileError) {
        setError(`File upload failed: ${fileError.message}`);
        return;
      }
      newFileUrl = filePath;
    }
    const { error } = await supabase
      .from("content")
      .update({ title, description, price: price ? parseFloat(price) : 0, thumbnail_url: newThumbUrl, content_url: newFileUrl })
      .eq("id", params.id);
    if (error) {
      setError(error.message);
    } else {
      router.push("/mycontent");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!content) return <div className="p-8 text-center text-purple-200">Content not found.</div>;

  return (
    <div className="container max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6 text-white">Edit Content</h1>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-purple-200 mb-1 font-medium">Title</label>
          <input
            type="text"
            className="w-full rounded border border-purple-900 bg-gray-800 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-purple-200 mb-1 font-medium">Description</label>
          <textarea
            className="w-full rounded border border-purple-900 bg-gray-800 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
          />
        </div>
        <div>
          <label className="block text-purple-200 mb-1 font-medium">Price</label>
          <input
            type="number"
            min="0"
            step="0.01"
            className="w-full rounded border border-purple-900 bg-gray-800 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
            value={price}
            onChange={e => setPrice(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-purple-200 mb-1 font-medium">Thumbnail</label>
          {thumbnailPreview && (
            <div className="mb-2">
              <Image src={thumbnailPreview} alt="Thumbnail preview" width={200} height={120} className="rounded-lg" />
            </div>
          )}
          <input type="file" accept="image/*" onChange={handleThumbnailChange} />
        </div>
        <div>
          <label className="block text-purple-200 mb-1 font-medium">Main File</label>
          {filePreview && (
            <div className="mb-2">
              <Image src={filePreview} alt="File preview" width={200} height={120} className="rounded-lg" />
            </div>
          )}
          <input type="file" onChange={handleFileChange} />
        </div>
        <Button type="submit" className="w-full bg-paradisePink hover:bg-paradiseGold text-white font-semibold">
          Save Changes
        </Button>
      </form>
    </div>
  );
} 