import { supabase } from "./supabase";

export const notificationAPI = {
  // Ambil notifikasi berdasarkan user (atau role)
  async getNotifications(userId, role) {
    let query = supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    if (role === "admin") {
      // Admin melihat notifikasi yang recipient_type-nya 'admin'
      query = query.eq("recipient_type", "admin");
    } else if (role === "member") {
      // Member melihat notifikasi miliknya ATAU broadcast
      query = query.or(`user_id.eq.${userId},recipient_type.eq.broadcast`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Tandai satu notifikasi sebagai terbaca
  async markAsRead(notificationId) {
    const { data, error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId)
      .select();

    if (error) throw error;
    return data;
  },
  
  // Tandai semua sebagai terbaca (Opsional)
  async markAllAsRead(userId, role) {
    let query = supabase.from("notifications").update({ is_read: true }).eq("is_read", false);
    
    if (role === "admin") {
      query = query.eq("recipient_type", "admin");
    } else if (role === "member") {
      query = query.or(`user_id.eq.${userId},recipient_type.eq.broadcast`);
    }
    
    const { data, error } = await query.select();
    if (error) throw error;
    return data;
  },

  // Kirim notifikasi baru
  async sendNotification({ user_id = null, recipient_type, title, message, type = "info" }) {
    const { data, error } = await supabase
      .from("notifications")
      .insert([
        {
          user_id,
          recipient_type,
          title,
          message,
          type
        }
      ])
      .select();

    if (error) throw error;
    return data;
  }
};
