"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { connectSocket, getSocket } from "@/utils/services/socket";
import { X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface MessageData {
  sender: {
    _id: string;
    name: string;
    profileimage: {
      url: string;
    };
  };
  privateChat: string;
  content: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  group?: {
    _id: string;
    event: {
      title: string;
      images: Array<{ url: string }>;
    };
  };
}

export default function ChatNotification() {
  const [notifications, setNotifications] = useState<MessageData[]>([]);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    connectSocket();
    const socket = getSocket();

    socket.emit("initiate_chat_notification");

    socket.on("chat_notification", (data: any) => {
      console.log("DATA::", data);
      if (pathname.startsWith("/user/chat")) return;

      setNotifications((prev) => [...prev, data]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n._id !== data._id));
      }, 5000);
    });

    return () => {
      socket.off("chat_notification");
    };
  }, [pathname]);

  const handleDismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n._id !== id));
  };

  const handleNavigateToPage = (notif: MessageData) => {
    if (notif.group) {
      router.push(`/user/chat?group=${notif.group._id}`);
    } else {
      router.push(`/user/chat?id=${notif.privateChat}`);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 space-y-3 z-50 max-w-sm w-full">
      <AnimatePresence>
        {notifications.map((notif) => {
          const isGroup = !!notif.group;
          const avatarUrl = isGroup
            ? notif.group?.event.images?.[0]?.url
            : notif.sender.profileimage?.url;

          const title = isGroup ? notif.group?.event.title : notif.sender.name;

          return (
            <motion.div
              key={notif._id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.25 }}
              onClick={() => handleNavigateToPage(notif)}
              className="relative bg-white rounded-2xl shadow-lg border border-gray-200 p-4 pr-12 hover:shadow-xl transition-all duration-200 cursor-pointer"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDismiss(notif._id);
                }}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
                aria-label="Close notification"
              >
                <X size={16} />
              </button>

              <div className="flex items-start gap-3">
                <div className="min-w-10 min-h-10 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-500 overflow-hidden">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={title || "avatar"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    title?.charAt(0).toUpperCase()
                  )}
                </div>

                <div className="flex flex-col max-w-[80%]">
                  <span className="text-sm font-semibold text-gray-900 truncate">
                    {title}
                  </span>
                  {!title && (
                    <span className="text-xs text-gray-500">
                      {notif.sender.name}
                    </span>
                  )}
                  <span className="text-sm text-gray-600 break-words">
                    {notif.content}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
