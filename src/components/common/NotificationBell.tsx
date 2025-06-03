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
  readNotification,
  registerFCMToken,
} from "@/utils/services/notification";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/utils/constant";

const NotificationBell: React.FC = () => {
  const router = useRouter();
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
    fetchNotifications();
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

  const handleMarkAsRead = async (event: any, id: string) => {
    event.stopPropagation();
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

  const handleClickOnNotification = async (id: string, data: any) => {
    if (data.type) {
      const res = await readNotification(id);
      if (res.status) {
        togglePopup();
        if (data.type === "ticket") {
          router.push(ROUTES.USER_MY_EVENTS);
        } else if (data.type === "profile") {
          router.push(ROUTES.USER_PROFILE);
        } else if (data.type === "reward") {
          router.push(ROUTES.USER_REWARDED_HISTORY);
        } else if (data.type === "feedback") {
          router.push(ROUTES.USER_REVIEW_HISTORY);
        }
      }
      fetchNotifications();
    }
  };

  return (
    <div className="relative mt-1" ref={containerRef}>
      <button
        onClick={togglePopup}
        className="relative p-2 bg-white rounded-full border border-gray-300 hover:bg-gray-100 shadow-sm transition-all duration-200 transform hover:scale-105"
        aria-label="Toggle notifications"
      >
        <Image src={notification} alt="notification" height={28} width={28} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-600 text-white text-xs font-bold flex items-center justify-center rounded-full ring-2 ring-white">
            {unreadCount}
          </span>
        )}
      </button>

      {popupOpen && (
        <div
          className="absolute right-0 mt-3 w-[420px] bg-white border border-gray-200 rounded-2xl shadow-xl z-50 max-h-[500px] overflow-hidden animate-fade-in"
          role="region"
          aria-label="Notifications"
        >
          <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-indigo-50 to-purple-50">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <span className="bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                {unreadCount}
              </span>
              Notifications
            </h3>
            {notifications.length > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="cursor-pointer text-sm text-indigo-600 hover:text-indigo-800 font-medium transition flex items-center gap-1 group"
                aria-label="Clear all notifications"
              >
                <span className="group-hover:scale-110 transition-transform">
                  ✓
                </span>
                Mark all as read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="p-8 text-center flex flex-col items-center">
              <div className="bg-indigo-100 rounded-full p-4 w-fit mb-4">
                <Image
                  src={alarm}
                  height={60}
                  width={60}
                  alt="No notifications"
                  className="opacity-80"
                />
              </div>
              <h4 className="font-medium text-gray-700 mb-1">
                No notifications yet
              </h4>
              <p className="text-gray-500 text-sm max-w-xs">
                We'll notify you when something new arrives
              </p>
            </div>
          ) : (
            <div className="max-h-[420px] overflow-y-auto">
              {Object.entries(groupNotificationsByDate(notifications)).map(
                ([label, notifs], groupIndex) => (
                  <div key={groupIndex}>
                    <div className="px-4 py-2.5 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                      {label}
                    </div>
                    {notifs.map(
                      (
                        { _id, title, body, isRead, createdAt, data },
                        index
                      ) => (
                        <div
                          key={`${groupIndex}-${index}`}
                          className={`px-4 py-3 hover:bg-indigo-50 cursor-pointer transition-all duration-150 border-b border-gray-100 last:border-0 ${
                            !isRead ? "bg-indigo-50/50" : ""
                          }`}
                          onClick={() => handleClickOnNotification(_id, data)}
                        >
                          <div className="flex gap-3">
                            <div className="flex flex-col items-center">
                              {!isRead && (
                                <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0"></div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                <h4 className="text-sm font-semibold text-gray-800">
                                  {title}
                                </h4>
                                <div className="flex items-center gap-2">
                                  <time className="text-xs text-gray-400 whitespace-nowrap">
                                    {timeAgo(createdAt)}
                                  </time>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mt-1.5 line-clamp-2">
                                {body}
                              </p>
                              <button
                                  onClick={(event) => handleMarkAsRead(event, _id)}
                                  className="cursor-pointer mt-2 text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-opacity opacity-70 hover:opacity-100"
                                  aria-label="Mark as read"
                                >
                                  <span className="text-sm">
                                    Mark as read ✓
                                  </span>
                                </button>
                            </div>
                          </div>
                        </div>
                      )
                    )}
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
