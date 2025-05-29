import React, { useEffect, useRef, useState } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { getFirebaseMessaging } from "../../lib/firebaseClient";
import notification from "../../../public/assets/notificationIcon.svg";
import Image from "next/image";

type Notification = {
  title: string;
  body: string;
  read: boolean;
  timestamp: string;
};

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

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

  useEffect(() => {
    async function setupFCM() {
      const messaging = await getFirebaseMessaging();
      if (!messaging) return;

      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          const token = await getToken(messaging, { vapidKey: VAPID_KEY });
          console.log("FCM Token:", token);
        }

        onMessage(messaging, (payload) => {
          const { title = "No title", body = "No body" } =
            payload.notification || {};
          const newNotification = {
            title,
            body,
            read: false,
            timestamp: "just now",
          };

          const existing = JSON.parse(
            localStorage.getItem("notifications") || "[]"
          );
          const updated = [newNotification, ...existing];
          localStorage.setItem("notifications", JSON.stringify(updated));
          setNotifications(updated);
        });
      } catch (error) {
        console.error("FCM error:", error);
      }
    }

    setupFCM();
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

    navigator.serviceWorker?.addEventListener("message", (event) => {
      if (event.data?.type === "PUSH_NOTIFICATION") {
        const payload = event.data.payload;
        const { title = "No title", body = "No body" } =
          payload.notification || {};
        const newNotification = {
          title,
          body,
          read: false,
          timestamp: "just now",
        };
        const existing = JSON.parse(
          localStorage.getItem("notifications") || "[]"
        );
        const updated = [newNotification, ...existing];
        localStorage.setItem("notifications", JSON.stringify(updated));
        setNotifications(updated);
      }
    });
  }, []);

  useEffect(() => {}, []);

  const togglePopup = () => {
    if (!popupOpen) {
      setNotifications((prev) => prev.map((n) => ({ ...n })));
    }
    setPopupOpen(!popupOpen);
  };

  const clearNotifications = () => {
    localStorage.removeItem("notifications");
    setNotifications([]);
    setPopupOpen(false);
  };

  const markAsRead = (index: number) => {
    setNotifications((prev) => {
      const updated = [...prev];
      updated[index].read = true;
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
          className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-md border z-50 max-h-72 "
          role="region"
          aria-label="Notifications"
        >
          <div className="flex justify-between items-center p-3 border-b">
            <h3 className="font-bold text-lg">Notifications</h3>
            <button
              onClick={clearNotifications}
              className="text-sm text-red-600 hover:text-red-800 font-semibold transition focus:outline-none focus:ring-2 focus:ring-red-400 rounded"
              aria-label="Clear all notifications"
              title="Clear all notifications"
            >
              Clear All
            </button>
          </div>

          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500 select-none">
              No notifications yet
            </div>
          ) : (
            <div
              className="max-w-md mx-auto divide-y divide-gray-200 bg-white rounded-md shadow-lg max-h-96 overflow-y-auto"
              role="region"
              aria-label="Notifications"
            >
              {notifications.map(
                ({ title, body, read, timestamp }: Notification, index) => (
                  <div
                    key={index}
                    className={`
                    flex items-start space-x-3 p-4 transition-colors duration-200
                    ${
                      !read
                        ? "bg-slate-100 hover:bg-slate-200"
                        : "hover:bg-gray-50"
                    }
                    focus:outline-none focus:ring-2 focus:ring-slate-500
                  `}
                    role="button"
                    tabIndex={0}
                    aria-pressed={read}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                      }
                    }}
                  >
                    {!read && (
                      <span className="flex-shrink-0 mt-1 h-2.5 w-2.5 rounded-full bg-slate-600 animate-pulse"></span>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="text-sm font-semibold text-slate-900 truncate">
                          {title}
                        </h3>
                        <time className="text-xs text-slate-400 ml-2 whitespace-nowrap">
                          {timestamp}
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
                          Mark as Read
                        </button>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
