"use client"

import { useState, ChangeEvent, FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Image as ImageIcon, Video, FileText, Music } from "lucide-react"
import Image from "next/image"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"

const categories = [
  { label: "Video", value: "video", icon: <Video className="h-4 w-4 inline" /> },
  { label: "Photo", value: "photo", icon: <ImageIcon className="h-4 w-4 inline" /> },
  { label: "Document", value: "document", icon: <FileText className="h-4 w-4 inline" /> },
  { label: "Audio", value: "audio", icon: <Music className="h-4 w-4 inline" /> },
]

export default function BaddieUploadPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState(categories[0].value)
  const [price, setPrice] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const { user } = useAuth()
  const [error, setError] = useState("")
  const [uploading, setUploading] = useState(false)
  const router = useRouter()

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    setFile(f || null)
    if (f && f.type.startsWith("image/")) {
      setFilePreview(URL.createObjectURL(f))
    } else {
      setFilePreview(null)
    }
  }
  const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    setThumbnail(f || null)
    if (f) {
      setThumbnailPreview(URL.createObjectURL(f))
    } else {
      setThumbnailPreview(null)
    }
  }
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    if (!user) {
      setError("You must be signed in to upload.")
      return
    }
    if (!file || !thumbnail) {
      setError("File and thumbnail are required.")
      return
    }
    setUploading(true)
    // Fetch user profile for name
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("first_name, last_name")
      .eq("id", user.id)
      .single()
    if (profileError || !profile) {
      setError("Could not fetch user profile for upload path.")
      setUploading(false)
      return
    }
    const safeName = `${profile.first_name}_${profile.last_name}`.replace(/\s+/g, '_').toLowerCase()
    const folder = `baddies/${safeName}_${user.id}`
    // Upload main file
    const filePath = `${folder}/${file.name}`
    const { error: fileError } = await supabase.storage.from('files').upload(filePath, file, { upsert: true })
    if (fileError) {
      setError(`File upload failed: ${fileError.message}`)
      setUploading(false)
      return
    }
    // Upload thumbnail
    const thumbPath = `${folder}/thumbnails/${thumbnail.name}`
    const { error: thumbError } = await supabase.storage.from('files').upload(thumbPath, thumbnail, { upsert: true })
    if (thumbError) {
      setError(`Thumbnail upload failed: ${thumbError.message}`)
      setUploading(false)
      return
    }
    // Insert into content table
    const { error: dbError } = await supabase.from('content').insert({
      creator_id: user.id,
      title,
      description,
      price: price ? parseFloat(price) : 0,
      type: category,
      status: 'published',
      thumbnail_url: thumbPath,
      content_url: filePath,
    })
    if (dbError) {
      setError(`Database error: ${dbError.message}`)
      setUploading(false)
      return
    }
    setSuccess(true)
    setTitle("")
    setDescription("")
    setPrice("")
    setFile(null)
    setThumbnail(null)
    setFilePreview(null)
    setThumbnailPreview(null)
    setUploading(false)
    setTimeout(() => {
      setSuccess(false)
      router.push("/managecontent")
    }, 1000)
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <Card className="bg-gray-900 border-purple-900/40">
        <CardHeader>
          <CardTitle className="text-2xl text-white flex items-center gap-2">
            <Upload className="h-6 w-6 text-paradisePink" />
            Upload New Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-purple-200 mb-1 font-medium">Title</label>
              <input
                type="text"
                className="w-full rounded border border-purple-900 bg-gray-800 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-purple-200 mb-1 font-medium">Description</label>
              <textarea
                className="w-full rounded border border-purple-900 bg-gray-800 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                required
              />
            </div>
            <div>
              <label className="block text-purple-200 mb-1 font-medium">Category</label>
              <div className="flex gap-2">
                {categories.map(cat => (
                  <Button
                    key={cat.value}
                    type="button"
                    variant={category === cat.value ? "default" : "outline"}
                    className="flex items-center gap-1"
                    onClick={() => setCategory(cat.value)}
                  >
                    {cat.icon} {cat.label}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-purple-200 mb-1 font-medium">Content File</label>
              <input
                type="file"
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.zip"
                className="block w-full text-purple-200"
                onChange={handleFileChange}
                required
              />
              {file && filePreview && file.type.startsWith("image/") && (
                <div className="mt-2">
                  <Image src={filePreview} alt="Preview" width={200} height={120} className="rounded shadow" />
                </div>
              )}
              {file && !filePreview && (
                <div className="mt-2 text-purple-200 text-sm">{file.name}</div>
              )}
            </div>
            <div>
              <label className="block text-purple-200 mb-1 font-medium">Thumbnail</label>
              <input
                type="file"
                accept="image/*"
                className="block w-full text-purple-200"
                onChange={handleThumbnailChange}
                required
              />
              {thumbnail && thumbnailPreview && (
                <div className="mt-2">
                  <Image src={thumbnailPreview} alt="Thumbnail Preview" width={120} height={80} className="rounded shadow" />
                </div>
              )}
            </div>
            <div>
              <label className="block text-purple-200 mb-1 font-medium">Price (USD)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="w-full rounded border border-purple-900 bg-gray-800 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="Free or set a price"
              />
            </div>
            <Button type="submit" className="w-full bg-paradisePink hover:bg-paradiseGold text-white font-semibold" disabled={uploading}>
              {uploading ? "Uploading..." : "Upload"}
            </Button>
            {error && (
              <div className="text-red-400 text-center font-semibold mt-2">{error}</div>
            )}
            {success && (
              <div className="text-green-400 text-center font-semibold mt-2">Content uploaded!</div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 