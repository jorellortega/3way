'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Loader2 } from 'lucide-react'

export default function PaymentProcess() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const processPayment = async () => {
      try {
        // Get content ID from URL
        const contentId = searchParams.get('contentId')
        if (!contentId) {
          throw new Error('No content ID provided')
        }

        // Fetch content details
        const { data: content, error: contentError } = await supabase
          .from('content')
          .select('*')
          .eq('id', contentId)
          .single()

        if (contentError || !content) {
          throw new Error('Content not found')
        }

        // TODO: Implement CCBill form submission
        // This will be implemented once we have the CCBill account details
        const ccbillFormData = {
          clientAccnum: 'YOUR_CCBILL_ACCOUNT_NUMBER',
          clientSubacc: 'YOUR_CCBILL_SUBACCOUNT',
          formName: 'YOUR_FORM_NAME',
          formPrice: content.price,
          formPeriod: '1', // 1 month
          currencyCode: '840', // USD
          formDigest: '', // Will be calculated
          contentId: content.id,
          contentTitle: content.title,
        }

        // Redirect to CCBill
        // This will be implemented with actual CCBill URL
        console.log('Redirecting to CCBill with:', ccbillFormData)
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    processPayment()
  }, [searchParams, supabase])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Processing payment...</span>
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