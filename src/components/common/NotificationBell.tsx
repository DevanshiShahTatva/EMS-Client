import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import notification from "../../../public/assets/notificationIcon.svg";
import { getToken, onMessage } from "firebase/messaging";
import { getFirebaseMessaging } from "@/lib/firebaseClient";
import alarm from "../../../public/assets/alarm.png";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import {
  getNotifications,
  markAllAsRead,
  markAsRead,
  NotificationResp,
  registerFCMToken,
} from "@/utils/services/notification";

const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationResp[]>([]);
  const [loading, setLoading] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const fcmTokenRegistered = useRef(false); // Track FCM registration
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const fetchNotifications = useCallback(async () => {
      setLoading(true);
      try {
        const data = await getNotifications();
        setNotifications(data);
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      } finally {
        setLoading(false);
      }
  }, []);

  const timeAgo = useCallback((dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return "Just now";
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }, []);

  const addNotification = useCallback((newNotification: NotificationResp) => {
    setNotifications((prev) => {
      // Prevent duplicates using ID or title+body
      const exists = prev.some(
        (n) =>
          n._id === newNotification._id ||
          (n.title === newNotification.title && n.body === newNotification.body)
      );
      return exists ? prev : [newNotification, ...prev];
    });
  }, []);

  const groupNotificationsByDate = useCallback(
    (notifications: NotificationResp[]) => {
      const groups: { [key: string]: NotificationResp[] } = {};

      notifications.forEach((notif) => {
        const date = parseISO(notif.createdAt);
        let label;
        if (isToday(date)) {
          label = "Today";
        } else if (isYesterday(date)) {
          label = "Yesterday";
        } else {
          label = format(date, "MMMM d, yyyy");
        }
        if (!groups[label]) {
          groups[label] = [];
        }
        groups[label].push(notif);
      });

      return groups;
    },
    []
  );

  useEffect(() => {
    fetchNotifications()
    let unsubscribe: (() => void) | undefined;

    async function setupFCM() {
      const messaging = await getFirebaseMessaging();
      if (!messaging || fcmTokenRegistered.current) return;

      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          // Only register token once
          if (!localStorage.getItem("fcmToken")) {
            const token = await getToken(messaging, {
              vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
            });
            console.log("FCM Token:", token);
            localStorage.setItem("fcmToken", token);
            await registerFCMToken(token);
          }
          fcmTokenRegistered.current = true;
        }

        unsubscribe = onMessage(messaging, (payload: any) => {
          const data = payload.data || {};
          const title = payload.notification?.title || "No title";
          const body = payload.notification?.body || "No body";
          const _id = data._id || `temp-${Date.now()}`;

          playNotificationSound();

          addNotification({
            _id,
            title,
            body,
            isRead: false,
            data,
            createdAt: new Date().toISOString(),
          });
        });
      } catch (error) {
        console.error("FCM error:", error);
      }
    }

    setupFCM();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popupOpen &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setPopupOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popupOpen]);

  const playNotificationSound = () => {
    const audio = new Audio("/notification.mp3");
    audio.volume = 0.7; // optional
    audio.play().catch((e) => {
      console.error("Audio playback failed", e);
    });
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handler = (event: MessageEvent) => {
      if (event.data?.type === "PUSH_NOTIFICATION") {
        const payload = event.data.payload;
        const data = payload.data || {};
        const title = payload.notification?.title || "No title";
        const body = payload.notification?.body || "No body";
        const _id = data._id;

        playNotificationSound();

        addNotification({
          _id,
          title,
          body,
          isRead: false,
          data,
          createdAt: new Date().toISOString(),
        });
      }
    };

    navigator.serviceWorker?.addEventListener("message", handler);
    return () => {
      navigator.serviceWorker?.removeEventListener("message", handler);
    };
  }, [addNotification]);

  const togglePopup = useCallback(() => {
    setPopupOpen((prev) => !prev);
  }, []);

  return (
    <div className="relative mt-1" ref={containerRef}>
      <button
        onClick={togglePopup}
        className="relative p-2 bg-white rounded-full border border-gray-300 hover:bg-gray-100 shadow-sm transition"
        aria-label="Toggle notifications"
      >
        <Image src={notification} alt="notification" height={28} width={28} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-600 text-white text-xs font-bold flex items-center justify-center rounded-full ring-2 ring-white animate-ping-fast">
            {unreadCount}
          </span>
        )}
      </button>

      {popupOpen && (
        <div
          className="absolute right-0 mt-3 w-96 bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-xl z-50 max-h-[500px] overflow-hidden"
          role="region"
          aria-label="Notifications"
        >
          <div className="flex justify-between items-center p-4 border-b bg-white/70">
            <h3 className="text-lg font-semibold text-gray-800">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition"
                aria-label="Clear all notifications"
                title="Clear all notifications"
              >
                Mark all as read
              </button>
            )}
          </div>

          {unreadCount === 0 ? (
            <div className="p-6 text-center text-gray-500 font-medium">
              <Image
                className="mx-auto mb-4"
                src={alarm}
                height={70}
                width={50}
                alt="alarm"
              />
              No notifications yet
            </div>
          ) : (
            <div className="divide-y divide-gray-100 max-h-[420px] overflow-y-auto">
              {Object.entries(
                groupNotificationsByDate(
                  notifications.filter((item) => !item.isRead)
                )
              ).map(([label, notifs], groupIndex) => (
                <div key={groupIndex}>
                  <div className="px-4 py-2 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wide">
                    {label}
                  </div>
                  {notifs.map(
                    ({ _id, title, body, isRead, createdAt }, index) => (
                      <div
                        key={`${groupIndex}-${index}`}
                        className="px-4 py-3 hover:bg-indigo-50 cursor-pointer transition group"
                      >
                        <div className="flex justify-between items-center">
                          <h4 className="text-sm font-semibold text-gray-800 group-hover:text-indigo-700">
                            {title}
                          </h4>
                          <time className="text-xs text-gray-400 ml-2 shrink-0 whitespace-nowrap">
                            {timeAgo(createdAt)}
                          </time>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {body}
                        </p>
                        {!isRead && (
                          <button
                            onClick={() => handleMarkAsRead(_id)}
                            className="mt-2 text-xs text-indigo-600 hover:underline flex items-center gap-1"
                          >
                            ✓ Mark as Read
                          </button>
                        )}
                      </div>
                    )
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
