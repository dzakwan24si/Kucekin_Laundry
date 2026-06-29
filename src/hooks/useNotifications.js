import { useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import { notificationAPI } from "../services/notificationAPI";

export function useNotifications(userId, role) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!role || (role === "member" && !userId)) return;

    // 1. Fetch initial notifications
    const fetchNotifications = async () => {
      try {
        const data = await notificationAPI.getNotifications(userId, role);
        setNotifications(data);
        setUnreadCount(data.filter((n) => !n.is_read).length);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();

    // 2. Subscribe to real-time insert events on 'notifications' table
    const channel = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        (payload) => {
          const newNotif = payload.new;

          // Filter logikanya sama seperti fetch:
          // Admin menerima 'admin'
          // Member menerima broadcast ATAU yg user_id-nya sama
          if (role === "admin" && newNotif.recipient_type === "admin") {
            setNotifications((prev) => [newNotif, ...prev]);
            setUnreadCount((prev) => prev + 1);
          } else if (
            role === "member" &&
            (newNotif.recipient_type === "broadcast" || newNotif.user_id === userId)
          ) {
            setNotifications((prev) => [newNotif, ...prev]);
            setUnreadCount((prev) => prev + 1);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, role]);

  const markAsRead = async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };
  
  const markAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead(userId, role);
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  return { notifications, unreadCount, markAsRead, markAllAsRead };
}
