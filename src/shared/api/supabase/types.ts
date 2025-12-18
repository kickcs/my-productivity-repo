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
      day_ratings: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          score: number;
          title: string;
          comment: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          score: number;
          title?: string;
          comment?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          score?: number;
          title?: string;
          comment?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "day_ratings_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      push_subscriptions: {
        Row: {
          id: string;
          user_id: string;
          endpoint: string;
          p256dh: string;
          auth: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          endpoint: string;
          p256dh: string;
          auth: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          endpoint?: string;
          p256dh?: string;
          auth?: string;
          created_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type DayRatingRow = Database["public"]["Tables"]["day_ratings"]["Row"];
export type DayRatingInsert = Database["public"]["Tables"]["day_ratings"]["Insert"];
export type DayRatingUpdate = Database["public"]["Tables"]["day_ratings"]["Update"];
