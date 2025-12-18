import { createClient } from "@/shared/api/supabase/client";
import type {
  DayRating,
  CreateRatingInput,
  UpdateRatingInput,
} from "../model/types";

export const ratingsApi = {
  async getAll(): Promise<DayRating[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("day_ratings")
      .select("*")
      .order("date", { ascending: false });

    if (error) throw error;
    return (data as DayRating[]) || [];
  },

  async getByDate(date: string): Promise<DayRating | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("day_ratings")
      .select("*")
      .eq("date", date)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data as DayRating | null;
  },

  async getForMonth(year: number, month: number): Promise<DayRating[]> {
    const supabase = createClient();
    const startDate = `${year}-${String(month + 1).padStart(2, "0")}-01`;
    const lastDay = new Date(year, month + 1, 0).getDate();
    const endDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

    const { data, error } = await supabase
      .from("day_ratings")
      .select("*")
      .gte("date", startDate)
      .lte("date", endDate)
      .order("date", { ascending: false });

    if (error) throw error;
    return (data as DayRating[]) || [];
  },

  async create(input: CreateRatingInput): Promise<DayRating> {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("day_ratings")
      .upsert(
        {
          user_id: user.id,
          date: input.date,
          score: input.score,
          title: input.title,
          comment: input.comment || null,
        },
        { onConflict: "user_id,date" }
      )
      .select()
      .single();

    if (error) throw error;
    return data as DayRating;
  },

  async update(id: string, input: UpdateRatingInput): Promise<DayRating> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("day_ratings")
      .update(input)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as DayRating;
  },

  async delete(id: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.from("day_ratings").delete().eq("id", id);

    if (error) throw error;
  },

  async deleteAll(): Promise<void> {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase
      .from("day_ratings")
      .delete()
      .eq("user_id", user.id);

    if (error) throw error;
  },
};
