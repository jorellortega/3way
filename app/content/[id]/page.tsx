"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Heart, Share2, ShoppingCart, Image as ImageIcon, User as UserIcon } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useAuth } from "@/hooks/useAuth";
import type { Database } from "@/types/supabase";
import { CartContext } from "@/app/cart-context";
import { useContext } from "react";
import { StarRating } from "@/components/ui/star-rating";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Content {
  id: string;
  title: string;
  description: string | null;
  price: number;
  type: string;
  status: string;
  thumbnail_url: string | null;
  content_url: string | null;
  creator: {
    id: string;
    first_name: string;
    last_name: string;
    profile_image: string | null;
  } | null;
}

export default function ContentDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const [supabase] = useState(() => createClientComponentClient<Database>());
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [related, setRelated] = useState<any[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasAccess, setHasAccess] = useState(false);
  const { addToCart } = useContext(CartContext);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      if (!params.id) return;
      setLoading(true);

      const { data: contentData, error: contentError } = await supabase
        .from("content")
        .select(
          `
          *,
          creator:users (
            id,
            first_name,
            last_name,
            profile_image
          )
        `
        )
        .eq("id", params.id)
        .single();

      if (contentError) {
        setError(contentError.message);
      } else {
        setContent(contentData);
        if (contentData?.price === 0) {
          setHasAccess(true);
        }
      }
      setLoading(false);
    };

    const fetchRelated = async () => {
      const { data } = await supabase
        .from("content")
        .select("id, title, price, type, thumbnail_url, status")
        .eq("status", "published")
        .neq("id", params.id)
        .order("created_at", { ascending: false })
        .limit(4);
      setRelated(data || []);
    };

    fetchContent();
    fetchRelated();
  }, [params.id, supabase]);

  useEffect(() => {
    const checkAccess = async () => {
      if (user && content) {
        const { data: accessData, error: accessError } = await supabase
          .from("user_content_access")
          .select("id")
          .eq("user_id", user.id)
          .eq("content_id", content.id)
          .single();

        if (accessData) {
          setHasAccess(true);
        }
      }
    };
    if (content) {
      checkAccess();
    }
  }, [user, content, supabase]);

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Number(e.target.value);
      setCurrentTime(Number(e.target.value));
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!content) return <div className="p-8 text-center text-purple-200">Content not found.</div>;

  return (
    <div className="bg-gradient-to-br from-gray-950 via-purple-950/80 to-gray-950 min-h-screen">
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="mb-4 flex items-center gap-2">
          <Link href="/browse" className="flex items-center gap-1 text-sm text-purple-300 hover:text-purple-400">
            <ArrowLeft className="h-4 w-4" />
            Back to Browse
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-4">
            <div className="overflow-hidden rounded-lg border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
              <div className="relative aspect-[4/3] w-full">
                {content.type === 'video' && content.content_url ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-black">
                    <video
                      ref={videoRef}
                      src={supabase.storage.from('files').getPublicUrl(content.content_url).data.publicUrl}
                      width={800}
                      height={600}
                      className="rounded-lg w-full h-auto max-h-[480px] bg-black"
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleLoadedMetadata}
                      controls={false}
                    />
                    <div className="flex items-center gap-2 w-full mt-2">
                      <Button size="icon" variant="outline" onClick={handlePlayPause} className="bg-purple-800 text-white flex items-center justify-center h-10 w-10 p-0">
                        {isPlaying ? (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mx-auto my-auto">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mx-auto my-auto">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.25v13.5l13.5-6.75-13.5-6.75z" />
                          </svg>
                        )}
                      </Button>
                      <input
                        type="range"
                        min={0}
                        max={duration}
                        step={0.1}
                        value={currentTime}
                        onChange={handleSeek}
                        className="flex-1 h-2 rounded-lg bg-purple-200/40 accent-purple-600 appearance-none outline-none focus:ring-2 focus:ring-purple-400 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-paradisePink [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-200 [&::-webkit-slider-thumb]:hover:bg-paradiseGold [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-paradisePink [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow [&::-moz-range-thumb]:transition-all [&::-moz-range-thumb]:duration-200 [&::-moz-range-thumb]:hover:bg-paradiseGold"
                      />
                      <span className="text-xs text-purple-200 min-w-[60px] text-right">
                        {Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, '0')} / {Math.floor(duration / 60)}:{String(Math.floor(duration % 60)).padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                ) : content.thumbnail_url ? (
                <Image
                    src={supabase.storage.from('files').getPublicUrl(content.thumbnail_url).data.publicUrl}
                  width={800}
                  height={600}
                    alt={content.title}
                  className="h-full w-full object-cover"
                />
                ) : (
                  <div className="w-full h-64 flex items-center justify-center text-purple-200 bg-gray-800 rounded-lg">No Thumbnail</div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="relative aspect-square overflow-hidden rounded-md border border-purple-500/30"
                >
                  {i === 0 ? (
                    content.thumbnail_url ? (
                    <Image
                      src={supabase.storage.from('files').getPublicUrl(content.thumbnail_url).data.publicUrl || ''}
                      width={120}
                      height={120}
                      alt="Main content thumbnail"
                      className="h-full w-full object-cover"
                    />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-800">
                        <ImageIcon className="h-8 w-8 text-purple-400" />
                      </div>
                    )
                  ) : (
                    <>
                      <div className="h-full w-full object-cover bg-gray-800/70" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                        <div className="text-center text-xs font-medium text-white">Premium</div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white">{content.title}</h1>
              <div className="mt-2 flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <StarRating rating={4.2} />
                  <span className="ml-2 text-sm font-medium text-white">4.2</span>
                  <span className="text-sm text-purple-300">(128 reviews)</span>
                </div>
                <div className="text-sm text-purple-300">2.5k downloads</div>
              </div>
              {content.creator && (
                <div className="mt-4">
                  <Link
                    href={`/creators/${content.creator.id}`}
                    className="flex items-center gap-2 text-sm font-medium text-purple-300 hover:text-purple-400"
                  >
                    <div className="relative h-8 w-8 overflow-hidden rounded-full border border-purple-500/50 bg-gray-800">
                      {content.creator.profile_image ? (
                        <Image
                          src={supabase.storage.from('files').getPublicUrl(content.creator.profile_image).data.publicUrl || ''}
                          fill
                          alt={`${content.creator.first_name} ${content.creator.last_name}`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <UserIcon className="h-5 w-5 text-purple-400" />
                        </div>
                      )}
                    </div>
                    <span>By {`${content.creator.first_name} ${content.creator.last_name}`}</span>
                  </Link>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="text-3xl font-bold text-white">${content.price?.toFixed(2)}</div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  size="lg"
                  className="w-full bg-paradisePink hover:bg-paradiseGold text-white font-semibold"
                  onClick={() => {
                    addToCart(content);
                    setAddedToCart(true);
                    setTimeout(() => setAddedToCart(false), 2000);
                  }}
                  disabled={addedToCart}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {addedToCart ? "Added to Cart!" : "Add to Cart"}
                </Button>
                <Button size="lg" variant="outline" className="w-full bg-transparent border-purple-600 text-purple-200 hover:bg-purple-700 hover:text-white">
                  Buy Now - ${content.price?.toFixed(2)}
                </Button>
                <Button
                  variant="outline"
                  className="gap-2 bg-transparent border-purple-600 text-purple-200 hover:bg-purple-700 hover:text-white"
                >
                  <Heart className="h-4 w-4" />
                  Add to Wishlist
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-transparent border-purple-600 text-purple-200 hover:bg-purple-700 hover:text-white"
                >
                  <Share2 className="h-4 w-4" />
                  <span className="sr-only">Share</span>
                </Button>
              </div>
              {!hasAccess && (
                <div className="rounded-lg bg-purple-900/50 border border-purple-700 p-6 text-center">
                  <h3 className="text-xl font-bold text-white">Subscribe to access all content</h3>
                  <p className="mt-2 text-purple-300">
                    Get unlimited access to all premium content with a subscription plan.
                  </p>
                  <Link href="/packages">
                    <Button
                      className="mt-4 w-full bg-white hover:bg-gray-200 text-purple-700 font-semibold"
                      size="lg"
                    >
                      View Subscription Plans
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-purple-900/50 text-purple-300">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="license">License</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="py-4 text-purple-200">
                {content.description}
              </TabsContent>
              <TabsContent value="details" className="py-4 text-purple-200">
                Details about the content.
              </TabsContent>
              <TabsContent value="license" className="py-4 text-purple-200">
                Standard License.
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-bold text-white">Related Content</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {related.map((item) => (
              <Link key={item.id} href={`/content/${item.id}`} className="group">
                <div className="overflow-hidden rounded-lg border border-purple-500/30 bg-gray-900 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    {item.thumbnail_url ? (
                    <Image
                        src={supabase.storage.from('files').getPublicUrl(item.thumbnail_url).data.publicUrl}
                      width={400}
                      height={300}
                        alt={item.title}
                      className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
                    />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-purple-200">No Thumbnail</div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-white">{item.title}</h3>
                    <div className="mt-1 flex items-center justify-between">
                      <p className="text-sm text-purple-200">{item.type}</p>
                      <p className="font-medium text-purple-400">${item.price?.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
