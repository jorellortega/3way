"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Eye, Play, Image as ImageIcon, Video, FileText, Heart, List, Grid } from "lucide-react"
import Image from "next/image"
import clsx from "clsx"

const mockCategories = ["All", "Video", "Photo", "Document", "Audio"];

export default function MyContentPage() {
  // Mock data for purchased content
  const [favorites, setFavorites] = useState<number[]>([1, 4]);
  const [activeTab, setActiveTab] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");

  const purchasedContent = [
    {
      id: 1,
      title: "Summer Collection 2024",
      creator: "Jane Doe",
      type: "video",
      category: "Video",
      thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=60",
      purchaseDate: "2024-03-15",
      downloadUrl: "/downloads/summer-collection.mp4",
      viewUrl: "/view/summer-collection",
      size: "2.4 GB",
      duration: "45:30"
    },
    {
      id: 2,
      title: "Beach Photoshoot",
      creator: "John Smith",
      type: "photo",
      category: "Photo",
      thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=60",
      purchaseDate: "2024-03-10",
      downloadUrl: "/downloads/beach-photoshoot.zip",
      viewUrl: "/view/beach-photoshoot",
      size: "156 MB",
      imageCount: 24
    },
    {
      id: 3,
      title: "Digital Art Bundle",
      creator: "Sarah Wilson",
      type: "photo",
      category: "Photo",
      thumbnail: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800&auto=format&fit=crop&q=60",
      purchaseDate: "2024-03-05",
      downloadUrl: "/downloads/digital-art.zip",
      viewUrl: "/view/digital-art",
      size: "320 MB",
      imageCount: 15
    },
    {
      id: 4,
      title: "Tutorial Series",
      creator: "Mike Johnson",
      type: "video",
      category: "Video",
      thumbnail: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800&auto=format&fit=crop&q=60",
      purchaseDate: "2024-03-01",
      downloadUrl: "/downloads/tutorial-series.zip",
      viewUrl: "/view/tutorial-series",
      size: "4.2 GB",
      duration: "2:15:30"
    },
    {
      id: 5,
      title: "Premium Templates",
      creator: "Design Studio",
      type: "document",
      category: "Document",
      thumbnail: "https://images.unsplash.com/photo-1465101178521-c1a9136a3fd9?w=800&auto=format&fit=crop&q=60",
      purchaseDate: "2024-02-28",
      downloadUrl: "/downloads/premium-templates.zip",
      viewUrl: "/view/premium-templates",
      size: "85 MB",
      fileCount: 12
    },
    {
      id: 6,
      title: "Music Collection",
      creator: "Sound Lab",
      type: "audio",
      category: "Audio",
      thumbnail: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800&auto=format&fit=crop&q=60",
      purchaseDate: "2024-02-25",
      downloadUrl: "/downloads/music-collection.zip",
      viewUrl: "/view/music-collection",
      size: "1.8 GB",
      trackCount: 30
    }
  ];

  // Filtering logic
  let filteredContent = purchasedContent.filter((item) => {
    if (activeTab === "Favorites") {
      return favorites.includes(item.id);
    }
    if (activeTab !== "All" && activeTab !== "Categories") {
      return item.category === activeTab;
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

  return (
    <div className="container mx-auto px-4 py-8">
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
          {filteredContent.map((content) => (
            <Card key={content.id} className="bg-gray-900 border-purple-900/40 hover:border-purple-500 transition-colors relative">
              <button
                className={clsx("absolute top-3 right-3 z-10 p-1 rounded-full", favorites.includes(content.id) ? "bg-paradisePink text-white" : "bg-gray-800 text-purple-200")}
                onClick={() => toggleFavorite(content.id)}
                aria-label="Favorite"
                type="button"
              >
                <Heart className={clsx("h-5 w-5", favorites.includes(content.id) ? "fill-paradisePink" : "")}/>
              </button>
              <CardHeader>
                <div className="aspect-video relative overflow-hidden rounded-lg mb-4">
                  <Image
                    src={content.thumbnail}
                    alt={content.title}
                    fill
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="text-white hover:text-purple-200">
                      <Play className="h-8 w-8" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  {getTypeIcon(content.type)}
                  <CardTitle className="text-white text-base font-semibold truncate max-w-[180px]">{content.title}</CardTitle>
                </div>
                <CardDescription className="text-purple-200 truncate max-w-[180px]">
                  by {content.creator}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="text-xs text-purple-200">
                    Purchased: {new Date(content.purchaseDate).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-purple-200">
                    {getTypeInfo(content)}
                  </p>
                  <p className="text-xs text-purple-200">
                    Size: {content.size}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-purple-200 hover:text-white"
                  onClick={() => window.location.href = content.viewUrl}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-purple-200 hover:text-white"
                  onClick={() => window.location.href = content.downloadUrl}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-gray-900 rounded-lg border border-purple-900/40 divide-y divide-purple-900/40 overflow-hidden">
          {filteredContent.map((content) => (
            <div key={content.id} className="flex items-center px-4 py-3 gap-4 hover:bg-gray-800 transition">
              <div className="relative h-14 w-24 flex-shrink-0">
                <Image
                  src={content.thumbnail}
                  alt={content.title}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {getTypeIcon(content.type)}
                  <span className="font-semibold text-white truncate max-w-[180px]">{content.title}</span>
                  <button
                    className={clsx("ml-2 p-1 rounded-full", favorites.includes(content.id) ? "bg-paradisePink text-white" : "bg-gray-800 text-purple-200")}
                    onClick={() => toggleFavorite(content.id)}
                    aria-label="Favorite"
                    type="button"
                  >
                    <Heart className={clsx("h-4 w-4", favorites.includes(content.id) ? "fill-paradisePink" : "")}/>
                  </button>
                </div>
                <div className="text-xs text-purple-200 truncate max-w-[180px]">by {content.creator}</div>
                <div className="text-xs text-purple-200 flex gap-2">
                  <span>{getTypeInfo(content)}</span>
                  <span>• Size: {content.size}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-purple-200 hover:text-white"
                  onClick={() => window.location.href = content.viewUrl}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-purple-200 hover:text-white"
                  onClick={() => window.location.href = content.downloadUrl}
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