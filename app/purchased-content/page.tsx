"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Eye, Play, Image as ImageIcon, Video, FileText, Heart, List, Grid, ShoppingCart, Star, Clock } from "lucide-react"
import Image from "next/image"
import clsx from "clsx"
import { useAuth } from "@/hooks/useAuth"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"
import { useRouter } from "next/navigation"

const mockCategories = ["All", "Video", "Photo", "Document", "Audio", "Purchased", "Subscribed"];

export default function PurchasedContentPage() {
  const { user } = useAuth();
  const [supabase] = useState(() => createClientComponentClient<Database>())
  const router = useRouter();
  const [favorites, setFavorites] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [purchasedContent, setPurchasedContent] = useState<any[]>([]);
  const [subscriptionContent, setSubscriptionContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const fetchUserContent = async () => {
      setLoading(true);
      
      try {
        // Fetch content user has purchased (one-time purchases)
        const { data: accessData, error: accessError } = await supabase
          .from("user_content_access")
          .select(`
            content_id,
            transaction_id,
            access_granted,
            expires_at,
            created_at,
            content:content_id (
              id,
              title,
              price,
              type,
              thumbnail_url,
              status,
              created_at,
              creator:creator_id (
                first_name,
                last_name
              )
            )
          `)
          .eq("user_id", user.id)
          .eq("access_granted", true)
          .gte("expires_at", new Date().toISOString());

        if (accessError) {
          console.error("Error fetching purchased content:", accessError);
        } else {
          setPurchasedContent(accessData || []);
        }

        // Fetch content user has access to through subscriptions
        const { data: subData, error: subError } = await supabase
          .from("subscriptions")
          .select(`
            id,
            status,
            start_date,
            next_billing_date,
            amount,
            tier:subscription_tiers (
              name,
              benefits
            ),
            creator:creator_id (
              id,
              first_name,
              last_name
            )
          `)
          .eq("user_id", user.id)
          .eq("status", "active");

        if (subError) {
          console.error("Error fetching subscriptions:", subError);
        } else {
          // For now, we'll show subscription info. In a real app, you'd fetch content based on subscription tier
          setSubscriptionContent(subData || []);
        }
      } catch (error) {
        console.error("Error fetching user content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserContent();
  }, [user, supabase]);

  // Combine purchased and subscription content
  const allContent = [
    ...purchasedContent.map(item => ({
      ...item.content,
      accessType: 'purchased',
      purchaseDate: item.created_at,
      expiresAt: item.expires_at,
      transactionId: item.transaction_id
    })),
    ...subscriptionContent.map(item => ({
      id: `sub-${item.id}`,
      title: `${item.creator.first_name} ${item.creator.last_name} - ${item.tier.name}`,
      type: 'subscription',
      thumbnail_url: null,
      status: 'active',
      accessType: 'subscribed',
      purchaseDate: item.start_date,
      nextBilling: item.next_billing_date,
      amount: item.amount,
      creator: item.creator,
      tier: item.tier
    }))
  ];

  // Filtering logic
  let filteredContent = allContent.filter((item) => {
    if (activeTab === "Favorites") {
      return favorites.includes(item.id);
    }
    if (activeTab === "Purchased") {
      return item.accessType === 'purchased';
    }
    if (activeTab === "Subscribed") {
      return item.accessType === 'subscribed';
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
      case 'subscription':
        return <Star className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getTypeInfo = (content: any) => {
    if (content.accessType === 'subscribed') {
      return `$${content.amount}/month`;
    }
    
    switch (content.type) {
      case 'video':
        return `Duration: ${content.duration || 'N/A'}`
      case 'photo':
        return `${content.imageCount || 'N/A'} images`
      case 'document':
        return `${content.fileCount || 'N/A'} files`
      case 'audio':
        return `${content.trackCount || 'N/A'} tracks`
      default:
        return ''
    }
  }

  const toggleFavorite = (id: number | string) => {
    setFavorites((prev) => prev.includes(id as number) ? prev.filter(f => f !== id) : [...prev, id as number]);
  }

  const handleViewContent = (item: any) => {
    if (item.accessType === 'subscribed') {
      // For subscriptions, redirect to creator's page
      router.push(`/creators/${item.creator.id}`);
    } else {
      // For purchased content, redirect to content page
      router.push(`/content/${item.id}`);
    }
  };

  const handleDownload = (item: any) => {
    if (item.accessType === 'subscribed') {
      alert('Subscription content is available for streaming, not downloading.');
    } else {
      // Handle download logic for purchased content
      alert('Download functionality coming soon!');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="text-2xl font-semibold text-paradisePink mb-4">Loading Your Content...</div>
          <p className="text-paradiseGold">Please wait while we fetch your purchased content and subscriptions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-paradisePink mb-2">My Content Library</h1>
        <p className="text-paradiseGold">Access all your purchased content and subscription benefits</p>
      </div>

      {/* Tabs and View Toggle */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={activeTab === "All" ? "default" : "outline"}
            onClick={() => setActiveTab("All")}
          >
            All
          </Button>
          <Button
            variant={activeTab === "Purchased" ? "default" : "outline"}
            onClick={() => setActiveTab("Purchased")}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Purchased
          </Button>
          <Button
            variant={activeTab === "Subscribed" ? "default" : "outline"}
            onClick={() => setActiveTab("Subscribed")}
          >
            <Star className="h-4 w-4 mr-2" />
            Subscriptions
          </Button>
          <Button
            variant={activeTab === "Favorites" ? "default" : "outline"}
            onClick={() => setActiveTab("Favorites")}
          >
            <Heart className="h-4 w-4 mr-2" />
            Favorites
          </Button>
        </div>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Search content..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="rounded border border-paradiseGold bg-[#141414] text-white px-3 py-1 focus:outline-none focus:ring-2 focus:ring-paradisePink"
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
          <div className="text-4xl mb-4">📚</div>
          <h2 className="text-2xl font-semibold text-paradisePink mb-4">No Content Yet</h2>
          <p className="text-paradiseGold mb-6">
            {activeTab === "Purchased" 
              ? "You haven't purchased any content yet. Start exploring our marketplace!"
              : activeTab === "Subscribed"
              ? "You don't have any active subscriptions yet. Support your favorite creators!"
              : "Start building your content library by purchasing content or subscribing to creators."
            }
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild className="bg-paradisePink hover:bg-paradiseGold hover:text-paradiseBlack">
              <a href="/browse">Browse Content</a>
            </Button>
            <Button asChild variant="outline" className="border-paradiseGold text-paradiseGold hover:bg-paradiseGold hover:text-paradiseBlack">
              <a href="/creators">Discover Creators</a>
            </Button>
          </div>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredContent.map((item) => (
            <Card key={item.id} className="bg-[#141414] border-paradiseGold/30 hover:border-paradisePink transition-colors relative">
              <button
                className={clsx("absolute top-3 right-3 z-10 p-1 rounded-full", favorites.includes(item.id) ? "bg-paradisePink text-white" : "bg-[#1a1a1a] text-paradiseGold")}
                onClick={() => toggleFavorite(item.id)}
                aria-label="Favorite"
                type="button"
              >
                <Heart className={clsx("h-5 w-5", favorites.includes(item.id) ? "fill-paradisePink" : "")}/>
              </button>
              
              {/* Access Type Badge */}
              <div className="absolute top-3 left-3 z-10">
                <span className={clsx(
                  "px-2 py-1 rounded-full text-xs font-semibold",
                  item.accessType === 'purchased' 
                    ? "bg-paradiseGold text-paradiseBlack" 
                    : "bg-paradisePink text-white"
                )}>
                  {item.accessType === 'purchased' ? 'Purchased' : 'Subscribed'}
                </span>
              </div>

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
                    <div className="w-full h-full flex items-center justify-center text-paradiseGold bg-[#1a1a1a] rounded-lg">
                      {item.accessType === 'subscribed' ? '⭐' : '📄'}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  {getTypeIcon(item.type)}
                  <CardTitle className="text-white text-base font-semibold truncate max-w-[180px]">{item.title}</CardTitle>
                </div>
                <CardDescription className="text-paradiseGold truncate max-w-[180px]">
                  {item.accessType === 'purchased' 
                    ? `Purchased: ${new Date(item.purchaseDate).toLocaleDateString()}`
                    : `Subscribed since: ${new Date(item.purchaseDate).toLocaleDateString()}`
                  }
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-1">
                  {item.accessType === 'subscribed' ? (
                    <>
                      <p className="text-xs text-paradiseGold">
                        Creator: {item.creator.first_name} {item.creator.last_name}
                      </p>
                      <p className="text-xs text-paradiseGold">
                        Tier: {item.tier.name}
                      </p>
                      <p className="text-xs text-paradiseGold">
                        Next billing: {new Date(item.nextBilling).toLocaleDateString()}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-xs text-paradiseGold">
                        Status: {item.status}
                      </p>
                      <p className="text-xs text-paradiseGold">
                        Expires: {new Date(item.expiresAt).toLocaleDateString()}
                      </p>
                    </>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between mt-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleViewContent(item)}
                  className="border-paradiseGold text-paradiseGold hover:bg-paradiseGold hover:text-paradiseBlack"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleDownload(item)}
                  className="border-paradisePink text-paradisePink hover:bg-paradisePink hover:text-white"
                >
                  <Download className="h-4 w-4 mr-1" />
                  {item.accessType === 'subscribed' ? 'Access' : 'Download'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-[#141414] rounded-lg border border-paradiseGold/30 divide-y divide-paradiseGold/30 overflow-hidden">
          {filteredContent.map((item) => (
            <div key={item.id} className="flex items-center px-4 py-3 gap-4 hover:bg-[#1a1a1a] transition">
              <div className="relative h-14 w-24 flex-shrink-0">
                {item.thumbnail_url ? (
                  <Image
                    src={supabase.storage.from('files').getPublicUrl(item.thumbnail_url).data.publicUrl || ''}
                    alt={item.title}
                    fill
                    className="object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-paradiseGold bg-[#1a1a1a] rounded">
                    {item.accessType === 'subscribed' ? '⭐' : '📄'}
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={clsx(
                    "px-2 py-1 rounded-full text-xs font-semibold",
                    item.accessType === 'purchased' 
                      ? "bg-paradiseGold text-paradiseBlack" 
                      : "bg-paradisePink text-white"
                  )}>
                    {item.accessType === 'purchased' ? 'Purchased' : 'Subscribed'}
                  </span>
                  <span className="font-semibold text-white truncate max-w-[180px]">{item.title}</span>
                  <button
                    className={clsx("ml-2 p-1 rounded-full", favorites.includes(item.id) ? "bg-paradisePink text-white" : "bg-[#1a1a1a] text-paradiseGold")}
                    onClick={() => toggleFavorite(item.id)}
                    aria-label="Favorite"
                    type="button"
                  >
                    <Heart className={clsx("h-4 w-4", favorites.includes(item.id) ? "fill-paradisePink" : "")}/>
                  </button>
                </div>
                
                <div className="text-xs text-paradiseGold truncate max-w-[180px]">
                  {item.accessType === 'purchased' 
                    ? `Purchased: ${new Date(item.purchaseDate).toLocaleDateString()}`
                    : `Subscribed since: ${new Date(item.purchaseDate).toLocaleDateString()}`
                  }
                </div>
                
                <div className="text-xs text-paradiseGold flex gap-2">
                  {item.accessType === 'subscribed' ? (
                    <>
                      <span>Creator: {item.creator.first_name} {item.creator.last_name}</span>
                      <span>• Tier: {item.tier.name}</span>
                      <span>• Next billing: {new Date(item.nextBilling).toLocaleDateString()}</span>
                    </>
                  ) : (
                    <>
                      <span>Status: {item.status}</span>
                      <span>• Expires: {new Date(item.expiresAt).toLocaleDateString()}</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-paradiseGold hover:text-white"
                  onClick={() => handleViewContent(item)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-paradisePink hover:text-white"
                  onClick={() => handleDownload(item)}
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
