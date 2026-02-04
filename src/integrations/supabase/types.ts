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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      appointment_products: {
        Row: {
          appointment_id: string
          created_at: string | null
          id: string
          price: number
          product_id: string | null
          product_name: string
          quantity: number | null
        }
        Insert: {
          appointment_id: string
          created_at?: string | null
          id?: string
          price: number
          product_id?: string | null
          product_name: string
          quantity?: number | null
        }
        Update: {
          appointment_id?: string
          created_at?: string | null
          id?: string
          price?: number
          product_id?: string | null
          product_name?: string
          quantity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "appointment_products_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointment_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      appointment_services: {
        Row: {
          appointment_id: string
          created_at: string | null
          id: string
          price: number
          service_id: string | null
          service_name: string
        }
        Insert: {
          appointment_id: string
          created_at?: string | null
          id?: string
          price: number
          service_id?: string | null
          service_name: string
        }
        Update: {
          appointment_id?: string
          created_at?: string | null
          id?: string
          price?: number
          service_id?: string | null
          service_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointment_services_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointment_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          appointment_date: string
          appointment_time: string
          barber_id: string | null
          client_id: string | null
          client_name: string
          client_phone: string
          created_at: string | null
          id: string
          notes: string | null
          status: Database["public"]["Enums"]["appointment_status"] | null
          total_price: number | null
          updated_at: string | null
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          barber_id?: string | null
          client_id?: string | null
          client_name: string
          client_phone: string
          created_at?: string | null
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["appointment_status"] | null
          total_price?: number | null
          updated_at?: string | null
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          barber_id?: string | null
          client_id?: string | null
          client_name?: string
          client_phone?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["appointment_status"] | null
          total_price?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_barber_id_fkey"
            columns: ["barber_id"]
            isOneToOne: false
            referencedRelation: "barbers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      barbers: {
        Row: {
          bio: string | null
          created_at: string | null
          display_order: number | null
          id: string
          instagram: string | null
          is_active: boolean | null
          name: string
          phone: string | null
          photo_url: string | null
          updated_at: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          instagram?: string | null
          is_active?: boolean | null
          name: string
          phone?: string | null
          photo_url?: string | null
          updated_at?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          instagram?: string | null
          is_active?: boolean | null
          name?: string
          phone?: string | null
          photo_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      blocked_dates: {
        Row: {
          barber_id: string | null
          blocked_date: string
          blocked_time: string | null
          created_at: string | null
          id: string
          is_full_day: boolean | null
          reason: string | null
        }
        Insert: {
          barber_id?: string | null
          blocked_date: string
          blocked_time?: string | null
          created_at?: string | null
          id?: string
          is_full_day?: boolean | null
          reason?: string | null
        }
        Update: {
          barber_id?: string | null
          blocked_date?: string
          blocked_time?: string | null
          created_at?: string | null
          id?: string
          is_full_day?: boolean | null
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blocked_dates_barber_id_fkey"
            columns: ["barber_id"]
            isOneToOne: false
            referencedRelation: "barbers"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          last_visit_at: string | null
          name: string
          phone: string
          total_spent: number | null
          total_visits: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          last_visit_at?: string | null
          name: string
          phone: string
          total_spent?: number | null
          total_visits?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          last_visit_at?: string | null
          name?: string
          phone?: string
          total_spent?: number | null
          total_visits?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category: string | null
          created_at: string
          expense_date: string
          expense_type: string
          id: string
          name: string
          notes: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          category?: string | null
          created_at?: string
          expense_date?: string
          expense_type?: string
          id?: string
          name: string
          notes?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string
          expense_date?: string
          expense_type?: string
          id?: string
          name?: string
          notes?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      gallery: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string
          image_url: string
          is_active: boolean | null
          is_video: boolean | null
          title: string | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_url: string
          is_active?: boolean | null
          is_video?: boolean | null
          title?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_url?: string
          is_active?: boolean | null
          is_video?: boolean | null
          title?: string | null
        }
        Relationships: []
      }
      monthly_goals: {
        Row: {
          appointments_goal: number
          created_at: string
          id: string
          month_year: string
          revenue_goal: number
          subscribers_goal: number
          updated_at: string
        }
        Insert: {
          appointments_goal?: number
          created_at?: string
          id?: string
          month_year: string
          revenue_goal?: number
          subscribers_goal?: number
          updated_at?: string
        }
        Update: {
          appointments_goal?: number
          created_at?: string
          id?: string
          month_year?: string
          revenue_goal?: number
          subscribers_goal?: number
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          name: string
          price: number
          stock: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          price: number
          stock?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
          stock?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          client_name: string
          comment: string | null
          created_at: string | null
          id: string
          is_visible: boolean | null
          rating: number | null
          source: string | null
        }
        Insert: {
          client_name: string
          comment?: string | null
          created_at?: string | null
          id?: string
          is_visible?: boolean | null
          rating?: number | null
          source?: string | null
        }
        Update: {
          client_name?: string
          comment?: string | null
          created_at?: string | null
          id?: string
          is_visible?: boolean | null
          rating?: number | null
          source?: string | null
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          duration_minutes: number | null
          id: string
          is_active: boolean | null
          is_additional: boolean | null
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          is_additional?: boolean | null
          name: string
          price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          is_additional?: boolean | null
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      settings: {
        Row: {
          address: string | null
          business_name: string
          closing_hour: string | null
          created_at: string | null
          email: string | null
          gps_lat: number | null
          gps_lng: number | null
          id: string
          instagram: string | null
          logo_url: string | null
          opening_hour: string | null
          phone: string | null
          reminder_days: number | null
          reminder_enabled: boolean | null
          reminder_message: string | null
          theme_primary_color: string | null
          updated_at: string | null
          whatsapp: string | null
          working_days: string[] | null
        }
        Insert: {
          address?: string | null
          business_name?: string
          closing_hour?: string | null
          created_at?: string | null
          email?: string | null
          gps_lat?: number | null
          gps_lng?: number | null
          id?: string
          instagram?: string | null
          logo_url?: string | null
          opening_hour?: string | null
          phone?: string | null
          reminder_days?: number | null
          reminder_enabled?: boolean | null
          reminder_message?: string | null
          theme_primary_color?: string | null
          updated_at?: string | null
          whatsapp?: string | null
          working_days?: string[] | null
        }
        Update: {
          address?: string | null
          business_name?: string
          closing_hour?: string | null
          created_at?: string | null
          email?: string | null
          gps_lat?: number | null
          gps_lng?: number | null
          id?: string
          instagram?: string | null
          logo_url?: string | null
          opening_hour?: string | null
          phone?: string | null
          reminder_days?: number | null
          reminder_enabled?: boolean | null
          reminder_message?: string | null
          theme_primary_color?: string | null
          updated_at?: string | null
          whatsapp?: string | null
          working_days?: string[] | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          benefits: string[] | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          benefits?: string[] | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          price: number
          updated_at?: string | null
        }
        Update: {
          benefits?: string[] | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "barber"
      appointment_status: "pending" | "confirmed" | "completed" | "cancelled"
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
      app_role: ["admin", "barber"],
      appointment_status: ["pending", "confirmed", "completed", "cancelled"],
    },
  },
} as const
