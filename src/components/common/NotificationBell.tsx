import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import notification from "../../../public/assets/notificationIcon.svg";
import { getToken, onMessage } from "firebase/messaging";
import { getFirebaseMessaging } from "@/lib/firebaseClient";
import alarm from "../../../public/assets/alarm.png";
import { format, isToday, isYesterday, parseISO } from "date-fns";

type Notification = {
  title: string;
  body: string;
  read: boolean;
  timestamp: string;
};

const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem("notifications");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [popupOpen, setPopupOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const timeAgo = (dateString: string) => {
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
  };

  const addNotification = (newNotification: Notification) => {
    setNotifications((prev) => {
      const exists = prev.some(
        (n) =>
          n.title === newNotification.title &&
          n.body === newNotification.body &&
          !n.read
      );
      if (exists) return prev;

      const updated = [newNotification, ...prev];
      localStorage.setItem("notifications", JSON.stringify(updated));
      const audio = new Audio("/notification.mp3");
      audio.play();
      return updated;
    });
  };

  const groupNotificationsByDate = (notifications: Notification[]) => {
    const groups: { [key: string]: Notification[] } = {};

    notifications.forEach((notif) => {
      const date = parseISO(notif.timestamp);
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
  };

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    async function setupFCM() {
      const messaging = await getFirebaseMessaging();
      if (!messaging) return;

      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          const token = await getToken(messaging, {
            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
          });
          console.log("FCM Token:", token);
        }

        unsubscribe = onMessage(messaging, (payload) => {
          const { title = "No title", body = "No body" } =
            payload.notification || {};
          const newNotification: Notification = {
            title,
            body,
            read: false,
            timestamp: new Date().toISOString(),
          };

          addNotification(newNotification);
        });
      } catch (error) {
        console.error("FCM error:", error);
      }
    }

    setupFCM();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

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

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handler = (event: MessageEvent) => {
      if (event.data?.type === "PUSH_NOTIFICATION") {
        const payload = event.data.payload;
        const { title = "No title", body = "No body" } =
          payload.notification || {};
        const newNotification: Notification = {
          title,
          body,
          read: false,
          timestamp: new Date().toISOString(),
        };

        addNotification(newNotification);
      }
    };

    navigator.serviceWorker?.addEventListener("message", handler);
    return () => {
      navigator.serviceWorker?.removeEventListener("message", handler);
    };
  }, []);

  const togglePopup = () => {
    if (!popupOpen) {
      setPopupOpen(true);
    } else {
      setPopupOpen(false);
    }
  };

  const clearNotifications = () => {
    localStorage.removeItem("notifications");
    setNotifications([]);
    setPopupOpen(false);
  };

  const markAsRead = (index: number) => {
    setNotifications((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      localStorage.setItem("notifications", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="relative mt-1" ref={containerRef}>
      <button
        onClick={togglePopup}
        className="relative p-1 bg-white rounded-full border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 overflow-visible transition"
        aria-label="Toggle notifications"
      >
        <Image src={notification} alt="notification" height={33} width={33} />
        {unreadCount > 0 && (
          <span
            className="
              absolute top-0 right-0
              flex items-center justify-center
              h-5 w-5
              text-xs font-bold leading-none text-white
              bg-red-600 rounded-full
              select-none
              z-10
              animate-pulse
              transform translate-x-1/2 -translate-y-1/2
            "
          >
            {unreadCount}
          </span>
        )}
      </button>

      {popupOpen && (
        <div
          className="absolute right-0 mt-2 w-100 bg-white shadow-lg rounded-md border z-50 max-h-72"
          role="region"
          aria-label="Notifications"
        >
          <div className="flex justify-between items-center p-3 border-b">
            <h3 className="font-bold text-lg">Notifications</h3>
            {notifications.filter((item) => !item.read).length > 0 && (
              <button
                onClick={clearNotifications}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold transition focus:outline-none focus:ring-2 focus:ring-red-400 rounded"
                aria-label="Clear all notifications"
                title="Clear all notifications"
              >
                Mark all as read
              </button>
            )}
          </div>

          {notifications.filter((item) => !item.read).length === 0 ? (
            <div className="p-4 text-center text-md text-gray-500 select-none font-[700]">
              <Image
                className="m-auto mb-3"
                src={alarm}
                height={70}
                width={50}
                alt="alarm"
              ></Image>
              No notifications yet
            </div>
          ) : (
            <div
              className="max-w-md mx-auto divide-y divide-gray-200 bg-white rounded-md shadow-lg max-h-96 overflow-y-auto"
              role="region"
              aria-label="Notifications"
            >
              {Object.entries(
                groupNotificationsByDate(
                  notifications.filter((item) => !item.read)
                )
              ).map(([label, notifs], groupIndex) => (
                <div key={groupIndex}>
                  <div className="bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-600">
                    {label}
                  </div>
                  {notifs.map(({ title, body, read, timestamp }, index) => (
                    <div
                      key={`${groupIndex}-${index}`}
                      className="flex items-start space-x-3 p-4 transition-colors duration-200 hover:bg-indigo-50"
                      role="button"
                      tabIndex={0}
                      aria-pressed={read}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                        }
                      }}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <h3 className="text-md font-semibold text-slate-900 truncate">
                            {title}
                          </h3>
                          <time className="text-xs text-slate-400 ml-2 whitespace-nowrap">
                            {timeAgo(timestamp)}
                          </time>
                        </div>
                        <p className="text-sm text-slate-700 line-clamp-2">
                          {body}
                        </p>
                        {!read && (
                          <button
                            onClick={() => markAsRead(index)}
                            className="mt-2 text-xs text-indigo-600 hover:underline focus:outline-none"
                          >
                            ✓ Mark as Read
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
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
