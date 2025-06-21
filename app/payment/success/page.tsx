'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { CheckCircle2 } from 'lucide-react'

export default function PaymentSuccess() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const processSuccess = async () => {
      try {
        // Get transaction details from URL
        const transactionId = searchParams.get('transactionId')
        const contentId = searchParams.get('contentId')

        if (!transactionId || !contentId) {
          throw new Error('Missing transaction details')
        }

        // Verify transaction with CCBill
        // TODO: Implement CCBill transaction verification
        // This will be implemented once we have the CCBill account details

        // Update user's access to content
        const { error: accessError } = await supabase
          .from('user_content_access')
          .insert({
            user_id: (await supabase.auth.getUser()).data.user?.id,
            content_id: contentId,
            transaction_id: transactionId,
            access_granted: true,
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          })

        if (accessError) {
          throw new Error('Failed to grant content access')
        }

        // Redirect to content after 5 seconds
        setTimeout(() => {
          router.push(`/content/${contentId}`)
        }, 5000)

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    processSuccess()
  }, [searchParams, router, supabase])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
          <h2 className="mt-4 text-2xl font-bold">Payment Successful!</h2>
          <p className="mt-2">Processing your access...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-red-500">
          <h2 className="text-2xl font-bold">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return null
} 