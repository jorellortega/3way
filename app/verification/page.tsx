"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import type { Database } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck, 
  ShieldAlert, 
  Clock, 
  CheckCircle, 
  XCircle, 
  FileText, 
  CreditCard, 
  User,
  Search,
  Filter,
  Download,
  Eye,
  RefreshCw
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface OnboardingRecord {
  id: string;
  user_id: string;
  identity_status: 'pending' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'resubmit_required';
  identity_document_url: string | null;
  identity_submitted_at: string | null;
  identity_reviewed_at: string | null;
  identity_review_notes: string | null;
  payments_setup: boolean;
  payments_setup_at: string | null;
  payments_provider: string | null;
  terms_accepted: boolean;
  terms_accepted_at: string | null;
  created_at: string;
  updated_at: string;
  user: {
    first_name: string;
    last_name: string;
    email: string;
    creator_name: string | null;
    role: string;
    profile_image: string | null;
    account_status?: string;
  };
}

export default function VerificationPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [supabase] = useState(() => createClientComponentClient<Database>());
  const [profile, setProfile] = useState<{ role: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [onboardingRecords, setOnboardingRecords] = useState<OnboardingRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<OnboardingRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<OnboardingRecord | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [accountStatus, setAccountStatus] = useState<string>("good_standing");
  const [saving, setSaving] = useState(false);
  const [updatingAccountStatus, setUpdatingAccountStatus] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewingDocument, setViewingDocument] = useState(false);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        router.push("/dashboard");
        return;
      }

      if (data?.role !== "admin" && data?.role !== "ceo") {
        router.push("/dashboard");
        return;
      }

      setProfile(data);
      setLoading(false);
    };

    if (!authLoading) {
      fetchProfile();
    }
  }, [user, authLoading, router, supabase]);

  useEffect(() => {
    if (profile && (profile.role === "admin" || profile.role === "ceo")) {
      fetchOnboardingRecords();
    }
  }, [profile, supabase]);

  useEffect(() => {
    filterRecords();
  }, [searchTerm, statusFilter, onboardingRecords]);

  const fetchOnboardingRecords = async () => {
    try {
      // First fetch onboarding records
      const { data: onboardingData, error: onboardingError } = await supabase
        .from("onboarding_progress")
        .select("*")
        .order("created_at", { ascending: false });

      if (onboardingError) {
        console.error("Error fetching onboarding records:", onboardingError);
        return;
      }

      // Then fetch user data for each record
      const recordsWithUsers = await Promise.all(
        (onboardingData || []).map(async (record: any) => {
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("first_name, last_name, email, creator_name, role, profile_image, account_status")
            .eq("id", record.user_id)
            .single();

          if (userError) {
            console.error("Error fetching user:", userError);
            return null;
          }

          return {
            ...record,
            user: userData
          } as OnboardingRecord;
        })
      );

      const validRecords = recordsWithUsers.filter((r): r is OnboardingRecord => r !== null);
      setOnboardingRecords(validRecords);
      setFilteredRecords(validRecords);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const filterRecords = () => {
    let filtered = [...onboardingRecords];

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((record) => {
        const userName = `${record.user.first_name} ${record.user.last_name}`.toLowerCase();
        const creatorName = (record.user.creator_name || "").toLowerCase();
        const email = record.user.email.toLowerCase();
        return (
          userName.includes(term) ||
          creatorName.includes(term) ||
          email.includes(term)
        );
      });
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((record) => record.identity_status === statusFilter);
    }

    setFilteredRecords(filtered);
  };

  const handleReview = async (record: OnboardingRecord) => {
    setSelectedRecord(record);
    setReviewNotes(record.identity_review_notes || "");
    setSelectedStatus(record.identity_status);
    
    // Fetch user's account status
    const { data: userData } = await supabase
      .from("users")
      .select("account_status")
      .eq("id", record.user_id)
      .single();
    
    if (userData) {
      setAccountStatus(userData.account_status || "good_standing");
    }
  };

  const handleUpdateAccountStatus = async (userId: string, newStatus: string) => {
    setUpdatingAccountStatus(userId);
    try {
      const { error } = await supabase
        .from("users")
        .update({ account_status: newStatus })
        .eq("id", userId);

      if (error) {
        alert("Error updating account status: " + error.message);
      } else {
        await fetchOnboardingRecords();
        alert("Account status updated successfully!");
      }
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setUpdatingAccountStatus(null);
    }
  };

  const handleSaveReview = async () => {
    if (!selectedRecord) return;

    setSaving(true);
    try {
      // Update onboarding progress
      const updateData: any = {
        identity_status: selectedStatus,
        identity_review_notes: reviewNotes,
        identity_reviewed_at: new Date().toISOString(),
      };

      const { error: onboardingError } = await supabase
        .from("onboarding_progress")
        .update(updateData)
        .eq("id", selectedRecord.id);

      if (onboardingError) {
        alert("Error updating review: " + onboardingError.message);
        setSaving(false);
        return;
      }

      // Update user's account status
      const { error: userError } = await supabase
        .from("users")
        .update({ account_status: accountStatus })
        .eq("id", selectedRecord.user_id);

      if (userError) {
        alert("Error updating account status: " + userError.message);
        setSaving(false);
        return;
      }

      await fetchOnboardingRecords();
      setSelectedRecord(null);
      setReviewNotes("");
      setSelectedStatus("");
      setAccountStatus("good_standing");
      alert("Review and account status updated successfully!");
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const viewDocument = async (documentUrl: string) => {
    const { data } = await supabase.storage
      .from("files")
      .getPublicUrl(documentUrl);

    if (data?.publicUrl) {
      setDocumentUrl(data.publicUrl);
      setViewingDocument(true);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "under_review":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "submitted":
        return <FileText className="h-5 w-5 text-blue-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/20 text-green-400";
      case "rejected":
        return "bg-red-500/20 text-red-400";
      case "under_review":
        return "bg-yellow-500/20 text-yellow-400";
      case "submitted":
        return "bg-blue-500/20 text-blue-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-paradisePink">Loading...</h2>
          <p className="text-paradiseBlack/80">Please wait while we load the verification page.</p>
        </div>
      </div>
    );
  }

  if (!user || !profile || (profile.role !== "admin" && profile.role !== "ceo")) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
          <p className="text-paradiseBlack/80">You must be an admin to access this page.</p>
          <Link href="/dashboard" className="mt-4 inline-block text-paradisePink hover:underline">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-paradisePink via-paradiseGold to-paradiseWhite p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-paradisePink mb-2">Verification Center</h1>
          <p className="text-paradiseBlack/80">Review and manage creator onboarding verification</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-[#141414] rounded-lg p-4 mb-6 border border-paradiseGold/30">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, creator name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded bg-[#1a1a1a] border border-paradiseGold/30 text-white focus:outline-none focus:border-paradisePink"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 rounded bg-[#1a1a1a] border border-paradiseGold/30 text-white focus:outline-none focus:border-paradisePink"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="submitted">Submitted</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="resubmit_required">Resubmit Required</option>
              </select>
            </div>
            <Button
              onClick={fetchOnboardingRecords}
              className="bg-paradiseGold text-paradiseBlack hover:bg-paradisePink hover:text-paradiseWhite"
            >
              <RefreshCw className="h-4 w-4 mr-2" /> Refresh
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#141414] rounded-lg p-4 border border-paradiseGold/30">
            <div className="text-2xl font-bold text-paradisePink">{onboardingRecords.length}</div>
            <div className="text-sm text-gray-400">Total Records</div>
          </div>
          <div className="bg-[#141414] rounded-lg p-4 border border-paradiseGold/30">
            <div className="text-2xl font-bold text-yellow-400">
              {onboardingRecords.filter(r => r.identity_status === "submitted" || r.identity_status === "under_review").length}
            </div>
            <div className="text-sm text-gray-400">Pending Review</div>
          </div>
          <div className="bg-[#141414] rounded-lg p-4 border border-paradiseGold/30">
            <div className="text-2xl font-bold text-green-400">
              {onboardingRecords.filter(r => r.identity_status === "approved").length}
            </div>
            <div className="text-sm text-gray-400">Approved</div>
          </div>
          <div className="bg-[#141414] rounded-lg p-4 border border-paradiseGold/30">
            <div className="text-2xl font-bold text-red-400">
              {onboardingRecords.filter(r => r.identity_status === "rejected").length}
            </div>
            <div className="text-sm text-gray-400">Rejected</div>
          </div>
        </div>

        {/* Records Table */}
        <div className="bg-[#141414] rounded-lg border border-paradiseGold/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#1a1a1a] border-b border-paradiseGold/30">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-paradiseGold">User</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-paradiseGold">Account Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-paradiseGold">Identity Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-paradiseGold">Payments</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-paradiseGold">Terms</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-paradiseGold">Submitted</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-paradiseGold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                      No records found
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((record) => (
                    <tr
                      key={record.id}
                      className="border-b border-paradiseGold/10 hover:bg-[#1a1a1a] transition"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          {record.user.profile_image ? (
                            <Image
                              src={supabase.storage.from("files").getPublicUrl(record.user.profile_image).data.publicUrl}
                              alt="Avatar"
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                              <User className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-white">
                              {record.user.creator_name || `${record.user.first_name} ${record.user.last_name}`}
                            </div>
                            <div className="text-sm text-gray-400">{record.user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <select
                          value={record.user.account_status || 'good_standing'}
                          onChange={(e) => handleUpdateAccountStatus(record.user_id, e.target.value)}
                          disabled={updatingAccountStatus === record.user_id}
                          className={`px-2 py-1 rounded text-xs font-semibold border border-paradiseGold/30 focus:outline-none focus:border-paradisePink cursor-pointer ${
                            record.user.account_status === 'good_standing' ? 'bg-green-500/20 text-green-400' :
                            record.user.account_status === 'paused' ? 'bg-yellow-500/20 text-yellow-400' :
                            record.user.account_status === 'hold' ? 'bg-orange-500/20 text-orange-400' :
                            record.user.account_status === 'blocked' ? 'bg-red-500/20 text-red-400' :
                            'bg-gray-500/20 text-gray-400'
                          } ${updatingAccountStatus === record.user_id ? 'opacity-50 cursor-wait' : ''}`}
                        >
                          <option value="good_standing" className="bg-white text-paradiseBlack">Good Standing</option>
                          <option value="paused" className="bg-white text-paradiseBlack">Paused</option>
                          <option value="hold" className="bg-white text-paradiseBlack">On Hold</option>
                          <option value="blocked" className="bg-white text-paradiseBlack">Blocked</option>
                        </select>
                        {updatingAccountStatus === record.user_id && (
                          <span className="ml-2 text-xs text-gray-400">Updating...</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(record.identity_status)}
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(record.identity_status)}`}>
                            {record.identity_status.replace("_", " ")}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {record.payments_setup ? (
                          <div className="flex items-center gap-2 text-green-400">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-sm">Setup</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-gray-400">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm">Pending</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {record.terms_accepted ? (
                          <div className="flex items-center gap-2 text-green-400">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-sm">Accepted</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-gray-400">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm">Pending</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-400">
                        {record.identity_submitted_at
                          ? new Date(record.identity_submitted_at).toLocaleDateString()
                          : "Not submitted"}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          {record.identity_document_url && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => viewDocument(record.identity_document_url!)}
                              className="text-xs text-paradiseBlack border-paradiseGold bg-paradiseGold hover:bg-paradisePink hover:text-paradiseWhite hover:border-paradisePink"
                            >
                              <Eye className="h-3 w-3 mr-1" /> View Doc
                            </Button>
                          )}
                          <Button
                            size="sm"
                            onClick={() => handleReview(record)}
                            className="bg-paradisePink text-white hover:bg-paradiseGold hover:text-paradiseBlack text-xs"
                          >
                            Review
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Review Modal */}
        {selectedRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-[#141414] rounded-lg p-6 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-paradiseGold/30">
              <h2 className="text-2xl font-bold text-paradisePink mb-4">Review Verification</h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-paradiseGold mb-2">User</label>
                  <div className="text-white">
                    {selectedRecord.user.creator_name || `${selectedRecord.user.first_name} ${selectedRecord.user.last_name}`}
                  </div>
                  <div className="text-sm text-gray-400">{selectedRecord.user.email}</div>
                </div>

                {selectedRecord.identity_document_url && (
                  <div>
                    <label className="block text-sm font-semibold text-paradiseGold mb-2">Identity Document</label>
                    <Button
                      onClick={() => viewDocument(selectedRecord.identity_document_url!)}
                      className="bg-paradiseGold text-paradiseBlack hover:bg-paradisePink hover:text-paradiseWhite"
                    >
                      <Download className="h-4 w-4 mr-2" /> View Document
                    </Button>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-paradiseGold mb-2">Identity Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-4 py-2 rounded bg-white border border-paradiseGold/30 text-paradiseBlack focus:outline-none focus:border-paradisePink"
                  >
                    <option value="pending">Pending</option>
                    <option value="submitted">Submitted</option>
                    <option value="under_review">Under Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="resubmit_required">Resubmit Required</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-paradiseGold mb-2">Account Status</label>
                  <select
                    value={accountStatus}
                    onChange={(e) => setAccountStatus(e.target.value)}
                    className="w-full px-4 py-2 rounded bg-white border border-paradiseGold/30 text-paradiseBlack focus:outline-none focus:border-paradisePink"
                  >
                    <option value="good_standing">Good Standing</option>
                    <option value="paused">Paused</option>
                    <option value="hold">On Hold</option>
                    <option value="blocked">Blocked</option>
                  </select>
                  <p className="text-xs text-gray-400 mt-1">
                    {accountStatus === "good_standing" && "Account is active and in good standing"}
                    {accountStatus === "paused" && "Account is temporarily paused"}
                    {accountStatus === "hold" && "Account is on hold pending review"}
                    {accountStatus === "blocked" && "Account is blocked and cannot access the platform"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-paradiseGold mb-2">Review Notes</label>
                  <textarea
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 rounded bg-white border border-paradiseGold/30 text-paradiseBlack focus:outline-none focus:border-paradisePink"
                    placeholder="Add review notes..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-paradiseGold mb-2">Payments Setup</label>
                    <div className={selectedRecord.payments_setup ? "text-green-400" : "text-gray-400"}>
                      {selectedRecord.payments_setup ? "✓ Complete" : "✗ Pending"}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-paradiseGold mb-2">Terms Accepted</label>
                    <div className={selectedRecord.terms_accepted ? "text-green-400" : "text-gray-400"}>
                      {selectedRecord.terms_accepted ? "✓ Accepted" : "✗ Pending"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-end">
                <Button
                  onClick={() => {
                    setSelectedRecord(null);
                    setReviewNotes("");
                    setSelectedStatus("");
                  }}
                  variant="outline"
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveReview}
                  disabled={saving}
                  className="bg-paradisePink text-white hover:bg-paradiseGold hover:text-paradiseBlack"
                >
                  {saving ? "Saving..." : "Save Review"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Document Viewer Modal */}
        {viewingDocument && documentUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <div className="bg-[#141414] rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-paradiseGold/30">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-paradisePink">Identity Document</h3>
                <Button
                  onClick={() => {
                    setViewingDocument(false);
                    setDocumentUrl(null);
                  }}
                  variant="outline"
                  size="sm"
                  className="text-paradiseBlack border-paradiseGold bg-paradiseGold hover:bg-paradisePink hover:text-paradiseWhite hover:border-paradisePink"
                >
                  Close
                </Button>
              </div>
              <div className="flex justify-center">
                <Image
                  src={documentUrl}
                  alt="Identity Document"
                  width={800}
                  height={600}
                  className="rounded border border-paradiseGold/30"
                  style={{ objectFit: "contain" }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

