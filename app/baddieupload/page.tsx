"use client"

import { useState, ChangeEvent, FormEvent, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Image as ImageIcon, Video, FileText, Music, AlertCircle, XCircle } from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"

const categories = [
  { label: "Video", value: "video", icon: <Video className="h-4 w-4 inline" /> },
  { label: "Image", value: "image", icon: <ImageIcon className="h-4 w-4 inline" /> },
  { label: "Package", value: "package", icon: <FileText className="h-4 w-4 inline" /> },
]

export default function BaddieUploadPage() {
  const { user } = useAuth()
  const [supabase] = useState(() => createClientComponentClient<Database>())
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState(categories[0].value)
  const [price, setPrice] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [uploading, setUploading] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [isAiGenerated, setIsAiGenerated] = useState(false)
  const [accountStatus, setAccountStatus] = useState<string | null>(null)
  const [loadingStatus, setLoadingStatus] = useState(true)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [checkingRole, setCheckingRole] = useState(true)

  useEffect(() => {
    const fetchUserRoleAndStatus = async () => {
      if (!user) {
        setLoadingStatus(false)
        setCheckingRole(false)
        return
      }
      try {
        const { data, error } = await supabase
          .from("users")
          .select("role, account_status")
          .eq("id", user.id)
          .single()
        
        if (error) {
          console.error("Error fetching user data:", error)
          router.push("/dashboard")
          return
        }
        
        if (data) {
          setUserRole(data.role || null)
          setAccountStatus(data.account_status || 'good_standing')
          
          // Check if user has access (creator or admin)
          if (data.role !== 'creator' && data.role !== 'admin') {
            // User doesn't have access, will show access denied message
          }
        }
      } catch (err) {
        console.error("Error fetching user data:", err)
        router.push("/dashboard")
      } finally {
        setLoadingStatus(false)
        setCheckingRole(false)
      }
    }
    fetchUserRoleAndStatus()
  }, [user, supabase, router])

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
    
    // Check account status first
    if (accountStatus !== 'good_standing') {
      if (accountStatus === 'paused') {
        setError("Your account is currently paused. You cannot upload content at this time. Please contact support for more information.")
      } else if (accountStatus === 'hold') {
        setError("Your account is on hold. You cannot upload content at this time. Please contact support for more information.")
      } else if (accountStatus === 'blocked') {
        setError("Your account has been blocked. You cannot upload content. Please contact support for more information.")
      } else {
        setError("Your account is not in good standing. You cannot upload content at this time. Please contact support for more information.")
      }
      return
    }
    
    if (!agreedToTerms) {
      setError("You must agree to the terms of service to upload content.")
      return
    }
    if (!user) {
      setError("You must be signed in to upload.")
      console.error("No user found");
      return
    }
    if (!file || !thumbnail) {
      setError("File and thumbnail are required.")
      console.error("File or thumbnail missing", { file, thumbnail });
      return
    }
    setUploading(true)
    console.log("User:", user)
    // Fetch user profile for name
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("first_name, last_name")
      .eq("id", user.id)
      .single()
    console.log("Profile fetch result:", { profile, profileError })
    if (profileError || !profile) {
      setError("Could not fetch user profile for upload path.")
      setUploading(false)
      console.error("Profile fetch error", profileError)
      return
    }
    const safeName = `${profile.first_name}_${profile.last_name}`.replace(/\s+/g, '_').toLowerCase()
    const sanitizeFileName = (name: string) => encodeURIComponent(name.replace(/\s+/g, "_").replace(/[^\w.-]/g, ""));
    const folder = `baddies/${safeName}_${user.id}`
    const filePath = `${folder}/${sanitizeFileName(file.name)}`
    const thumbPath = `${folder}/thumbnails/${sanitizeFileName(thumbnail.name)}`
    console.log("File paths:", { filePath, thumbPath })
    // Upload main file
    const { error: fileError, data: fileUploadData } = await supabase.storage.from('files').upload(filePath, file, { upsert: true })
    console.log("File upload response:", { fileError, fileUploadData })
    if (fileError) {
      setError(`File upload failed: ${fileError.message}`)
      setUploading(false)
      console.error("File upload error", fileError)
      return
    }
    // Upload thumbnail
    const { error: thumbError, data: thumbUploadData } = await supabase.storage.from('files').upload(thumbPath, thumbnail, { upsert: true })
    console.log("Thumbnail upload response:", { thumbError, thumbUploadData })
    if (thumbError) {
      setError(`Thumbnail upload failed: ${thumbError.message}`)
      setUploading(false)
      console.error("Thumbnail upload error", thumbError)
      return
    }
    // Insert into content table
    const payload = {
      creator_id: user.id,
      title,
      description,
      price: price ? parseFloat(price) : 0,
      type: category,
      status: 'published',
      thumbnail_url: thumbPath,
      content_url: filePath,
      is_ai_generated: isAiGenerated,
    }
    console.log("Inserting into content table:", payload)
    const { error: dbError, data: dbData } = await supabase.from('content').insert(payload)
    console.log("DB insert response:", { dbError, dbData })
    if (dbError) {
      setError(`Database error: ${dbError.message}`)
      setUploading(false)
      console.error("DB insert error", dbError)
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
          {checkingRole || loadingStatus ? (
            <div className="text-center py-8 text-purple-200">Loading...</div>
          ) : userRole !== 'creator' && userRole !== 'admin' ? (
            <div className="space-y-4">
              <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-6">
                <div className="flex items-start gap-3">
                  <XCircle className="h-6 w-6 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-red-400 mb-2">Access Denied</h3>
                    <div className="space-y-2 text-purple-200">
                      <p className="font-medium">You don't have permission to access this page.</p>
                      <p className="text-sm">Only creators and admins can upload content to this platform.</p>
                      <p className="text-sm">If you believe this is an error, please contact support.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <Button
                  onClick={() => router.push("/dashboard")}
                  className="bg-paradisePink hover:bg-paradiseGold text-white font-semibold"
                >
                  Go to Dashboard
                </Button>
              </div>
            </div>
          ) : accountStatus !== 'good_standing' ? (
            <div className="space-y-4">
              <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-6">
                <div className="flex items-start gap-3">
                  <XCircle className="h-6 w-6 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-red-400 mb-2">Upload Restricted</h3>
                    {accountStatus === 'paused' && (
                      <div className="space-y-2 text-purple-200">
                        <p className="font-medium">Your account is currently paused.</p>
                        <p className="text-sm">You cannot upload new content while your account is paused. This may be due to a temporary restriction or account review.</p>
                        <p className="text-sm">Please contact support if you have questions or need assistance with your account.</p>
                      </div>
                    )}
                    {accountStatus === 'hold' && (
                      <div className="space-y-2 text-purple-200">
                        <p className="font-medium">Your account is on hold.</p>
                        <p className="text-sm">You cannot upload new content while your account is on hold. This typically occurs during an account review or investigation.</p>
                        <p className="text-sm">Please contact support for more information about your account status.</p>
                      </div>
                    )}
                    {accountStatus === 'blocked' && (
                      <div className="space-y-2 text-purple-200">
                        <p className="font-medium">Your account has been blocked.</p>
                        <p className="text-sm">You cannot upload new content because your account has been blocked. This is typically due to a violation of our terms of service.</p>
                        <p className="text-sm">If you believe this is an error, please contact support to resolve this issue.</p>
                      </div>
                    )}
                    {!accountStatus && (
                      <div className="space-y-2 text-purple-200">
                        <p className="font-medium">Account status unknown.</p>
                        <p className="text-sm">Unable to verify your account status. Please contact support for assistance.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-purple-200">
                    If you need to update your account information or have questions about your account status, please visit your <a href="/settings" className="text-paradisePink hover:text-paradiseGold underline">settings page</a> or contact our support team.
                  </p>
                </div>
              </div>
            </div>
          ) : (
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
            <div className="flex items-center space-x-2 py-2">
              <input
                type="checkbox"
                id="ai-generated"
                checked={isAiGenerated}
                onChange={(e) => setIsAiGenerated(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-paradisePink focus:ring-paradisePink"
              />
              <label htmlFor="ai-generated" className="text-sm font-medium text-purple-100">
                This content is AI-generated
              </label>
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

            <div className="space-y-4 rounded-md border border-purple-800/60 bg-gray-900/50 p-4">
              <h3 className="text-lg font-semibold text-paradisePink">Creator Terms of Service</h3>
              <div className="text-xs text-purple-200 space-y-2">
                <p>By uploading content, you represent and warrant that:</p>
                <ul className="list-disc list-inside pl-4 space-y-1">
                  <li>You are at least 18 years of age.</li>
                  <li>You are the sole owner of the content and/or have all necessary rights, licenses, and permissions to upload and distribute it on this platform.</li>
                  <li>The content is original and does not infringe upon the copyrights, trademarks, or intellectual property rights of any third party.</li>
                  <li>The content complies with all applicable laws and our platform's Content Guidelines.</li>
                  <li>You grant Paradise Baddies a worldwide, non-exclusive, royalty-free license to use, reproduce, distribute, display, and perform the content in connection with the platform's services. This is your "release."</li>
                </ul>
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-paradisePink focus:ring-paradisePink"
                />
                <label htmlFor="terms" className="text-sm font-medium text-purple-100">
                  I have read and agree to these terms.
                </label>
              </div>
            </div>

            <Button type="submit" className="w-full bg-paradisePink hover:bg-paradiseGold text-white font-semibold" disabled={uploading || !agreedToTerms}>
              {uploading ? "Uploading..." : "Upload Content"}
            </Button>
            {error && (
              <div className="text-red-400 text-center font-semibold mt-2">{error}</div>
            )}
            {success && (
              <div className="text-green-400 text-center font-semibold mt-2">Content uploaded!</div>
            )}
          </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 