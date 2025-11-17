"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Settings, Image as ImageIcon, Plus, Trash2, Edit } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function CEOPage() {
  const { user } = useAuth();
  const [supabase] = useState(() => createClientComponentClient<Database>());
  const [role, setRole] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [homepageImages, setHomepageImages] = useState<Array<{ id: number; image_url: string; alt_text: string | null; position: number; is_active: boolean }>>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editAltText, setEditAltText] = useState("");
  const [editPosition, setEditPosition] = useState(0);

  const fetchHomepageImages = async () => {
    const { data, error } = await supabase
      .from("homepage_images")
      .select("id, image_url, alt_text, position, is_active")
      .order("position", { ascending: true });
    if (error) console.error('fetchHomepageImages error:', error);
    setHomepageImages(data || []);
  };

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
    fetchHomepageImages();
  }, [user, supabase]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(""); setSuccess("");
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError("Please upload an image file");
      return;
    }
    
    setUploading(true);
    try {
      // Use upsert to replace existing file if it exists
      const { error: uploadError } = await supabase.storage.from('files').upload('logo.png', file, { 
        upsert: true,
        contentType: file.type,
        cacheControl: '3600'
      });
      
      if (uploadError) {
        console.error('Upload error details:', uploadError);
        // If it's a duplicate error and upsert didn't work, we need UPDATE permission
        if (uploadError.statusCode === '409' || uploadError.message?.includes('already exists')) {
          setError(`Upload failed: File already exists. Please add UPDATE permission to your storage bucket policies, or delete the existing logo.png file first.`);
        } else {
          setError(`Upload failed: ${uploadError.message}. Please check storage bucket permissions.`);
        }
        setUploading(false);
        return;
      }
      
      setSuccess("Logo uploaded!");
      
      // Refresh logo
      const { data: newLogo, error: downloadError } = await supabase.storage.from('files').download('logo.png');
      if (downloadError) console.error('download after upload error:', downloadError);
      if (newLogo) setLogoUrl(URL.createObjectURL(newLogo));
    } catch (err) {
      console.error('Upload exception:', err);
      setError(`Upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setUploading(false);
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(""); setSuccess("");
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError("Please upload an image file");
      return;
    }
    
    setUploadingImage(true);
    try {
      const sanitizeFileName = (name: string) => encodeURIComponent(name.replace(/\s+/g, "_").replace(/[^\w.-]/g, ""));
      const filePath = `homepage/${Date.now()}_${sanitizeFileName(file.name)}`;
      
      const { error: uploadError } = await supabase.storage.from('files').upload(filePath, file, { 
        upsert: true,
        contentType: file.type,
        cacheControl: '3600'
      });
      
      if (uploadError) {
        console.error('Upload error details:', uploadError);
        setError(`Upload failed: ${uploadError.message}. Please check storage bucket permissions.`);
        setUploadingImage(false);
        return;
      }

      // Get max position
      const maxPosition = homepageImages.length > 0 ? Math.max(...homepageImages.map(img => img.position)) : 0;
      
      const { error: insertError } = await supabase
        .from('homepage_images')
        .insert({ image_url: filePath, position: maxPosition + 1, alt_text: '' });
      
      if (insertError) {
        console.error('Insert error details:', insertError);
        setError(`Database error: ${insertError.message}`);
      } else {
        setSuccess("Image uploaded!");
        fetchHomepageImages();
      }
    } catch (err) {
      console.error('Upload exception:', err);
      setError(`Upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteImage = async (id: number, imageUrl: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    setError(""); setSuccess("");
    
    // Delete from storage
    const { error: storageError } = await supabase.storage.from('files').remove([imageUrl]);
    if (storageError) console.error('Storage delete error:', storageError);
    
    // Delete from database
    const { error: deleteError } = await supabase.from('homepage_images').delete().eq('id', id);
    if (deleteError) {
      setError(deleteError.message);
    } else {
      setSuccess("Image deleted!");
      fetchHomepageImages();
    }
  };

  const handleEditImage = (image: { id: number; alt_text: string | null; position: number }) => {
    setEditingId(image.id);
    setEditAltText(image.alt_text || '');
    setEditPosition(image.position);
  };

  const handleSaveEdit = async (id: number) => {
    setError(""); setSuccess("");
    const { error: updateError } = await supabase
      .from('homepage_images')
      .update({ alt_text: editAltText, position: editPosition })
      .eq('id', id);
    
    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess("Image updated!");
      setEditingId(null);
      fetchHomepageImages();
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditAltText("");
    setEditPosition(0);
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

      {/* Homepage Images Management */}
      <Card className="mt-8">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Homepage Hero Images</CardTitle>
          <ImageIcon className="h-5 w-5 text-gray-500" />
        </CardHeader>
        <CardContent>
          <CardDescription className="mb-4">
            Manage the images displayed in the hero section on the homepage. You can add up to 4 images.
          </CardDescription>
          
          <div className="mb-4">
            <input 
              type="file" 
              id="homepage-image-upload" 
              accept="image/*" 
              onChange={handleImageUpload} 
              disabled={uploadingImage || homepageImages.length >= 4} 
              className="hidden" 
            />
            <Button 
              variant="outline" 
              disabled={uploadingImage || homepageImages.length >= 4}
              className="w-full"
              onClick={() => {
                const input = document.getElementById('homepage-image-upload') as HTMLInputElement;
                if (input && !input.disabled) {
                  input.click();
                }
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              {uploadingImage ? "Uploading..." : homepageImages.length >= 4 ? "Maximum 4 images" : "Add Homepage Image"}
            </Button>
          </div>

          {homepageImages.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {homepageImages.map((image) => (
                <div key={image.id} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                  <div className="relative w-full h-48 mb-3 rounded overflow-hidden">
                    <Image
                      src={supabase.storage.from('files').getPublicUrl(image.image_url).data.publicUrl}
                      alt={image.alt_text || "Homepage image"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  {editingId === image.id ? (
                    <div className="space-y-2">
                      <div>
                        <Label htmlFor={`alt-${image.id}`}>Alt Text</Label>
                        <Input
                          id={`alt-${image.id}`}
                          value={editAltText}
                          onChange={(e) => setEditAltText(e.target.value)}
                          placeholder="Image description"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`pos-${image.id}`}>Position</Label>
                        <Input
                          id={`pos-${image.id}`}
                          type="number"
                          value={editPosition}
                          onChange={(e) => setEditPosition(parseInt(e.target.value) || 0)}
                          min="1"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleSaveEdit(image.id)}>Save</Button>
                        <Button size="sm" variant="outline" onClick={handleCancelEdit}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <strong>Alt:</strong> {image.alt_text || "No alt text"}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <strong>Position:</strong> {image.position}
                      </p>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleEditImage(image)}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => handleDeleteImage(image.id, image.image_url)}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          {success && <div className="text-green-500 text-sm mt-2">{success}</div>}
        </CardContent>
      </Card>
    </div>
  );
} 