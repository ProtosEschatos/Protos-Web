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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_api_keys: {
        Row: {
          auth_tag: string
          ciphertext: string
          created_at: string
          env_target: string
          id: string
          is_active: boolean
          iv: string
          label: string
          last_used_at: string | null
          masked_hint: string | null
          notes: string | null
          provider: string
          updated_at: string
        }
        Insert: {
          auth_tag: string
          ciphertext: string
          created_at?: string
          env_target?: string
          id?: string
          is_active?: boolean
          iv: string
          label: string
          last_used_at?: string | null
          masked_hint?: string | null
          notes?: string | null
          provider: string
          updated_at?: string
        }
        Update: {
          auth_tag?: string
          ciphertext?: string
          created_at?: string
          env_target?: string
          id?: string
          is_active?: boolean
          iv?: string
          label?: string
          last_used_at?: string | null
          masked_hint?: string | null
          notes?: string | null
          provider?: string
          updated_at?: string
        }
        Relationships: []
      }
      admin_assets: {
        Row: {
          bucket: string
          category: string
          created_at: string
          duration_seconds: number | null
          height: number | null
          id: string
          is_published: boolean
          label: string | null
          metadata: Json
          mime_type: string | null
          original_filename: string | null
          size_bytes: number | null
          storage_path: string
          tags: string[]
          updated_at: string
          uploaded_by: string | null
          width: number | null
        }
        Insert: {
          bucket?: string
          category: string
          created_at?: string
          duration_seconds?: number | null
          height?: number | null
          id?: string
          is_published?: boolean
          label?: string | null
          metadata?: Json
          mime_type?: string | null
          original_filename?: string | null
          size_bytes?: number | null
          storage_path: string
          tags?: string[]
          updated_at?: string
          uploaded_by?: string | null
          width?: number | null
        }
        Update: {
          bucket?: string
          category?: string
          created_at?: string
          duration_seconds?: number | null
          height?: number | null
          id?: string
          is_published?: boolean
          label?: string | null
          metadata?: Json
          mime_type?: string | null
          original_filename?: string | null
          size_bytes?: number | null
          storage_path?: string
          tags?: string[]
          updated_at?: string
          uploaded_by?: string | null
          width?: number | null
        }
        Relationships: []
      }
      admin_mail_sync: {
        Row: {
          error: string | null
          mailbox_id: string
          messages: Json
          synced_at: string
        }
        Insert: {
          error?: string | null
          mailbox_id: string
          messages?: Json
          synced_at?: string
        }
        Update: {
          error?: string | null
          mailbox_id?: string
          messages?: Json
          synced_at?: string
        }
        Relationships: []
      }
      agent_memories: {
        Row: {
          created_at: string
          id: string
          key: string
          namespace: string
          tags: string[]
          updated_at: string
          user_id: string | null
          value: Json
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          namespace: string
          tags?: string[]
          updated_at?: string
          user_id?: string | null
          value?: Json
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          namespace?: string
          tags?: string[]
          updated_at?: string
          user_id?: string | null
          value?: Json
        }
        Relationships: []
      }
      audit_events: {
        Row: {
          created_at: string
          event: string
          id: number
          payload: Json
          source: string
        }
        Insert: {
          created_at?: string
          event: string
          id?: number
          payload?: Json
          source: string
        }
        Update: {
          created_at?: string
          event?: string
          id?: number
          payload?: Json
          source?: string
        }
        Relationships: []
      }
      automation_webhooks: {
        Row: {
          auth_ciphertext: string | null
          auth_header_name: string | null
          auth_iv: string | null
          auth_tag: string | null
          auth_type: string
          body_template: Json | null
          created_at: string
          event: string
          fire_count: number
          headers_json: Json
          id: string
          is_enabled: boolean
          last_fired_at: string | null
          last_response: string | null
          last_status_code: number | null
          method: string
          name: string
          notes: string | null
          updated_at: string
          url: string
        }
        Insert: {
          auth_ciphertext?: string | null
          auth_header_name?: string | null
          auth_iv?: string | null
          auth_tag?: string | null
          auth_type?: string
          body_template?: Json | null
          created_at?: string
          event?: string
          fire_count?: number
          headers_json?: Json
          id?: string
          is_enabled?: boolean
          last_fired_at?: string | null
          last_response?: string | null
          last_status_code?: number | null
          method?: string
          name: string
          notes?: string | null
          updated_at?: string
          url: string
        }
        Update: {
          auth_ciphertext?: string | null
          auth_header_name?: string | null
          auth_iv?: string | null
          auth_tag?: string | null
          auth_type?: string
          body_template?: Json | null
          created_at?: string
          event?: string
          fire_count?: number
          headers_json?: Json
          id?: string
          is_enabled?: boolean
          last_fired_at?: string | null
          last_response?: string | null
          last_status_code?: number | null
          method?: string
          name?: string
          notes?: string | null
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_slug: string
          content: string | null
          created_at: string | null
          excerpt: string | null
          id: string
          is_published: boolean | null
          language: string
          site_id: string | null
          slug: string
          title: string
        }
        Insert: {
          author_slug?: string
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          is_published?: boolean | null
          language?: string
          site_id?: string | null
          slug: string
          title: string
        }
        Update: {
          author_slug?: string
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          is_published?: boolean | null
          language?: string
          site_id?: string | null
          slug?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          created_at: string | null
          email: string
          id: string
          ip: string | null
          language: string | null
          message: string | null
          name: string
          phone: string | null
          service: string | null
          site_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          ip?: string | null
          language?: string | null
          message?: string | null
          name: string
          phone?: string | null
          service?: string | null
          site_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          ip?: string | null
          language?: string | null
          message?: string | null
          name?: string
          phone?: string | null
          service?: string | null
          site_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      design_elements: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          sort_order: number
          source_board: string | null
          storage_path: string | null
          tags: string[]
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          sort_order?: number
          source_board?: string | null
          storage_path?: string | null
          tags?: string[]
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          sort_order?: number
          source_board?: string | null
          storage_path?: string | null
          tags?: string[]
        }
        Relationships: []
      }
      donations: {
        Row: {
          amount: number
          cause: string | null
          created_at: string | null
          currency: string
          email: string
          id: number
          locale: string | null
          name: string | null
          site_id: string | null
          status: string | null
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
        }
        Insert: {
          amount: number
          cause?: string | null
          created_at?: string | null
          currency?: string
          email: string
          id?: number
          locale?: string | null
          name?: string | null
          site_id?: string | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
        }
        Update: {
          amount?: number
          cause?: string | null
          created_at?: string | null
          currency?: string
          email?: string
          id?: number
          locale?: string | null
          name?: string | null
          site_id?: string | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donations_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      page_backgrounds: {
        Row: {
          created_at: string
          enabled: boolean
          fallback_css: string
          fog_color: string
          glow_color: string
          id: string
          particle_density: number
          poster_path: string | null
          route_key: string
          scene_type: string
          site_id: string
          sort_order: number
          updated_at: string
          webgl_enabled: boolean
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          fallback_css: string
          fog_color?: string
          glow_color?: string
          id?: string
          particle_density?: number
          poster_path?: string | null
          route_key: string
          scene_type?: string
          site_id: string
          sort_order?: number
          updated_at?: string
          webgl_enabled?: boolean
        }
        Update: {
          created_at?: string
          enabled?: boolean
          fallback_css?: string
          fog_color?: string
          glow_color?: string
          id?: string
          particle_density?: number
          poster_path?: string | null
          route_key?: string
          scene_type?: string
          site_id?: string
          sort_order?: number
          updated_at?: string
          webgl_enabled?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "page_backgrounds_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          language: string
          meta_description: string | null
          published: boolean | null
          site_id: string | null
          slug: string
          title: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          language?: string
          meta_description?: string | null
          published?: boolean | null
          site_id?: string | null
          slug: string
          title: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          language?: string
          meta_description?: string | null
          published?: boolean | null
          site_id?: string | null
          slug?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "pages_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_items: {
        Row: {
          active: boolean | null
          created_at: string | null
          description: string | null
          featured: boolean | null
          id: string
          image_url: string | null
          language: string
          project_url: string | null
          site_id: string | null
          sort_order: number | null
          tag: string | null
          title: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          language?: string
          project_url?: string | null
          site_id?: string | null
          sort_order?: number | null
          tag?: string | null
          title: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          language?: string
          project_url?: string | null
          site_id?: string | null
          sort_order?: number | null
          tag?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_items_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_plans: {
        Row: {
          active: boolean | null
          badge: string | null
          created_at: string | null
          cta_text: string | null
          features: string[] | null
          highlighted: boolean | null
          id: string
          language: string
          name: string
          period: string | null
          price: string | null
          site_id: string | null
          sort_order: number | null
        }
        Insert: {
          active?: boolean | null
          badge?: string | null
          created_at?: string | null
          cta_text?: string | null
          features?: string[] | null
          highlighted?: boolean | null
          id?: string
          language?: string
          name: string
          period?: string | null
          price?: string | null
          site_id?: string | null
          sort_order?: number | null
        }
        Update: {
          active?: boolean | null
          badge?: string | null
          created_at?: string | null
          cta_text?: string | null
          features?: string[] | null
          highlighted?: boolean | null
          id?: string
          language?: string
          name?: string
          period?: string | null
          price?: string | null
          site_id?: string | null
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pricing_plans_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      process_steps: {
        Row: {
          active: boolean | null
          created_at: string | null
          description: string | null
          duration: string | null
          icon: string | null
          id: string
          language: string
          site_id: string | null
          step_number: number
          title: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          duration?: string | null
          icon?: string | null
          id?: string
          language?: string
          site_id?: string | null
          step_number: number
          title: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          duration?: string | null
          icon?: string | null
          id?: string
          language?: string
          site_id?: string | null
          step_number?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "process_steps_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          active: boolean | null
          created_at: string | null
          cta_text: string | null
          cta_url: string | null
          features: string[] | null
          icon: string | null
          id: string
          language: string
          price_label: string | null
          site_id: string | null
          sort_order: number | null
          stat: string | null
          subtitle: string | null
          title: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          cta_text?: string | null
          cta_url?: string | null
          features?: string[] | null
          icon?: string | null
          id?: string
          language?: string
          price_label?: string | null
          site_id?: string | null
          sort_order?: number | null
          stat?: string | null
          subtitle?: string | null
          title: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          cta_text?: string | null
          cta_url?: string | null
          features?: string[] | null
          icon?: string | null
          id?: string
          language?: string
          price_label?: string | null
          site_id?: string | null
          sort_order?: number | null
          stat?: string | null
          subtitle?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      site_sections: {
        Row: {
          created_at: string | null
          id: string
          key: string
          language: string
          section: string
          site_id: string | null
          sort_order: number | null
          value: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          key: string
          language?: string
          section: string
          site_id?: string | null
          sort_order?: number | null
          value: string
        }
        Update: {
          created_at?: string | null
          id?: string
          key?: string
          language?: string
          section?: string
          site_id?: string | null
          sort_order?: number | null
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "site_sections_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      sites: {
        Row: {
          active: boolean | null
          created_at: string | null
          default_language: string | null
          domain: string
          domains: string[] | null
          id: string
          languages: string[] | null
          name: string
          stripe_price_id: string | null
          template: string
          theme_config: Json | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          default_language?: string | null
          domain: string
          domains?: string[] | null
          id?: string
          languages?: string[] | null
          name: string
          stripe_price_id?: string | null
          template?: string
          theme_config?: Json | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          default_language?: string | null
          domain?: string
          domains?: string[] | null
          id?: string
          languages?: string[] | null
          name?: string
          stripe_price_id?: string | null
          template?: string
          theme_config?: Json | null
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string | null
          email: string
          id: string
          language: string | null
          site_id: string | null
          source: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          language?: string | null
          site_id?: string | null
          source?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          language?: string | null
          site_id?: string | null
          source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscribers_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          active: boolean | null
          avatar_url: string | null
          content: string
          created_at: string | null
          featured: boolean | null
          id: string
          language: string
          name: string
          rating: number | null
          role: string | null
          site_id: string | null
          sort_order: number | null
        }
        Insert: {
          active?: boolean | null
          avatar_url?: string | null
          content: string
          created_at?: string | null
          featured?: boolean | null
          id?: string
          language?: string
          name: string
          rating?: number | null
          role?: string | null
          site_id?: string | null
          sort_order?: number | null
        }
        Update: {
          active?: boolean | null
          avatar_url?: string | null
          content?: string
          created_at?: string | null
          featured?: boolean | null
          id?: string
          language?: string
          name?: string
          rating?: number | null
          role?: string | null
          site_id?: string | null
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_donation_totals: {
        Args: never
        Returns: {
          cause: string
          total: number
        }[]
      }
      get_submission_counts: { Args: never; Returns: Json }
      submit_contact: {
        Args: {
          p_email: string
          p_ip: string
          p_language: string
          p_message: string
          p_name: string
          p_phone: string
          p_service: string
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
