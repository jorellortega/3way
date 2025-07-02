"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Eye, Play, Image as ImageIcon, Video, FileText, Heart, List, Grid } from "lucide-react"
import Image from "next/image"
import clsx from "clsx"
import { useAuth } from "@/hooks/useAuth"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"
import { useRouter } from "next/navigation"

const mockCategories = ["All", "Video", "Photo", "Document", "Audio"];

export default function MyContentPage() {
  const { user } = useAuth();
  const [supabase] = useState(() => createClientComponentClient<Database>())
  const router = useRouter();
  const [favorites, setFavorites] = useState<number[]>([1, 4]);
  const [activeTab, setActiveTab] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [content, setContent] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchContent = async () => {
      const { data } = await supabase
        .from("content")
        .select("id, title, price, type, thumbnail_url, status, created_at")
        .eq("creator_id", user.id)
        .order("created_at", { ascending: false });
      setContent(data || []);
    };
    fetchContent();
  }, [user]);

  // Filtering logic
  let filteredContent = content.filter((item) => {
    if (activeTab === "Favorites") {
      return favorites.includes(item.id);
    }
    if (activeTab !== "All" && activeTab !== "Categories") {
      return item.type === activeTab;
    }
    return true;
  });
  if (search.trim()) {
    filteredContent = filteredContent.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Helper functions
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />
      case 'photo':
        return <ImageIcon className="h-4 w-4" />
      case 'document':
        return <FileText className="h-4 w-4" />
      case 'audio':
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }
  const getTypeInfo = (content: any) => {
    switch (content.type) {
      case 'video':
        return `Duration: ${content.duration}`
      case 'photo':
        return `${content.imageCount} images`
      case 'document':
        return `${content.fileCount} files`
      case 'audio':
        return `${content.trackCount} tracks`
      default:
        return ''
    }
  }
  const toggleFavorite = (id: number) => {
    setFavorites((prev) => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  }
  const handleEdit = (item: any) => {
    router.push(`/mycontent/edit/${item.id}`);
  };
  const handleDelete = async (item: any) => {
    if (!confirm("Are you sure you want to delete this content?")) return;
    const { error } = await supabase.from("content").delete().eq("id", item.id);
    if (!error) {
      setContent(content.filter(c => c.id !== item.id));
    } else {
      alert("Delete failed: " + error.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-end mb-4">
        <Button asChild variant="default">
          <a href="/baddieupload">New Upload</a>
        </Button>
      </div>
      {/* Tabs and View Toggle */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex gap-2">
          <Button
            variant={activeTab === "All" ? "default" : "outline"}
            onClick={() => setActiveTab("All")}
          >
            All
          </Button>
          <Button
            variant={activeTab === "Favorites" ? "default" : "outline"}
            onClick={() => setActiveTab("Favorites")}
          >
            Favorites
          </Button>
          <Button
            variant={activeTab === "Categories" ? "default" : "outline"}
            onClick={() => setActiveTab("Categories")}
          >
            Categories
          </Button>
          {activeTab === "Categories" && (
            <div className="flex gap-2 ml-2">
              {mockCategories.filter(c => c !== "All" && c !== "Categories").map((cat) => (
                <Button
                  key={cat}
                  variant={activeTab === cat ? "default" : "outline"}
                  onClick={() => setActiveTab(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Search content..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="rounded border border-purple-900 bg-gray-900 text-white px-3 py-1 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("grid")}
            aria-label="Grid view"
          >
            <Grid className="h-5 w-5" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("list")}
            aria-label="List view"
          >
            <List className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Content Display */}
      {filteredContent.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-purple-200 mb-4">No Content Found</h2>
          <p className="text-purple-200 mb-6">Try a different search or filter.</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredContent.map((item) => (
            <Card key={item.id} className="bg-gray-900 border-purple-900/40 hover:border-purple-500 transition-colors relative">
              <button
                className={clsx("absolute top-3 right-3 z-10 p-1 rounded-full", favorites.includes(item.id) ? "bg-paradisePink text-white" : "bg-gray-800 text-purple-200")}
                onClick={() => toggleFavorite(item.id)}
                aria-label="Favorite"
                type="button"
              >
                <Heart className={clsx("h-5 w-5", favorites.includes(item.id) ? "fill-paradisePink" : "")}/>
              </button>
              <CardHeader>
                <div className="aspect-video relative overflow-hidden rounded-lg mb-4">
                  {item.thumbnail_url ? (
                    <Image
                      src={supabase.storage.from('files').getPublicUrl(item.thumbnail_url).data.publicUrl || ''}
                      alt={item.title}
                      fill
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-purple-200">No Thumbnail</div>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-purple-400 text-xs font-medium">{item.type}</span>
                  <CardTitle className="text-white text-base font-semibold truncate max-w-[180px]">{item.title}</CardTitle>
                </div>
                <CardDescription className="text-purple-200 truncate max-w-[180px]">
                  Uploaded: {new Date(item.created_at).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="text-xs text-purple-200">
                    Status: {item.status}
                  </p>
                  <p className="text-xs text-purple-200">
                    Price: ${item.price?.toFixed(2)}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between mt-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                  Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(item)}>
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-gray-900 rounded-lg border border-purple-900/40 divide-y divide-purple-900/40 overflow-hidden">
          {filteredContent.map((item) => (
            <div key={item.id} className="flex items-center px-4 py-3 gap-4 hover:bg-gray-800 transition">
              <div className="relative h-14 w-24 flex-shrink-0">
                {item.thumbnail_url ? (
                  <Image
                    src={supabase.storage.from('files').getPublicUrl(item.thumbnail_url).data.publicUrl || ''}
                    alt={item.title}
                    fill
                    className="object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-purple-200">No Thumbnail</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-purple-400 text-xs font-medium">{item.type}</span>
                  <span className="font-semibold text-white truncate max-w-[180px]">{item.title}</span>
                  <button
                    className={clsx("ml-2 p-1 rounded-full", favorites.includes(item.id) ? "bg-paradisePink text-white" : "bg-gray-800 text-purple-200")}
                    onClick={() => toggleFavorite(item.id)}
                    aria-label="Favorite"
                    type="button"
                  >
                    <Heart className={clsx("h-4 w-4", favorites.includes(item.id) ? "fill-paradisePink" : "")}/>
                  </button>
                </div>
                <div className="text-xs text-purple-200 truncate max-w-[180px]">Uploaded: {new Date(item.created_at).toLocaleDateString()}</div>
                <div className="text-xs text-purple-200 flex gap-2">
                  <span>Status: {item.status}</span>
                  <span>• Price: ${item.price?.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-purple-200 hover:text-white"
                  onClick={() => window.location.href = item.viewUrl}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-purple-200 hover:text-white"
                  onClick={() => window.location.href = item.downloadUrl}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 