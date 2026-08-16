
import { useEffect, useState } from "react";
import { subscribeNotifications } from "../services/notificationService";

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeNotifications((data) => {
      setNotifications(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;
  return { notifications, unreadCount, loading };
}