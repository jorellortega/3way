'use client';

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Upload, Save, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Package {
  id: string;
  title: string;
  description: string;
  price: number;
  type: string;
  thumbnail_url: string | null;
  status: string;
  created_at: string;
}

export default function EditPackagesPage() {
  console.log('EditPackagesPage: Component rendering');
  
  const router = useRouter();
  const [supabase] = useState(() => createClientComponentClient<Database>());
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("list");

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    type: 'package',
    status: 'published'
  });

  // Check authentication
  useEffect(() => {
    console.log('EditPackagesPage: Checking authentication');
    const checkAuth = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      console.log('EditPackagesPage: Auth check result:', { user, error });
      
      if (error || !user) {
        console.log('EditPackagesPage: No user found, redirecting to signin');
        router.push('/auth/signin');
        return;
      }
      
      setUser(user);
      setAuthLoading(false);
    };
    
    checkAuth();
  }, [supabase, router]);

  useEffect(() => {
    if (!authLoading && user) {
      console.log('EditPackagesPage: useEffect triggered');
      fetchPackages();
    }
  }, [authLoading, user, supabase]);

  const fetchPackages = async () => {
    console.log('EditPackagesPage: fetchPackages called');
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('type', 'package')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });

      console.log('EditPackagesPage: fetchPackages result:', { data, error });

      if (error) {
        console.error('Error fetching packages:', error);
        setError(`Error fetching packages: ${error.message}`);
      } else {
        setPackages(data || []);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
      setError(`Error fetching packages: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    console.log('EditPackagesPage: handleCreateNew called');
    setIsCreating(true);
    setEditingPackage(null);
    setFormData({
      title: '',
      description: '',
      price: '',
      type: 'package',
      status: 'published'
    });
    setThumbnailFile(null);
    setActiveTab("form"); // Switch to form tab when creating
  };

  const handleEdit = (pkg: Package) => {
    console.log('EditPackagesPage: handleEdit called with:', pkg);
    setEditingPackage(pkg);
    setIsCreating(false);
    setFormData({
      title: pkg.title,
      description: pkg.description,
      price: pkg.price.toString(),
      type: pkg.type,
      status: pkg.status
    });
    setThumbnailFile(null);
    setActiveTab("form"); // Switch to form tab when editing
  };

  const handleCancel = () => {
    console.log('EditPackagesPage: handleCancel called');
    setEditingPackage(null);
    setIsCreating(false);
    setFormData({
      title: '',
      description: '',
      price: '',
      type: 'package',
      status: 'published'
    });
    setThumbnailFile(null);
    setActiveTab("list"); // Switch back to list tab when canceling
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnailFile(e.target.files[0]);
    }
  };

  const uploadThumbnail = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `packages/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('files')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading thumbnail:', uploadError);
        return null;
      }

      return filePath;
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      return null;
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.description || !formData.price) {
      alert('Please fill in all required fields');
      return;
    }

    setUploading(true);
    try {
      let thumbnailUrl = editingPackage?.thumbnail_url || null;

      // Upload thumbnail if a new file is selected
      if (thumbnailFile) {
        thumbnailUrl = await uploadThumbnail(thumbnailFile);
      }

      const packageData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        type: formData.type,
        status: formData.status,
        thumbnail_url: thumbnailUrl,
        creator_id: user.id
      };

      if (editingPackage) {
        // Update existing package
        const { error } = await supabase
          .from('content')
          .update(packageData)
          .eq('id', editingPackage.id)
          .eq('creator_id', user.id); // Ensure user owns the package

        if (error) {
          console.error('Error updating package:', error);
          alert('Error updating package');
        } else {
          alert('Package updated successfully!');
          handleCancel();
          fetchPackages();
        }
      } else {
        // Create new package
        const { error } = await supabase
          .from('content')
          .insert([packageData]);

        if (error) {
          console.error('Error creating package:', error);
          alert('Error creating package');
        } else {
          alert('Package created successfully!');
          handleCancel();
          fetchPackages();
        }
      }
    } catch (error) {
      console.error('Error saving package:', error);
      alert('Error saving package');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (packageId: string) => {
    if (!confirm('Are you sure you want to delete this package?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('content')
        .delete()
        .eq('id', packageId)
        .eq('creator_id', user.id); // Ensure user owns the package

      if (error) {
        console.error('Error deleting package:', error);
        alert('Error deleting package');
      } else {
        alert('Package deleted successfully!');
        fetchPackages();
      }
    } catch (error) {
      console.error('Error deleting package:', error);
      alert('Error deleting package');
    }
  };

  console.log('EditPackagesPage: Rendering with state:', { authLoading, user, loading, packages: packages.length, error });

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-paradisePink mb-4">Loading...</h1>
          <p className="text-gray-600">Please wait while we verify your authentication.</p>
        </div>
      </div>
    );
  }

  // Show error if there's an authentication issue
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Required</h1>
          <p className="text-gray-600 mb-4">You must be logged in to manage packages.</p>
          <Button onClick={() => router.push('/auth/signin')} className="bg-paradisePink hover:bg-paradiseGold">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchPackages} className="bg-paradisePink hover:bg-paradiseGold">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-paradisePink mb-2">Manage Packages</h1>
        <p className="text-paradiseGold">Create, edit, and manage your content packages</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">Package List</TabsTrigger>
          <TabsTrigger value="form">
            {isCreating ? 'Create New Package' : editingPackage ? 'Edit Package' : 'Create Package'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-paradisePink">Your Packages</h2>
            <Button onClick={handleCreateNew} className="bg-paradisePink hover:bg-paradiseGold">
              <Plus className="h-4 w-4 mr-2" />
              Create New Package
            </Button>
          </div>

          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-300 rounded-t-lg"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : packages.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {packages.map((pkg) => (
                <Card key={pkg.id} className="overflow-hidden">
                  <div className="relative h-48">
                    {pkg.thumbnail_url ? (
                      <Image
                        src={supabase.storage.from('files').getPublicUrl(pkg.thumbnail_url).data.publicUrl}
                        alt={pkg.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-gray-500">No thumbnail</span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        pkg.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {pkg.status}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <CardTitle className="text-lg mb-2">{pkg.title}</CardTitle>
                    <CardDescription className="mb-2 line-clamp-2">
                      {pkg.description}
                    </CardDescription>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-bold text-paradisePink">
                        ${pkg.price.toFixed(2)}
                      </span>
                      <span className="text-sm text-paradiseGold">
                        {new Date(pkg.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(pkg)}
                        className="flex-1"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(pkg.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-medium text-paradisePink mb-2">No Packages Yet</h3>
              <p className="text-paradiseGold mb-4">Create your first package to get started!</p>
              <Button onClick={handleCreateNew} className="bg-paradisePink hover:bg-paradiseGold">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Package
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="form" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-paradisePink">
                {isCreating ? 'Create New Package' : 'Edit Package'}
              </CardTitle>
              <CardDescription>
                Fill in the details below to {isCreating ? 'create' : 'update'} your package
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-paradiseGold">Package Title *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter package title"
                    className="border-paradiseGold focus:border-paradisePink"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-paradiseGold">Price *</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                    className="border-paradiseGold focus:border-paradisePink"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-paradiseGold">Description *</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your package content and what users will get..."
                  rows={4}
                  className="border-paradiseGold focus:border-paradisePink"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-paradiseGold">Status</label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger className="border-paradiseGold focus:border-paradisePink">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-paradiseGold">Thumbnail Image</label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="border-paradiseGold focus:border-paradisePink"
                    />
                    <Upload className="h-4 w-4 text-paradiseGold" />
                  </div>
                </div>
              </div>

              {(thumbnailFile || editingPackage?.thumbnail_url) && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-paradiseGold">Preview</label>
                  <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                    <Image
                      src={thumbnailFile ? URL.createObjectURL(thumbnailFile) : supabase.storage.from('files').getPublicUrl(editingPackage!.thumbnail_url!).data.publicUrl}
                      alt="Thumbnail preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleSave}
                  disabled={uploading}
                  className="bg-paradisePink hover:bg-paradiseGold flex-1"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {uploading ? 'Saving...' : 'Save Package'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="border-paradiseGold text-paradisePink hover:bg-paradiseGold/10"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 