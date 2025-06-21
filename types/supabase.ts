export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string
          role: 'user' | 'creator' | 'admin' | 'ceo'
          created_at: string
          updated_at: string
          profile_image: string | null
          bio: string | null
          is_verified: boolean
          last_login: string | null
        }
        Insert: {
          id: string
          first_name: string
          last_name: string
          email: string
          role?: 'user' | 'creator' | 'admin' | 'ceo'
          created_at?: string
          updated_at?: string
          profile_image?: string | null
          bio?: string | null
          is_verified?: boolean
          last_login?: string | null
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string
          role?: 'user' | 'creator' | 'admin' | 'ceo'
          created_at?: string
          updated_at?: string
          profile_image?: string | null
          bio?: string | null
          is_verified?: boolean
          last_login?: string | null
        }
      }
      content: {
        Row: {
          id: number
          creator_id: string
          title: string
          description: string | null
          price: number
          type: 'video' | 'image' | 'package'
          status: 'draft' | 'published' | 'archived'
          created_at: string
          updated_at: string
          thumbnail_url: string | null
          content_url: string | null
          views_count: number
          likes_count: number
          is_featured: boolean
        }
        Insert: {
          id?: number
          creator_id: string
          title: string
          description?: string | null
          price: number
          type: 'video' | 'image' | 'package'
          status?: 'draft' | 'published' | 'archived'
          created_at?: string
          updated_at?: string
          thumbnail_url?: string | null
          content_url?: string | null
          views_count?: number
          likes_count?: number
          is_featured?: boolean
        }
        Update: {
          id?: number
          creator_id?: string
          title?: string
          description?: string | null
          price?: number
          type?: 'video' | 'image' | 'package'
          status?: 'draft' | 'published' | 'archived'
          created_at?: string
          updated_at?: string
          thumbnail_url?: string | null
          content_url?: string | null
          views_count?: number
          likes_count?: number
          is_featured?: boolean
        }
      }
      user_content_access: {
        Row: {
          id: string
          user_id: string
          content_id: number
          transaction_id: string
          access_granted: boolean
          expires_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content_id: number
          transaction_id: string
          access_granted?: boolean
          expires_at: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content_id?: number
          transaction_id?: string
          access_granted?: boolean
          expires_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      // Add other table types as needed
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 