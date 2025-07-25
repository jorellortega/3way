'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, Camera } from 'lucide-react';
import { Button } from './button';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/supabase";

interface AvatarUploadProps {
  currentAvatarUrl?: string | null;
  userId: string;
  onAvatarUpdate?: (newAvatarUrl: string | null) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function AvatarUpload({ 
  currentAvatarUrl, 
  userId, 
  onAvatarUpdate, 
  size = 'md',
  className = '' 
}: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [supabase] = useState(() => createClientComponentClient<Database>());

  const sizeClasses = {
    sm: 'h-16 w-16',
    md: 'h-24 w-24',
    lg: 'h-32 w-32'
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setError(null);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!fileInputRef.current?.files?.[0]) return;

    setUploading(true);
    setError(null);

    try {
      const file = fileInputRef.current.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}_${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('files')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Update user profile in database
      const { error: dbError } = await supabase
        .from('users')
        .update({ profile_image: filePath })
        .eq('id', userId);

      if (dbError) {
        throw new Error(`Database update failed: ${dbError.message}`);
      }

      // Call the callback with the new avatar URL
      onAvatarUpdate?.(filePath);
      
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setPreviewUrl(null);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    setUploading(true);
    setError(null);

    try {
      // Remove from database
      const { error: dbError } = await supabase
        .from('users')
        .update({ profile_image: null })
        .eq('id', userId);

      if (dbError) {
        throw new Error(`Database update failed: ${dbError.message}`);
      }

      // Call the callback with null
      onAvatarUpdate?.(null);
      setPreviewUrl(null);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Remove failed');
    } finally {
      setUploading(false);
    }
  };

  const getAvatarUrl = () => {
    if (previewUrl) return previewUrl;
    if (currentAvatarUrl) {
      return supabase.storage.from('files').getPublicUrl(currentAvatarUrl).data.publicUrl;
    }
    return null;
  };

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <div className="relative">
        <div className={`${sizeClasses[size]} relative overflow-hidden rounded-full border-2 border-paradiseGold shadow-lg`}>
          {getAvatarUrl() ? (
            <Image
              src={getAvatarUrl()!}
              alt="Profile avatar"
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-200">
              <Camera className="h-8 w-8 text-gray-400" />
            </div>
          )}
          
          {/* Upload overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity">
            <Camera className="h-6 w-6 text-white" />
          </div>
        </div>

        {/* Upload button */}
        <Button
          size="sm"
          variant="outline"
          className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <Upload className="h-4 w-4" />
        </Button>

        {/* Remove button */}
        {getAvatarUrl() && (
          <Button
            size="sm"
            variant="outline"
            className="absolute -bottom-2 -left-2 h-8 w-8 rounded-full p-0 bg-red-500 text-white border-red-500 hover:bg-red-600"
            onClick={handleRemove}
            disabled={uploading}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* File input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Preview and upload buttons */}
      {previewUrl && (
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={handleUpload}
            disabled={uploading}
            className="bg-paradisePink hover:bg-paradiseGold"
          >
            {uploading ? 'Uploading...' : 'Upload Avatar'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setPreviewUrl(null);
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
            }}
            disabled={uploading}
          >
            Cancel
          </Button>
        </div>
      )}

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-600 text-center">{error}</p>
      )}

      {/* Uploading indicator */}
      {uploading && (
        <p className="text-sm text-paradiseGold text-center">Processing...</p>
      )}
    </div>
  );
} 