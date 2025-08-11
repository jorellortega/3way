'use client';

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface SubscriptionTier {
  id: string; // UUID
  creator_id: string; // UUID
  name: string;
  price: number;
  description: string;
  benefits: string[]; // Array of strings
  is_active: boolean;
  popular: boolean;
  subscriber_count: number;
  monthly_revenue: number;
  created_at?: string;
  updated_at?: string;
}

export default function EditSubscriptionsPage() {
  const { user } = useAuth();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(true);
  const [subscriptionTiers, setSubscriptionTiers] = useState<SubscriptionTier[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTier, setEditingTier] = useState<SubscriptionTier | null>(null);
  const [saving, setSaving] = useState(false);
  const [newTier, setNewTier] = useState({
    name: '',
    price: '',
    description: '',
    benefits: ''
  });

  // Fetch existing subscription tiers from database
  const fetchSubscriptionTiers = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('subscription_tiers')
        .select('*')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tiers:', error);
        return;
      }

      if (data) {
        setSubscriptionTiers(data);
      }
    } catch (error) {
      console.error('Error fetching tiers:', error);
    }
  };

  useEffect(() => {
    if (user) {
      setLoading(false);
      fetchSubscriptionTiers();
    }
  }, [user]);

  const handleCreateTier = () => {
    setShowCreateForm(true);
    setEditingTier(null);
  };

  const handleEditTier = (tier: SubscriptionTier) => {
    setEditingTier(tier);
    setNewTier({
      name: tier.name,
      price: tier.price.toString(),
      description: tier.description || '',
      benefits: tier.benefits ? tier.benefits.join('\n') : ''
    });
    setShowCreateForm(false);
  };

  const handleSaveTier = async () => {
    if (!user || !newTier.name || !newTier.price) return;

    setSaving(true);
    
    try {
      // Convert benefits text to array (split by newlines and filter empty lines)
      const benefitsArray = newTier.benefits
        .split('\n')
        .map(benefit => benefit.trim())
        .filter(benefit => benefit.length > 0);

      if (editingTier) {
        // Update existing tier
        const { data, error } = await supabase
          .from('subscription_tiers')
          .update({
            name: newTier.name,
            price: parseFloat(newTier.price),
            description: newTier.description || null,
            benefits: benefitsArray.length > 0 ? benefitsArray : null,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingTier.id)
          .select();

        if (error) {
          console.error('Error updating tier:', error);
          alert('Failed to update tier: ' + error.message);
          return;
        }

        console.log('Tier updated successfully:', data);
      } else {
        // Create new tier
        const { data, error } = await supabase
          .from('subscription_tiers')
          .insert([
            {
              creator_id: user.id,
              name: newTier.name,
              price: parseFloat(newTier.price),
              description: newTier.description || null,
              benefits: benefitsArray.length > 0 ? benefitsArray : null,
              is_active: true,
              popular: false,
              subscriber_count: 0,
              monthly_revenue: 0
            }
          ])
          .select();

        if (error) {
          console.error('Error creating tier:', error);
          alert('Failed to create tier: ' + error.message);
          return;
        }

        console.log('Tier created successfully:', data);
      }

      // Refresh the list from database
      await fetchSubscriptionTiers();
      
      // Reset form and states
      setNewTier({ name: '', price: '', description: '', benefits: '' });
      setShowCreateForm(false);
      setEditingTier(null);
      
    } catch (error) {
      console.error('Error saving tier:', error);
      alert('Failed to save tier');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setEditingTier(null);
    setNewTier({ name: '', price: '', description: '', benefits: '' });
  };

  const handleDeleteTier = async (tierId: string) => {
    if (!confirm('Are you sure you want to delete this tier?')) return;

    try {
      const { error } = await supabase
        .from('subscription_tiers')
        .delete()
        .eq('id', tierId);

      if (error) {
        console.error('Error deleting tier:', error);
        alert('Failed to delete tier: ' + error.message);
        return;
      }

      console.log('Tier deleted successfully');
      await fetchSubscriptionTiers();
    } catch (error) {
      console.error('Error deleting tier:', error);
      alert('Failed to delete tier');
    }
  };

  const handleToggleActive = async (tier: SubscriptionTier) => {
    try {
      const { error } = await supabase
        .from('subscription_tiers')
        .update({ 
          is_active: !tier.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', tier.id);

      if (error) {
        console.error('Error toggling tier status:', error);
        alert('Failed to update tier status: ' + error.message);
        return;
      }

      await fetchSubscriptionTiers();
    } catch (error) {
      console.error('Error toggling tier status:', error);
      alert('Failed to update tier status');
    }
  };

  const handleTogglePopular = async (tier: SubscriptionTier) => {
    try {
      const { error } = await supabase
        .from('subscription_tiers')
        .update({ 
          popular: !tier.popular,
          updated_at: new Date().toISOString()
        })
        .eq('id', tier.id);

      if (error) {
        console.error('Error toggling popular status:', error);
        alert('Failed to update popular status: ' + error.message);
        return;
      }

      await fetchSubscriptionTiers();
    } catch (error) {
      console.error('Error toggling popular status:', error);
      alert('Failed to update popular status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#141414' }}>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-white">
            <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#141414' }}>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-white">
            <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
            <p>You need to be signed in to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#141414' }}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white">Manage Subscription Tiers</h1>
          <p className="text-gray-400">Create and manage your subscription offerings</p>
        </div>

        <div className="grid gap-6">
          {/* Current Tiers - Black to Pink Gradient Card */}
          <Card className="bg-gradient-to-r from-black via-gray-800 to-pink-500 border-pink-600">
            <CardHeader>
              <CardTitle className="text-white">Your Subscription Tiers</CardTitle>
            </CardHeader>
            <CardContent>
              {subscriptionTiers.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-white mb-4">No subscription tiers created yet</p>
                  <Button onClick={handleCreateTier} className="bg-pink-600 hover:bg-pink-700 text-white">Create Your First Tier</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-white">You have {subscriptionTiers.length} tier(s)</p>
                  {subscriptionTiers.map((tier) => (
                    <div key={tier.id} className="bg-black/20 p-4 rounded-lg border border-pink-500/30">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-white font-semibold">{tier.name}</h3>
                          <p className="text-pink-200">${tier.price}/month</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleEditTier(tier)}
                            className="bg-transparent border border-pink-400 text-pink-200 hover:bg-pink-600 hover:text-white"
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleDeleteTier(tier.id)}
                            className="bg-transparent border border-red-400 text-red-200 hover:bg-red-600 hover:text-white"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                      
                      {tier.description && <p className="text-gray-300 text-sm mb-2">{tier.description}</p>}
                      
                      {tier.benefits && tier.benefits.length > 0 && (
                        <div className="mb-3">
                          <p className="text-gray-400 text-xs">Benefits:</p>
                          <ul className="text-gray-300 text-xs list-disc list-inside">
                            {tier.benefits.map((benefit, index) => (
                              <li key={index}>{benefit}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          onClick={() => handleToggleActive(tier)}
                          className={tier.is_active ? "bg-green-600 hover:bg-green-700 text-white" : "bg-transparent border border-green-400 text-green-200 hover:bg-green-600 hover:text-white"}
                        >
                          {tier.is_active ? "Active" : "Inactive"}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleTogglePopular(tier)}
                          className={tier.popular ? "bg-yellow-600 hover:bg-yellow-700 text-black" : "bg-transparent border border-yellow-400 text-yellow-200 hover:bg-yellow-600 hover:text-black"}
                        >
                          {tier.popular ? "Popular" : "Mark Popular"}
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button onClick={handleCreateTier} className="w-full bg-pink-600 hover:bg-pink-700 text-white">Add Another Tier</Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Create/Edit Tier Form */}
          {(showCreateForm || editingTier) && (
            <Card className="bg-gradient-to-r from-black via-gray-800 to-pink-500 border-pink-600">
              <CardHeader>
                <CardTitle className="text-white">
                  {editingTier ? 'Edit Subscription Tier' : 'Create New Subscription Tier'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-white">Tier Name</Label>
                  <Input
                    id="name"
                    value={newTier.name}
                    onChange={(e) => setNewTier({...newTier, name: e.target.value})}
                    placeholder="e.g., Basic, Pro, Premium"
                    className="bg-black/50 border-pink-500 text-white placeholder:text-gray-400"
                  />
                </div>
                
                <div>
                  <Label htmlFor="price" className="text-white">Monthly Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={newTier.price}
                    onChange={(e) => setNewTier({...newTier, price: e.target.value})}
                    placeholder="9.99"
                    className="bg-black/50 border-pink-500 text-white placeholder:text-gray-400"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description" className="text-white">Description</Label>
                  <Textarea
                    id="description"
                    value={newTier.description}
                    onChange={(e) => setNewTier({...newTier, description: e.target.value})}
                    placeholder="What's included in this tier?"
                    className="bg-black/50 border-pink-500 text-white placeholder:text-gray-400"
                  />
                </div>
                
                <div>
                  <Label htmlFor="benefits" className="text-white">Benefits (one per line)</Label>
                  <Textarea
                    id="benefits"
                    value={newTier.benefits}
                    onChange={(e) => setNewTier({...newTier, benefits: e.target.value})}
                    placeholder="Access to exclusive content\nPriority support\nAdvanced features"
                    className="bg-black/50 border-pink-500 text-white placeholder:text-gray-400"
                  />
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    onClick={handleSaveTier} 
                    className="flex-1 bg-pink-600 hover:bg-pink-700 text-white"
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : (editingTier ? 'Update Tier' : 'Save Tier')}
                  </Button>
                  <Button 
                    onClick={handleCancel} 
                    className="flex-1 bg-transparent border border-pink-400 text-pink-200 hover:bg-pink-600 hover:text-white"
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions - Black to Yellow Gradient Card */}
          <Card className="bg-gradient-to-r from-black via-gray-800 to-yellow-500 border-yellow-600">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={handleCreateTier} className="w-full bg-yellow-600 hover:bg-yellow-700 text-black">Create New Tier</Button>
              <Button className="w-full bg-transparent border border-yellow-400 text-yellow-200 hover:bg-yellow-600 hover:text-black">Import from Template</Button>
              <Button className="w-full bg-transparent border border-yellow-400 text-yellow-200 hover:bg-yellow-600 hover:text-black">View Analytics</Button>
            </CardContent>
          </Card>

          {/* Debug Info - Black Card (unchanged) */}
          <Card className="bg-black border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Debug Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-300">
                <p><strong>User ID:</strong> {user.id}</p>
                <p><strong>User Email:</strong> {user.email}</p>
                <p><strong>Page Status:</strong> Working ✅</p>
                <p><strong>Tiers Created:</strong> {subscriptionTiers.length}</p>
                <p><strong>Database:</strong> Connected ✅</p>
                <p><strong>Editing:</strong> {editingTier ? editingTier.name : 'None'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
