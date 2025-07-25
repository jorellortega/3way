'use client';

import Link from "next/link"
import Image from "next/image"
import { Filter, Search, SlidersHorizontal, Star } from "lucide-react"
import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/supabase";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CreatorsPage() {
  const [supabase] = useState(() => createClientComponentClient<Database>())
  const [creators, setCreators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreators = async () => {
      setLoading(true);
      try {
        console.log('Fetching creators...');
        
        // First, let's check if there are any users at all
        const { data: allUsers, error: allUsersError } = await supabase
          .from('users')
          .select('id, first_name, last_name, role')
          .limit(10);
        
        console.log('All users sample:', allUsers);
        console.log('All users error:', allUsersError);
        
        // Check if any users have role 'creator'
        const creatorsInAllUsers = allUsers?.filter(user => user.role === 'creator') || [];
        console.log('Creators found in all users:', creatorsInAllUsers);
        
        // Now fetch creators specifically
        const { data: creatorsData, error } = await supabase
          .from('users')
          .select('id, first_name, last_name, profile_image, bio, role, created_at, is_verified')
          .eq('role', 'creator')
          .order('created_at', { ascending: false });

        console.log('Creators data:', creatorsData);
        console.log('Error:', error);

        if (error) {
          console.error('Error fetching creators:', error);
          setCreators([]);
        } else {
          // If no creators found, show all users as fallback
          let usersToShow = creatorsData || [];
          if (usersToShow.length === 0) {
            console.log('No creators found, showing all users as fallback');
            usersToShow = allUsers || [];
          }
          
          // Add mock content count for now
          const processedCreators = usersToShow?.map((creator: any) => ({
            ...creator,
            profile_image: creator.profile_image || null,
            bio: creator.bio || 'Digital content creator',
            is_verified: creator.is_verified || false,
            created_at: creator.created_at || new Date().toISOString(),
            contentCount: Math.floor(Math.random() * 20) + 1, // Mock data
            totalContent: Math.floor(Math.random() * 30) + 5
          })) || [];
          
          console.log('Processed creators:', processedCreators);
          setCreators(processedCreators);
        }
      } catch (error) {
        console.error('Error fetching creators:', error);
        setCreators([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCreators();
  }, [supabase]);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-paradisePink via-paradiseGold to-paradiseWhite">
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-paradisePink">Featured Creators</h1>
            <p className="text-paradiseWhite">Discover and follow talented content creators</p>
          </div>
          <div className="flex w-full items-center gap-2 md:w-auto">
            <div className="relative flex-1 md:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-paradiseGold" />
              <Input
                type="search"
                placeholder="Search creators..."
                className="w-full rounded-full bg-paradiseWhite border-paradiseGold pl-8 text-paradiseBlack focus-visible:ring-paradisePink"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              className="border-paradiseGold bg-paradiseWhite text-paradisePink hover:bg-paradiseGold/20 hover:text-paradiseBlack"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="sr-only">Filter</span>
            </Button>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1 border-paradiseGold bg-paradiseWhite text-paradisePink hover:bg-paradiseGold/20 hover:text-paradiseBlack"
            >
              <Filter className="h-3.5 w-3.5" />
              Filters
            </Button>
            <Select defaultValue="all">
              <SelectTrigger className="h-8 w-[150px] border-paradiseGold bg-paradiseWhite text-paradiseBlack focus:ring-paradisePink">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-paradiseWhite border-paradiseGold text-paradiseBlack">
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="photography">Photography</SelectItem>
                <SelectItem value="videography">Videography</SelectItem>
                <SelectItem value="illustration">Illustration</SelectItem>
                <SelectItem value="3d">3D Art</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="popular">
              <SelectTrigger className="h-8 w-[150px] border-paradiseGold bg-paradiseWhite text-paradiseBlack focus:ring-paradisePink">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-paradiseWhite border-paradiseGold text-paradiseBlack">
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="content">Most Content</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-sm text-paradiseWhite">Showing 1-{creators.length} of {creators.length} creators</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-lg border border-paradiseGold/30 shadow-[0_0_15px_rgba(249,200,70,0.15)] animate-pulse" style={{ backgroundColor: '#141414' }}>
                <div className="relative aspect-[4/3] w-full bg-gray-800"></div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="h-4 bg-gray-800 rounded w-24"></div>
                    <div className="flex items-center gap-1">
                      <div className="h-4 w-4 bg-gray-800 rounded"></div>
                      <div className="h-3 bg-gray-800 rounded w-6"></div>
                    </div>
                  </div>
                  <div className="h-3 bg-gray-800 rounded mb-2"></div>
                  <div className="flex items-center justify-between">
                    <div className="h-3 bg-gray-800 rounded w-16"></div>
                    <div className="h-3 bg-gray-800 rounded w-20"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : creators.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {creators.map((creator) => (
              <Link key={creator.id} href={`/creators/${creator.id}`} className="group">
                <div className="overflow-hidden rounded-lg border border-paradiseGold/30 shadow-[0_0_15px_rgba(249,200,70,0.15)]" style={{ backgroundColor: '#141414' }}>
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    {creator.profile_image ? (
                      <Image
                        src={supabase.storage.from('files').getPublicUrl(creator.profile_image).data.publicUrl || ''}
                        width={400}
                        height={300}
                        alt={`${creator.first_name} ${creator.last_name}`}
                        className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-paradiseGold">
                        <div className="text-center">
                          <div className="text-4xl mb-2">👤</div>
                          <div className="text-sm">No Profile Image</div>
                        </div>
                      </div>
                    )}
                    {creator.is_verified && (
                      <div className="absolute right-2 top-2 rounded-full bg-paradisePink px-2 py-1 text-xs font-medium text-paradiseWhite">
                        Verified
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-paradisePink">{creator.first_name} {creator.last_name}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-paradiseGold" />
                        <span className="text-sm text-paradiseGold">4.8</span>
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-paradiseGold">{creator.bio || 'Digital Content Creator'}</p>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <p className="text-paradiseGold">{creator.contentCount} items</p>
                      <p className="text-paradisePink">Creator</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-medium text-paradisePink mb-2">No Creators Found</h3>
            <p className="text-paradiseGold">Be the first to join as a creator!</p>
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <nav className="flex items-center gap-1">
            <Button variant="outline" size="icon" disabled className="border-paradiseGold bg-paradiseWhite text-paradisePink">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
              <span className="sr-only">Previous</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 border-paradiseGold bg-paradiseWhite text-paradisePink hover:bg-paradiseGold/20 hover:text-paradiseBlack"
            >
              1
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 border-paradiseGold bg-paradiseWhite text-paradisePink hover:bg-paradiseGold/20 hover:text-paradiseBlack"
            >
              2
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 border-paradiseGold bg-paradiseWhite text-paradisePink hover:bg-paradiseGold/20 hover:text-paradiseBlack"
            >
              3
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 border-paradiseGold bg-paradiseWhite text-paradisePink hover:bg-paradiseGold/20 hover:text-paradiseBlack"
            >
              4
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="border-paradiseGold bg-paradiseWhite text-paradisePink hover:bg-paradiseGold/20 hover:text-paradiseBlack"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
              <span className="sr-only">Next</span>
            </Button>
          </nav>
        </div>
      </div>
    </div>
  )
} 