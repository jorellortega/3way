"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function ManageContentPage() {
  const { user } = useAuth();
  const [content, setContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFields, setEditFields] = useState<any>({});

  useEffect(() => {
    if (!user) return;
    const fetchContent = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("content")
        .select("id, title, description, price, type, status, thumbnail_url, content_url, created_at")
        .eq("creator_id", user.id)
        .order("created_at", { ascending: false });
      if (error) setError(error.message);
      else setContent(data || []);
      setLoading(false);
    };
    fetchContent();
  }, [user]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this content?")) return;
    const { error } = await supabase.from("content").delete().eq("id", id);
    if (error) setError(error.message);
    else setContent(content.filter((c) => c.id !== id));
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setEditFields({
      title: item.title,
      description: item.description,
      price: item.price,
      status: item.status,
    });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setEditFields({ ...editFields, [e.target.name]: e.target.value });
  };

  const handleEditSave = async (id: number) => {
    const { error } = await supabase.from("content").update({
      title: editFields.title,
      description: editFields.description,
      price: parseFloat(editFields.price),
      status: editFields.status,
    }).eq("id", id);
    if (error) setError(error.message);
    else {
      setContent(content.map((c) => c.id === id ? { ...c, ...editFields, price: parseFloat(editFields.price) } : c));
      setEditingId(null);
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditFields({});
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-paradisePink">Manage My Content</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : content.length === 0 ? (
        <div className="text-purple-200">You have not uploaded any content yet.</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {content.map((item) => (
            <div key={item.id} className="bg-gray-900 border border-purple-900/40 rounded-lg p-4 flex flex-col md:flex-row gap-4">
              <div className="w-32 h-24 relative rounded overflow-hidden bg-gray-800 flex-shrink-0">
                {item.thumbnail_url ? (
                  <Image src={supabase.storage.from('files').getPublicUrl(item.thumbnail_url).data.publicUrl} alt={item.title} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-purple-200">No Thumbnail</div>
                )}
              </div>
              <div className="flex-1 flex flex-col justify-between">
                {editingId === item.id ? (
                  <div className="space-y-2">
                    <input
                      className="w-full rounded border border-purple-900 bg-gray-800 text-white px-2 py-1"
                      name="title"
                      value={editFields.title}
                      onChange={handleEditChange}
                      placeholder="Title"
                    />
                    <textarea
                      className="w-full rounded border border-purple-900 bg-gray-800 text-white px-2 py-1"
                      name="description"
                      value={editFields.description}
                      onChange={handleEditChange}
                      placeholder="Description"
                    />
                    <input
                      className="w-full rounded border border-purple-900 bg-gray-800 text-white px-2 py-1"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={editFields.price}
                      onChange={handleEditChange}
                      placeholder="Price"
                    />
                    <select
                      className="w-full rounded border border-purple-900 bg-gray-800 text-white px-2 py-1"
                      name="status"
                      value={editFields.status}
                      onChange={handleEditChange}
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                      <option value="archived">Archived</option>
                    </select>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="default" onClick={() => handleEditSave(item.id)}>Save</Button>
                      <Button size="sm" variant="outline" onClick={handleEditCancel}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-lg font-semibold text-white mb-1">{item.title}</div>
                    <div className="text-purple-200 text-sm mb-2">{item.description}</div>
                    <div className="text-purple-400 text-xs mb-1">Type: {item.type} | Status: {item.status}</div>
                    <div className="text-purple-400 text-xs mb-1">Price: ${item.price?.toFixed(2)}</div>
                    <div className="text-purple-400 text-xs">Uploaded: {new Date(item.created_at).toLocaleString()}</div>
                  </div>
                )}
                <div className="flex gap-2 mt-3">
                  {editingId === item.id ? null : (
                    <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>Edit</Button>
                  )}
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>Delete</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 