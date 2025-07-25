"use client";

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, MessageCircle, Star, UserPlus } from "lucide-react"
import { useEffect, useState, useRef } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/supabase";
import { useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import clsx from "clsx";

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AvatarUpload } from "@/components/ui/avatar-upload"

export default function CreatorProfilePage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  const [creator, setCreator] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [supabase] = useState(() => createClientComponentClient<Database>());
  const { user } = useAuth();
  const isOwner = user && user.id === id;
  const [editingBio, setEditingBio] = useState(false);
  const [bio, setBio] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const bioTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [avatarError, setAvatarError] = useState('');
  const [creatorContent, setCreatorContent] = useState<any[]>([]);
  const [creatorPackages, setCreatorPackages] = useState<any[]>([]);
  const [packagesLoading, setPackagesLoading] = useState(false);

  useEffect(() => {
    const fetchCreator = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select("id, first_name, last_name, profile_image, bio")
        .eq("id", id)
        .single();
      if (error) setError(error.message);
      else setCreator(data);
      setLoading(false);
    };
    if (id) fetchCreator();
  }, [id, supabase]);

  useEffect(() => {
    if (creator?.bio) setBio(creator.bio);
    if (creator?.profile_image) setAvatarPreview(creator.profile_image);
  }, [creator]);

  useEffect(() => {
    if (editingBio && bioTextareaRef.current) {
      bioTextareaRef.current.focus();
    }
  }, [editingBio]);

  useEffect(() => {
    console.log('Current user:', user);
    console.log('Profile id:', id);
    console.log('isOwner:', isOwner);
  }, [user, id, isOwner]);

  useEffect(() => {
    if (!id) return;
    const fetchContent = async () => {
      const { data } = await supabase
        .from("content")
        .select("id, title, price, type, thumbnail_url, status, created_at")
        .eq("creator_id", id)
        .neq("type", "package") // Exclude packages from content
        .order("created_at", { ascending: false });
      setCreatorContent(data || []);
    };
    fetchContent();
  }, [id, supabase]);

  // Fetch packages for the creator
  useEffect(() => {
    if (!id) return;
    const fetchPackages = async () => {
      setPackagesLoading(true);
      try {
        const { data, error } = await supabase
          .from("content")
          .select("id, title, description, price, type, thumbnail_url, status, created_at")
          .eq("creator_id", id)
          .eq("type", "package")
          .eq("status", "published")
          .order("created_at", { ascending: false });
        
        if (error) {
          console.error('Error fetching packages:', error);
        } else {
          setCreatorPackages(data || []);
        }
      } catch (error) {
        console.error('Error fetching packages:', error);
      } finally {
        setPackagesLoading(false);
      }
    };
    fetchPackages();
  }, [id, supabase]);

  // Save bio on blur or Enter
  const saveBio = async () => {
    if (!isOwner) return;
    if (bio !== creator.bio) {
      const { error } = await supabase.from("users").update({ bio }).eq("id", id);
      if (!error) setCreator({ ...creator, bio });
    }
    setEditingBio(false);
  };
  const handleBioKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      saveBio();
    }
  };

  // Handle avatar file change
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatarError('');
    console.log('handleAvatarChange called, isOwner:', isOwner, 'user.id:', user?.id, 'profile id:', id);
    if (!isOwner) {
      setAvatarError('You are not the owner of this profile. Upload not allowed.');
      return;
    }
    const file = e.target.files?.[0];
    if (!file) {
      setAvatarError('No file selected.');
      return;
    }
    setAvatarFile(file);
    // Upload to Supabase Storage (files bucket)
    const filePath = `avatars/${id}_${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    const { error: uploadError } = await supabase.storage.from('files').upload(filePath, file, { upsert: true });
    console.log('Upload result:', { filePath, uploadError });
    if (!uploadError) {
      const { error: dbError } = await supabase.from("users").update({ profile_image: filePath }).eq("id", id);
      console.log('DB update result:', { dbError });
      if (dbError) {
        setAvatarError('DB update failed: ' + dbError.message);
      } else {
        setCreator({ ...creator, profile_image: filePath });
        setAvatarPreview(null); // Always use public URL from storage
      }
    } else {
      setAvatarError('Upload failed: ' + uploadError.message);
      console.error('Upload failed:', uploadError);
    }
  };
  // Handle avatar delete
  const handleAvatarDelete = async () => {
    if (!isOwner) return;
    await supabase.from("users").update({ profile_image: null }).eq("id", id);
    setCreator({ ...creator, profile_image: null });
    setAvatarPreview(null);
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!creator) return <div className="p-8 text-center text-purple-200">Creator not found.</div>;

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="mb-4 flex items-center gap-2">
        <Link
          href="/creators"
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-teal-600 dark:text-gray-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Creators
        </Link>
      </div>

              <div className="mb-8 flex flex-col items-center gap-6 md:flex-row md:items-start">
          {isOwner ? (
            <AvatarUpload
              currentAvatarUrl={creator?.profile_image}
              userId={creator.id}
              onAvatarUpdate={(newAvatarUrl) => setCreator({ ...creator, profile_image: newAvatarUrl })}
              size="lg"
            />
          ) : (
            <div className="relative h-32 w-32 overflow-hidden rounded-full md:h-40 md:w-40">
              <Image
                src={
                  creator.profile_image
                    ? supabase.storage.from('files').getPublicUrl(creator.profile_image).data.publicUrl || "/placeholder.svg?height=160&width=160"
                    : "/placeholder.svg?height=160&width=160"
                }
                width={160}
                height={160}
                alt="Creator profile"
                className="h-full w-full object-cover"
              />
            </div>
          )}
        <div className="flex flex-1 flex-col items-center text-center md:items-start md:text-left">
          <h1 className="text-3xl font-bold">{creator.first_name} {creator.last_name}</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Digital Artist & Photographer</p>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex items-center">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="ml-1 font-medium">4.8</span>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">(256 reviews)</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">2.5k subscribers</span>
          </div>
          {isOwner ? (
            editingBio ? (
              <textarea
                ref={bioTextareaRef}
                className="mt-4 max-w-2xl w-full rounded border border-gray-300 bg-gray-100 text-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
                value={bio}
                onChange={e => setBio(e.target.value)}
                onBlur={saveBio}
                onKeyDown={handleBioKeyDown}
                rows={3}
                placeholder="Add your bio..."
              />
            ) : (
              <p
                className="mt-4 max-w-2xl text-gray-500 dark:text-gray-400 cursor-pointer hover:bg-gray-100/40 px-1 rounded"
                onClick={() => setEditingBio(true)}
                title="Click to edit bio"
              >
                {creator.bio || "Click to add your bio..."}
              </p>
            )
          ) : (
            <p className="mt-4 max-w-2xl text-gray-500 dark:text-gray-400">
              {creator.bio || "This creator has not added a bio yet."}
            </p>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            <Button className="gap-2 bg-teal-600 hover:bg-teal-700">
              <UserPlus className="h-4 w-4" />
              Subscribe
            </Button>
            <Button variant="outline" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              Message
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="content" className="mt-8">
        <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="packages">Packages</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>
        <TabsContent value="content" className="mt-6">
          {creatorContent.length === 0 ? (
            <div className="text-center text-purple-400 py-8">No content found for this creator.</div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {creatorContent.map((item) => (
                <Card key={item.id} className="bg-gray-900 border-purple-900/40 hover:border-purple-500 transition-colors relative">
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
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="packages" className="mt-6">
          {packagesLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950 animate-pulse">
                  <div className="h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-4"></div>
                  <div className="h-8 bg-gray-300 rounded mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-300 rounded"></div>
                    <div className="h-3 bg-gray-300 rounded"></div>
                    <div className="h-3 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : creatorPackages.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {creatorPackages.map((pkg) => (
                <Card key={pkg.id} className="bg-gray-900 border-purple-900/40 hover:border-purple-500 transition-colors">
                  <CardHeader>
                    <div className="aspect-video relative overflow-hidden rounded-lg mb-4">
                      {pkg.thumbnail_url ? (
                        <Image
                          src={supabase.storage.from('files').getPublicUrl(pkg.thumbnail_url).data.publicUrl || ''}
                          alt={pkg.title}
                          fill
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-purple-200">
                          <div className="text-center">
                            <div className="text-2xl mb-1">📦</div>
                            <div className="text-xs">No Preview</div>
                          </div>
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-white text-xl font-bold">{pkg.title}</CardTitle>
                    <CardDescription className="text-purple-200">
                      {pkg.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mt-4">
                      <span className="text-3xl font-bold text-paradisePink">${pkg.price?.toFixed(2)}</span>
                    </div>
                    <ul className="mt-4 space-y-2 text-sm text-purple-200">
                      <li className="flex items-center">
                        <svg
                          className="mr-2 h-4 w-4 text-teal-600 dark:text-teal-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        Premium content package
                      </li>
                      <li className="flex items-center">
                        <svg
                          className="mr-2 h-4 w-4 text-teal-600 dark:text-teal-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        High resolution
                      </li>
                      <li className="flex items-center">
                        <svg
                          className="mr-2 h-4 w-4 text-teal-600 dark:text-teal-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        Commercial license
                      </li>
                    </ul>
                    <div className="mt-6">
                      <Button className="w-full bg-paradisePink hover:bg-paradiseGold text-paradiseWhite">
                        Buy Package
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-medium text-paradisePink mb-2">No Packages Available</h3>
              <p className="text-paradiseGold">This creator hasn't published any packages yet.</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="about" className="mt-6 max-w-3xl space-y-4">
          <h2 className="text-xl font-bold">About Creator Name</h2>
          <p>
            I'm a professional digital artist with over 10 years of experience in creating premium digital content. My
            work spans across various styles including abstract art, photography, and digital illustrations.
          </p>
          <p>
            My passion is creating visually stunning content that inspires creativity and enhances projects across
            various industries. I believe in delivering the highest quality work that meets the needs of creative
            professionals, marketers, and design enthusiasts.
          </p>
          <p>
            Each piece in my collection is meticulously crafted with attention to detail, ensuring that subscribers and
            customers receive content that exceeds expectations. I regularly update my portfolio with fresh, innovative
            designs to keep my collection current and relevant.
          </p>

          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-medium">Specialties</h3>
            <ul className="list-inside list-disc space-y-1 text-gray-600 dark:text-gray-400">
              <li>Digital Photography</li>
              <li>Abstract Digital Art</li>
              <li>Illustrations & Vector Graphics</li>
              <li>Textures & Patterns</li>
              <li>3D Modeling & Rendering</li>
            </ul>
          </div>

          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-medium">Contact Information</h3>
            <p className="text-gray-600 dark:text-gray-400">
              For custom work or collaborations, please reach out via the message button or contact me at:
              <br />
              Email: creator@example.com
              <br />
              Website: www.creatorname.com
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
