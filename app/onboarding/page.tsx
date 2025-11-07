'use client';
import React, { useState, useEffect } from "react";
import { CheckCircle, Circle, ShieldCheck, CreditCard, FileText, ArrowRight, Upload, Settings, X } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/supabase";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  icon: React.ReactNode;
  actionUrl?: string;
  actionText?: string;
}

export default function OnboardingPage() {
  const { user } = useAuth();
  const [supabase] = useState(() => createClientComponentClient<Database>());
  const [currentStep, setCurrentStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [existingProgress, setExistingProgress] = useState<any>(null);

  // Onboarding steps for creators (reordered)
  const [onboardingSteps, setOnboardingSteps] = useState<OnboardingStep[]>([
    {
      id: 'terms',
      title: 'Terms & Documents',
      description: 'Review and accept platform terms of service',
      status: 'pending',
      icon: <FileText className="h-6 w-6" />
    },
    {
      id: 'identity',
      title: 'Identity & Age Verification',
      description: 'Upload government-issued ID or passport for verification',
      status: 'pending',
      icon: <ShieldCheck className="h-6 w-6" />
    },
    {
      id: 'payments',
      title: 'Payments Setup',
      description: 'Configure your payment methods and banking information',
      status: 'pending',
      icon: <CreditCard className="h-6 w-6" />,
      actionUrl: '/payments',
      actionText: 'Setup Payments'
    }
  ]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleTermsAgreement = async () => {
    if (!termsAgreed) {
      alert("Please check the agreement checkbox first.");
      return;
    }

    if (!user?.id) {
      alert("User not authenticated. Please sign in again.");
      return;
    }

    setLoading(true);
    try {
      // Check if record exists
      const { data: existing } = await supabase
        .from('onboarding_progress')
        .select('*')
        .eq('user_id', user.id)
        .single();

      const updateData: any = {
        terms_accepted: true,
        terms_accepted_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      let error;
      if (existing) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('onboarding_progress')
          .update(updateData)
          .eq('user_id', user.id);
        error = updateError;
      } else {
        // Create new record
        const { error: insertError } = await supabase
          .from('onboarding_progress')
          .insert({
            user_id: user.id,
            ...updateData
          });
        error = insertError;
      }

      if (error) {
        throw error;
      }
      
      // Reload progress to update UI
      await loadExistingProgress();
      setShowTermsDialog(false);
      
      // Show success message
      alert("Terms accepted successfully! You can now proceed to identity verification.");
      
    } catch (error) {
      console.error("Error saving terms agreement:", error);
      alert("Failed to save agreement. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setUploadStatus("Please select a file to upload.");
      return;
    }

    if (!user?.id) {
      alert("User not authenticated. Please sign in again.");
      return;
    }

    setLoading(true);
    setUploadStatus("Uploading document...");

    try {
      // Upload document to Supabase storage with unique filename
      const fileExtension = file.name.split('.').pop() || 'png'; // Fallback to png if no extension
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 8);
      // Create safe filename without special characters
      const safeFileName = `identity-doc-${timestamp}-${randomId}.${fileExtension}`;
      let filePath = `onboarding_files/${user.id}/${safeFileName}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('files')
        .upload(filePath, file, {
          upsert: true, // Allow overwriting if file exists
          cacheControl: '3600'
        });

      if (uploadError) {
        console.error("Storage upload error:", uploadError);
        if (uploadError.message?.includes("Duplicate")) {
          // If duplicate, try with a different random ID
          const newRandomId = Math.random().toString(36).substring(2, 8);
          const newFileName = `identity-doc-${timestamp}-${newRandomId}.${fileExtension}`;
          const newFilePath = `onboarding_files/${user.id}/${newFileName}`;
          
          const { data: retryData, error: retryError } = await supabase.storage
            .from('files')
            .upload(newFilePath, file);
            
          if (retryError) {
            throw retryError;
          }
          
          // Use the new file path
          filePath = newFilePath;
        } else {
          throw uploadError;
        }
      }

      // Check if record exists, then update or insert
      const { data: existing, error: fetchError } = await supabase
        .from('onboarding_progress')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle(); // Use maybeSingle instead of single to avoid error if no record exists

      // Prepare update data - only include fields that exist in the actual schema
      // Check what fields the existing record has to determine schema version
      const updateData: any = {
        identity_document_url: filePath,
      };

      // Check which schema we're using based on existing record
      if (existing) {
        // Check if new schema fields exist
        if ('identity_status' in existing) {
          // New schema - use new field names
          updateData.identity_status = 'submitted';
          updateData.identity_submitted_at = new Date().toISOString();
          // Only add these if they exist in the schema
          if ('identity_reviewed_at' in existing) {
            updateData.identity_reviewed_at = null;
          }
          if ('identity_review_notes' in existing) {
            updateData.identity_review_notes = null;
          }
        } else if ('status' in existing) {
          // Old schema - use old field names
          updateData.status = 'submitted';
          if ('identity_verified' in existing) {
            updateData.identity_verified = false; // Reset verification status
          }
        } else {
          // Fallback - try new schema
          updateData.identity_status = 'submitted';
          updateData.identity_submitted_at = new Date().toISOString();
        }
      } else {
        // No existing record - use new schema
        updateData.identity_status = 'submitted';
        updateData.identity_submitted_at = new Date().toISOString();
      }

      let dbError;
      if (existing) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('onboarding_progress')
          .update(updateData)
          .eq('user_id', user.id);
        dbError = updateError;
      } else {
        // Create new record
        const { error: insertError } = await supabase
          .from('onboarding_progress')
          .insert({
            user_id: user.id,
            ...updateData
          });
        dbError = insertError;
      }

      if (dbError) {
        console.error("Database error details:", dbError);
        console.error("Update data:", updateData);
        console.error("Existing record:", existing);
        throw dbError;
      }
      
      // Reload progress to update UI
      await loadExistingProgress();
      setUploadStatus("Document uploaded successfully! Status: Submitted for review. Admin will review within 24-48 hours.");
      setFile(null);
      
    } catch (error) {
      console.error("Error uploading document:", error);
      setUploadStatus("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'in-progress':
        return <Circle className="h-6 w-6 text-yellow-500" />;
      default:
        return <Circle className="h-6 w-6 text-gray-400" />;
    }
  };

  const getStepStatus = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'in-progress':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Load existing onboarding progress
  const loadExistingProgress = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('onboarding_progress')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading progress:', error);
        return;
      }

      if (data) {
        setExistingProgress(data);
        
        // Update step statuses based on database
        setOnboardingSteps(prev => prev.map((step, index) => {
          if (index === 0 && data.terms_accepted) {
            return { ...step, status: 'completed' };
          }
          if (index === 1) {
            // Handle identity verification status
            if (data.identity_status === 'approved') {
              return { ...step, status: 'completed' };
            } else if (data.identity_status === 'submitted' || data.identity_status === 'under_review') {
              return { ...step, status: 'in-progress' };
            } else if (data.identity_status === 'rejected' || data.identity_status === 'resubmit_required') {
              return { ...step, status: 'pending' }; // Reset to pending if rejected
            }
          }
          if (index === 2 && data.payments_setup) {
            return { ...step, status: 'completed' };
          }
          return step;
        }));
      } else {
        // Reset to pending if no data
        setOnboardingSteps(prev => prev.map(step => ({ ...step, status: 'pending' })));
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  useEffect(() => {
    loadExistingProgress();
  }, [user, supabase]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-paradisePink via-paradiseGold to-paradiseWhite p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-paradisePink mb-4">Creator Onboarding</h1>
          <p className="text-xl text-paradiseBlack">
            Complete these steps to start earning from your content
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white bg-opacity-80 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-paradisePink">Progress</h2>
            <span className="text-lg text-paradiseBlack">
              {onboardingSteps.filter(step => step.status === 'completed').length} of {onboardingSteps.length} completed
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-paradisePink to-paradiseGold h-3 rounded-full transition-all duration-500"
              style={{ 
                width: `${(onboardingSteps.filter(step => step.status === 'completed').length / onboardingSteps.length) * 100}%` 
              }}
            ></div>
          </div>
        </div>

        {/* Onboarding Steps */}
        <div className="space-y-6">
          {onboardingSteps.map((step, index) => (
            <div key={step.id} className="bg-white bg-opacity-80 rounded-xl shadow-lg p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {getStepIcon(step.status)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-paradiseBlack">{step.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStepStatus(step.status)}`}>
                      {step.status === 'completed' ? 'Completed' : step.status === 'in-progress' ? 'In Progress' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-paradiseBlack/80 mb-4">{step.description}</p>
                  
                  {/* Step-specific content */}
                  {step.id === 'identity' && (
                    <div className="space-y-4">
                      {/* Show current status if document was submitted */}
                      {existingProgress?.identity_status && existingProgress.identity_status !== 'pending' && (
                        <div className={`p-4 rounded-lg border ${
                          existingProgress.identity_status === 'submitted' || existingProgress.identity_status === 'under_review' 
                            ? 'bg-blue-50 border-blue-200 text-blue-800' 
                            : existingProgress.identity_status === 'approved'
                            ? 'bg-green-50 border-green-200 text-green-800'
                            : 'bg-red-50 border-red-200 text-red-800'
                        }`}>
                          <div className="font-semibold mb-2">
                            Status: {existingProgress.identity_status.replace('_', ' ').toUpperCase()}
                          </div>
                          {existingProgress.identity_status === 'submitted' && (
                            <p>Your document has been submitted and is waiting for admin review. You can upload a new document if needed.</p>
                          )}
                          {existingProgress.identity_status === 'under_review' && (
                            <p>Your document is currently being reviewed by our team. You can upload a new document if needed.</p>
                          )}
                          {existingProgress.identity_status === 'approved' && (
                            <p>Your document has been approved. You can upload a new document if you need to update it.</p>
                          )}
                          {existingProgress.identity_status === 'rejected' && (
                            <p>Your document was rejected. Please upload a new document.</p>
                          )}
                          {existingProgress.identity_status === 'resubmit_required' && (
                            <p>Your document needs to be resubmitted. Please upload a clearer version.</p>
                          )}
                        </div>
                      )}

                      {/* Always show upload form to allow resubmission */}
                      <form onSubmit={handleDocumentUpload} className="space-y-4">
                        <div className="border-2 border-dashed border-paradiseGold rounded-lg p-6 text-center">
                          <Upload className="h-12 w-12 text-paradiseGold mx-auto mb-4" />
                          <p className="text-paradiseBlack mb-2">
                            {existingProgress?.identity_status === 'approved' 
                              ? 'Upload a new document to update your identity verification'
                              : 'Upload your government-issued ID or passport'}
                          </p>
                          <p className="text-sm text-paradiseBlack/60 mb-4">Accepted formats: JPG, PNG, PDF (Max 10MB)</p>
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-paradisePink file:text-white hover:file:bg-paradiseGold"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={!file || loading}
                          className="w-full px-6 py-3 rounded bg-paradisePink text-white font-bold hover:bg-paradiseGold hover:text-paradiseBlack transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading 
                            ? 'Uploading...' 
                            : existingProgress?.identity_status === 'approved'
                            ? 'Update Document'
                            : existingProgress?.identity_status === 'submitted' || existingProgress?.identity_status === 'under_review'
                            ? 'Resubmit Document'
                            : 'Upload Document'}
                        </button>
                        {uploadStatus && (
                          <div className={`text-center p-3 rounded-lg ${
                            uploadStatus.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {uploadStatus}
                          </div>
                        )}
                      </form>
                    </div>
                  )}

                  {step.id === 'payments' && step.status !== 'completed' && (
                    <div className="text-center">
                      <p className="text-paradiseBlack/60 mb-4">Set up your payment methods to receive earnings</p>
                      <Link 
                        href={step.actionUrl || '#'} 
                        className="inline-flex items-center gap-2 px-6 py-3 rounded bg-paradiseGold text-paradiseBlack font-bold hover:bg-paradisePink hover:text-white transition"
                      >
                        {step.actionText}
                        <ArrowRight className="h-5 w-5" />
                      </Link>
                    </div>
                  )}

                  {step.id === 'terms' && step.status !== 'completed' && (
                    <div className="text-center">
                      <p className="text-paradiseBlack/60 mb-4">Review and accept our terms of service</p>
                      <button 
                        onClick={() => setShowTermsDialog(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded bg-paradisePink text-white font-bold hover:bg-paradiseGold hover:text-paradiseBlack transition"
                      >
                        Review Terms
                        <ArrowRight className="h-5 w-5" />
                      </button>
                    </div>
                  )}

                  {step.status === 'completed' && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-semibold">Step completed successfully!</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Completion Message */}
        {onboardingSteps.every(step => step.status === 'completed') && (
          <div className="bg-white bg-opacity-80 rounded-xl shadow-lg p-8 text-center mt-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-paradisePink mb-4">Onboarding Complete! 🎉</h2>
            <p className="text-xl text-paradiseBlack mb-6">
              You're all set to start creating and earning from your content!
            </p>
            <div className="flex gap-4 justify-center">
              <Link 
                href="/dashboard" 
                className="px-6 py-3 rounded bg-paradisePink text-white font-bold hover:bg-paradiseGold hover:text-paradiseBlack transition"
              >
                Go to Dashboard
              </Link>
              <Link 
                href="/baddieupload" 
                className="px-6 py-3 rounded bg-paradiseGold text-paradiseBlack font-bold hover:bg-paradisePink hover:text-white transition"
              >
                Upload Your First Content
              </Link>
            </div>
          </div>
        )}

        {/* Terms Dialog */}
        {showTermsDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
              {/* Dialog Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-paradisePink">Terms of Service</h2>
                <button
                  onClick={() => setShowTermsDialog(false)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Dialog Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="prose prose-lg max-w-none">
                  <h3 className="text-xl font-semibold text-paradiseBlack mb-4">Creator Agreement</h3>
                  
                  <div className="space-y-4 text-paradiseBlack/80">
                    <p>
                      By becoming a creator on our platform, you agree to the following terms and conditions:
                    </p>
                    
                    <h4 className="font-semibold text-paradiseBlack">Content Guidelines</h4>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>All content must be original or properly licensed</li>
                      <li>Content must comply with our community guidelines</li>
                      <li>No explicit adult content without proper age verification</li>
                      <li>Respect intellectual property rights</li>
                    </ul>

                    <h4 className="font-semibold text-paradiseBlack">Payment & Revenue</h4>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Platform takes a 15% commission on all sales</li>
                      <li>Payments are processed monthly on the 1st</li>
                      <li>Minimum payout threshold is $50</li>
                      <li>Tax documentation required for earnings over $600/year</li>
                    </ul>

                    <h4 className="font-semibold text-paradiseBlack">Account Responsibilities</h4>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Maintain accurate profile information</li>
                      <li>Respond to customer inquiries within 48 hours</li>
                      <li>Keep content updated and accessible</li>
                      <li>Report any technical issues promptly</li>
                    </ul>

                    <h4 className="font-semibold text-paradiseBlack">Termination</h4>
                    <p>
                      We reserve the right to terminate accounts that violate these terms. 
                      You may also terminate your account at any time with 30 days notice.
                    </p>
                  </div>
                </div>
              </div>

              {/* Dialog Footer */}
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center gap-3 mb-4">
                  <input
                    type="checkbox"
                    id="terms-agreement"
                    checked={termsAgreed}
                    onChange={(e) => setTermsAgreed(e.target.checked)}
                    className="w-5 h-5 text-paradisePink border-gray-300 rounded focus:ring-paradisePink"
                  />
                  <label htmlFor="terms-agreement" className="text-paradiseBlack font-medium">
                    I have read and agree to the Terms of Service
                  </label>
                </div>
                
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setShowTermsDialog(false)}
                    className="px-6 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleTermsAgreement}
                    disabled={!termsAgreed || loading}
                    className="px-6 py-2 rounded bg-paradisePink text-white font-semibold hover:bg-paradiseGold hover:text-paradiseBlack transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Processing...' : 'I Agree & Continue'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 