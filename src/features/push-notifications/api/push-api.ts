import { createClient } from "@/shared/api/supabase/client";

export interface PushSubscriptionData {
  endpoint: string;
  p256dh: string;
  auth: string;
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

export const pushApi = {
  async sendTestNotification(): Promise<{ success: boolean; sent: number }> {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) throw new Error("Not authenticated");

    const response = await fetch(`${SUPABASE_URL}/functions/v1/send-test-notification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to send test notification");
    }

    return response.json();
  },

  async saveSubscription(subscription: PushSubscriptionData): Promise<void> {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase.from("push_subscriptions").upsert(
      {
        user_id: user.id,
        endpoint: subscription.endpoint,
        p256dh: subscription.p256dh,
        auth: subscription.auth,
      },
      { onConflict: "user_id,endpoint" }
    );

    if (error) throw error;
  },

  async deleteSubscription(endpoint: string): Promise<void> {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase
      .from("push_subscriptions")
      .delete()
      .eq("user_id", user.id)
      .eq("endpoint", endpoint);

    if (error) throw error;
  },

  async hasSubscription(): Promise<boolean> {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return false;

    const { data, error } = await supabase
      .from("push_subscriptions")
      .select("id")
      .eq("user_id", user.id)
      .limit(1);

    if (error) return false;
    return data && data.length > 0;
  },

  async hasSubscriptionForEndpoint(endpoint: string): Promise<boolean> {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return false;

    const { data, error } = await supabase
      .from("push_subscriptions")
      .select("id")
      .eq("user_id", user.id)
      .eq("endpoint", endpoint)
      .limit(1);

    if (error) return false;
    return data && data.length > 0;
  },
};
