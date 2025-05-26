"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Heart, Share2, ShoppingCart, Star } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ContentDetailPage() {
  const params = useParams();
  const id = params?.id;
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [related, setRelated] = useState<any[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!id) return;
    const fetchContent = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("content")
        .select("*")
        .eq("id", id)
        .single();
      if (error) setError(error.message);
      else setContent(data);
      setLoading(false);
    };
    fetchContent();
    // Fetch related content
    const fetchRelated = async () => {
      const { data } = await supabase
        .from("content")
        .select("id, title, price, type, thumbnail_url, status")
        .eq("status", "published")
        .neq("id", id)
        .order("created_at", { ascending: false })
        .limit(4);
      setRelated(data || []);
    };
    fetchRelated();
  }, [id]);

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
                  className="relative aspect-square overflow-hidden rounded-md border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                >
                  {i === 0 ? (
                    <Image
                      src={`/placeholder.svg?height=120&width=120`}
                      width={120}
                      height={120}
                      alt={`Thumbnail ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <>
                      <Image
                        src={`/placeholder.svg?height=120&width=120`}
                        width={120}
                        height={120}
                        alt={`Thumbnail ${i + 1}`}
                        className="h-full w-full object-cover opacity-40"
                      />
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
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <Star className="h-5 w-5 fill-gray-700 stroke-gray-600" />
                  <span className="ml-2 text-sm font-medium text-white">4.2</span>
                  <span className="text-sm text-purple-300">(128 reviews)</span>
                </div>
                <div className="text-sm text-purple-300">2.5k downloads</div>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Link
                  href="/creators/1"
                  className="flex items-center gap-2 text-sm font-medium text-purple-300 hover:text-purple-400"
                >
                  <div className="relative h-6 w-6 overflow-hidden rounded-full border border-purple-500/50">
                    <Image
                      src="/placeholder.svg?height=24&width=24"
                      width={24}
                      height={24}
                      alt="Creator"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  By Creator Name
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-3xl font-bold text-white">$19.99</div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button className="gap-2 bg-purple-600 hover:bg-purple-700 text-white">
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  className="gap-2 border-purple-500 text-purple-200 hover:bg-purple-900/50 hover:text-white"
                >
                  <Heart className="h-4 w-4" />
                  Add to Wishlist
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-purple-500 text-purple-200 hover:bg-purple-900/50 hover:text-white"
                >
                  <Share2 className="h-4 w-4" />
                  <span className="sr-only">Share</span>
                </Button>
              </div>
              <div className="rounded-lg border border-purple-500/30 bg-gray-900/60 p-4 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                <h3 className="font-medium text-white">Subscribe to access all content</h3>
                <p className="mt-1 text-sm text-purple-200">
                  Get unlimited access to all premium content with a subscription plan.
                </p>
                <div className="mt-3">
                  <Link href="/subscriptions">
                    <Button
                      variant="outline"
                      className="w-full border-purple-500 text-purple-200 hover:bg-purple-900/50 hover:text-white"
                    >
                      View Subscription Plans
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <Tabs defaultValue="description">
              <TabsList className="grid w-full grid-cols-3 bg-gray-900 border-purple-700">
                <TabsTrigger
                  value="description"
                  className="data-[state=active]:bg-purple-800 data-[state=active]:text-white"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger
                  value="details"
                  className="data-[state=active]:bg-purple-800 data-[state=active]:text-white"
                >
                  Details
                </TabsTrigger>
                <TabsTrigger
                  value="license"
                  className="data-[state=active]:bg-purple-800 data-[state=active]:text-white"
                >
                  License
                </TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-4 space-y-4 text-purple-200">
                <p>
                  This premium digital content features high-quality visuals perfect for your creative projects. Created
                  by a professional artist with attention to detail and artistic excellence.
                </p>
                <p>
                  The content is delivered in multiple formats to ensure compatibility with various software and
                  platforms. Whether you're working on a personal project or commercial work, this content will elevate
                  your designs.
                </p>
              </TabsContent>
              <TabsContent value="details" className="mt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-white">Format</div>
                    <div className="text-purple-200">JPEG, PNG, PSD</div>
                  </div>
                  <div>
                    <div className="font-medium text-white">Resolution</div>
                    <div className="text-purple-200">4K (3840x2160)</div>
                  </div>
                  <div>
                    <div className="font-medium text-white">File Size</div>
                    <div className="text-purple-200">250 MB</div>
                  </div>
                  <div>
                    <div className="font-medium text-white">Created</div>
                    <div className="text-purple-200">April 15, 2025</div>
                  </div>
                  <div>
                    <div className="font-medium text-white">Software</div>
                    <div className="text-purple-200">Adobe Photoshop, Illustrator</div>
                  </div>
                  <div>
                    <div className="font-medium text-white">Tags</div>
                    <div className="text-purple-200">Abstract, Modern, Digital Art</div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="license" className="mt-4 space-y-4">
                <div>
                  <h3 className="font-medium text-white">Standard License</h3>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-purple-200">
                    <li>Personal and commercial use</li>
                    <li>Use in a single end product</li>
                    <li>Lifetime access</li>
                    <li>Cannot be redistributed or resold</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-white">Extended License</h3>
                  <p className="mt-1 text-sm text-purple-200">
                    For extended usage rights, please contact the creator directly.
                  </p>
                </div>
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
