export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          avatar_url: string | null;
          plan: "free" | "starter" | "pro" | "agency";
          credits: number;
          stripe_customer_id: string | null;
          trial_ends_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          avatar_url?: string | null;
          plan?: "free" | "starter" | "pro" | "agency";
          credits?: number;
          stripe_customer_id?: string | null;
          trial_ends_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          avatar_url?: string | null;
          plan?: "free" | "starter" | "pro" | "agency";
          credits?: number;
          stripe_customer_id?: string | null;
          trial_ends_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      credit_transactions: {
        Row: {
          id: string;
          user_id: string;
          action:
            | "image_gen"
            | "agent_run"
            | "post_scheduled"
            | "text_gen"
            | "video_gen";
          amount: number;
          balance_after: number;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          action:
            | "image_gen"
            | "agent_run"
            | "post_scheduled"
            | "text_gen"
            | "video_gen";
          amount: number;
          balance_after: number;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          action?:
            | "image_gen"
            | "agent_run"
            | "post_scheduled"
            | "text_gen"
            | "video_gen";
          amount?: number;
          balance_after?: number;
          metadata?: Json;
          created_at?: string;
        };
      };
      agents: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          persona: string | null;
          tone: string | null;
          goals: string | null;
          instructions: string | null;
          memory: Json;
          status: "active" | "inactive";
          runs_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          persona?: string | null;
          tone?: string | null;
          goals?: string | null;
          instructions?: string | null;
          memory?: Json;
          status?: "active" | "inactive";
          runs_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          persona?: string | null;
          tone?: string | null;
          goals?: string | null;
          instructions?: string | null;
          memory?: Json;
          status?: "active" | "inactive";
          runs_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      agent_runs: {
        Row: {
          id: string;
          agent_id: string;
          user_id: string;
          input: string;
          output: string | null;
          credits_used: number;
          duration_ms: number | null;
          status: "completed" | "failed";
          created_at: string;
        };
        Insert: {
          id?: string;
          agent_id: string;
          user_id: string;
          input: string;
          output?: string | null;
          credits_used?: number;
          duration_ms?: number | null;
          status?: "completed" | "failed";
          created_at?: string;
        };
        Update: {
          id?: string;
          agent_id?: string;
          user_id?: string;
          input?: string;
          output?: string | null;
          credits_used?: number;
          duration_ms?: number | null;
          status?: "completed" | "failed";
          created_at?: string;
        };
      };
      generations: {
        Row: {
          id: string;
          user_id: string;
          type: "image" | "text" | "video";
          prompt: string;
          result_url: string | null;
          model: string | null;
          metadata: Json;
          credits_used: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: "image" | "text" | "video";
          prompt: string;
          result_url?: string | null;
          model?: string | null;
          metadata?: Json;
          credits_used?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: "image" | "text" | "video";
          prompt?: string;
          result_url?: string | null;
          model?: string | null;
          metadata?: Json;
          credits_used?: number;
          created_at?: string;
        };
      };
      library_items: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: "image" | "video" | "document" | "brand_asset" | "code" | "audio";
          file_url: string;
          file_size: number | null;
          mime_type: string | null;
          tags: string[] | null;
          is_brand_asset: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          type: "image" | "video" | "document" | "brand_asset" | "code" | "audio";
          file_url: string;
          file_size?: number | null;
          mime_type?: string | null;
          tags?: string[] | null;
          is_brand_asset?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          type?: "image" | "video" | "document" | "brand_asset" | "code" | "audio";
          file_url?: string;
          file_size?: number | null;
          mime_type?: string | null;
          tags?: string[] | null;
          is_brand_asset?: boolean;
          created_at?: string;
        };
      };
      social_accounts: {
        Row: {
          id: string;
          user_id: string;
          platform:
            | "instagram"
            | "facebook"
            | "twitter"
            | "linkedin"
            | "tiktok"
            | "youtube"
            | "pinterest";
          account_name: string;
          account_id: string;
          access_token: string | null;
          refresh_token: string | null;
          followers: number | null;
          connected_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          platform:
            | "instagram"
            | "facebook"
            | "twitter"
            | "linkedin"
            | "tiktok"
            | "youtube"
            | "pinterest";
          account_name: string;
          account_id: string;
          access_token?: string | null;
          refresh_token?: string | null;
          followers?: number | null;
          connected_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          platform?:
            | "instagram"
            | "facebook"
            | "twitter"
            | "linkedin"
            | "tiktok"
            | "youtube"
            | "pinterest";
          account_name?: string;
          account_id?: string;
          access_token?: string | null;
          refresh_token?: string | null;
          followers?: number | null;
          connected_at?: string;
        };
      };
      scheduled_posts: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          platforms: string[];
          media_urls: string[] | null;
          scheduled_at: string;
          status: "pending" | "posted" | "failed" | "approved";
          approved: boolean;
          generation_id: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          content: string;
          platforms: string[];
          media_urls?: string[] | null;
          scheduled_at: string;
          status?: "pending" | "posted" | "failed" | "approved";
          approved?: boolean;
          generation_id?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          content?: string;
          platforms?: string[];
          media_urls?: string[] | null;
          scheduled_at?: string;
          status?: "pending" | "posted" | "failed" | "approved";
          approved?: boolean;
          generation_id?: string | null;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          stripe_subscription_id: string;
          plan: string;
          status: string;
          current_period_start: string;
          current_period_end: string;
          cancel_at_period_end: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          stripe_subscription_id: string;
          plan: string;
          status: string;
          current_period_start: string;
          current_period_end: string;
          cancel_at_period_end?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          stripe_subscription_id?: string;
          plan?: string;
          status?: string;
          current_period_start?: string;
          current_period_end?: string;
          cancel_at_period_end?: boolean;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string;
          action: string;
          resource_type: string | null;
          resource_id: string | null;
          metadata: Json;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          action: string;
          resource_type?: string | null;
          resource_id?: string | null;
          metadata?: Json;
          ip_address?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          action?: string;
          resource_type?: string | null;
          resource_id?: string | null;
          metadata?: Json;
          ip_address?: string | null;
          created_at?: string;
        };
      };
      community_announcements: {
        Row: {
          id: string;
          title: string;
          content: string;
          type: "announcement" | "changelog" | "feature";
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          type: "announcement" | "changelog" | "feature";
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          type?: "announcement" | "changelog" | "feature";
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

// Generic table helper
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T];

// Row, Insert, Update helpers
export type Row<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type Insert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type UpdateRow<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

// Named convenience types
export type UserRow = Row<"users">;
export type UserInsert = Insert<"users">;
export type UserUpdate = UpdateRow<"users">;

export type CreditTransactionRow = Row<"credit_transactions">;
export type CreditTransactionInsert = Insert<"credit_transactions">;
export type CreditTransactionUpdate = UpdateRow<"credit_transactions">;

export type AgentRow = Row<"agents">;
export type AgentInsert = Insert<"agents">;
export type AgentUpdate = UpdateRow<"agents">;

export type AgentRunRow = Row<"agent_runs">;
export type AgentRunInsert = Insert<"agent_runs">;
export type AgentRunUpdate = UpdateRow<"agent_runs">;

export type GenerationRow = Row<"generations">;
export type GenerationInsert = Insert<"generations">;
export type GenerationUpdate = UpdateRow<"generations">;

export type LibraryItemRow = Row<"library_items">;
export type LibraryItemInsert = Insert<"library_items">;
export type LibraryItemUpdate = UpdateRow<"library_items">;

export type SocialAccountRow = Row<"social_accounts">;
export type SocialAccountInsert = Insert<"social_accounts">;
export type SocialAccountUpdate = UpdateRow<"social_accounts">;

export type ScheduledPostRow = Row<"scheduled_posts">;
export type ScheduledPostInsert = Insert<"scheduled_posts">;
export type ScheduledPostUpdate = UpdateRow<"scheduled_posts">;

export type SubscriptionRow = Row<"subscriptions">;
export type SubscriptionInsert = Insert<"subscriptions">;
export type SubscriptionUpdate = UpdateRow<"subscriptions">;

export type AuditLogRow = Row<"audit_logs">;
export type AuditLogInsert = Insert<"audit_logs">;
export type AuditLogUpdate = UpdateRow<"audit_logs">;

export type CommunityAnnouncementRow = Row<"community_announcements">;
export type CommunityAnnouncementInsert = Insert<"community_announcements">;
export type CommunityAnnouncementUpdate = UpdateRow<"community_announcements">;
