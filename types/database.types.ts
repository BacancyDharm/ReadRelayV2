export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      book_club_status: {
        Row: {
          added_at: string
          book_id: string
          club_id: string
          id: string
          status: Database["public"]["Enums"]["book_status"]
        }
        Insert: {
          added_at?: string
          book_id: string
          club_id: string
          id?: string
          status?: Database["public"]["Enums"]["book_status"]
        }
        Update: {
          added_at?: string
          book_id?: string
          club_id?: string
          id?: string
          status?: Database["public"]["Enums"]["book_status"]
        }
        Relationships: [
          {
            foreignKeyName: "book_club_status_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "book_club_status_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      books: {
        Row: {
          authors: string[]
          cover_url: string | null
          created_at: string
          description: string | null
          google_volume_id: string | null
          id: string
          isbn_10: string | null
          isbn_13: string | null
          page_count: number | null
          title: string
        }
        Insert: {
          authors: string[]
          cover_url?: string | null
          created_at?: string
          description?: string | null
          google_volume_id?: string | null
          id?: string
          isbn_10?: string | null
          isbn_13?: string | null
          page_count?: number | null
          title: string
        }
        Update: {
          authors?: string[]
          cover_url?: string | null
          created_at?: string
          description?: string | null
          google_volume_id?: string | null
          id?: string
          isbn_10?: string | null
          isbn_13?: string | null
          page_count?: number | null
          title?: string
        }
        Relationships: []
      }
      club_invitations: {
        Row: {
          accepted_at: string | null
          club_id: string
          created_at: string
          email: string
          expires_at: string
          id: string
          token: string
        }
        Insert: {
          accepted_at?: string | null
          club_id: string
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          token?: string
        }
        Update: {
          accepted_at?: string | null
          club_id?: string
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_invitations_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      club_members: {
        Row: {
          club_id: string
          current_page: number
          id: string
          joined_at: string
          user_id: string
        }
        Insert: {
          club_id: string
          current_page?: number
          id?: string
          joined_at?: string
          user_id: string
        }
        Update: {
          club_id?: string
          current_page?: number
          id?: string
          joined_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_members_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      clubs: {
        Row: {
          created_at: string
          description: string | null
          genre_tags: string[] | null
          id: string
          is_public: boolean
          leader_id: string
          max_members: number
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          genre_tags?: string[] | null
          id?: string
          is_public?: boolean
          leader_id: string
          max_members?: number
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          genre_tags?: string[] | null
          id?: string
          is_public?: boolean
          leader_id?: string
          max_members?: number
          name?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "clubs_leader_id_fkey"
            columns: ["leader_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      reading_logs: {
        Row: {
          book_id: string
          club_id: string
          created_at: string | null
          id: string
          note: string | null
          page_to: number
          user_id: string
        }
        Insert: {
          book_id: string
          club_id: string
          created_at?: string | null
          id?: string
          note?: string | null
          page_to: number
          user_id: string
        }
        Update: {
          book_id?: string
          club_id?: string
          created_at?: string | null
          id?: string
          note?: string | null
          page_to?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reading_logs_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reading_logs_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reading_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule_sections: {
        Row: {
          club_book_id: string
          created_at: string
          deadline: string
          end_page: number
          id: string
          section_number: number
          start_page: number
          title: string | null
        }
        Insert: {
          club_book_id: string
          created_at?: string
          deadline: string
          end_page: number
          id?: string
          section_number: number
          start_page: number
          title?: string | null
        }
        Update: {
          club_book_id?: string
          created_at?: string
          deadline?: string
          end_page?: number
          id?: string
          section_number?: number
          start_page?: number
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "schedule_sections_club_book_id_fkey"
            columns: ["club_book_id"]
            isOneToOne: false
            referencedRelation: "book_club_status"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar: string | null
          bio: string | null
          created_at: string
          email: string
          genre_preference: string[] | null
          headline: string | null
          id: string
          name: string | null
          notification_preferences: Json
          onboarding: boolean
          role: Database["public"]["Enums"]["role"]
        }
        Insert: {
          avatar?: string | null
          bio?: string | null
          created_at?: string
          email: string
          genre_preference?: string[] | null
          headline?: string | null
          id?: string
          name?: string | null
          notification_preferences?: Json
          onboarding?: boolean
          role?: Database["public"]["Enums"]["role"]
        }
        Update: {
          avatar?: string | null
          bio?: string | null
          created_at?: string
          email?: string
          genre_preference?: string[] | null
          headline?: string | null
          id?: string
          name?: string | null
          notification_preferences?: Json
          onboarding?: boolean
          role?: Database["public"]["Enums"]["role"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      book_status: "going" | "completed"
      privacy_type: "public" | "private"
      role: "LEADER" | "ADMIN" | "GUEST" | "MEMBER"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      book_status: ["going", "completed"],
      privacy_type: ["public", "private"],
      role: ["LEADER", "ADMIN", "GUEST", "MEMBER"],
    },
  },
} as const
