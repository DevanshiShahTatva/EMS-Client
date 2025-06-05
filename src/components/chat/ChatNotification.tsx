"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getSocket } from "@/utils/services/socket";
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
}

export default function ChatNotification() {
  const [notifications, setNotifications] = useState<MessageData[]>([]);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const socket = getSocket();

    socket.emit("initiate_chat_notification");
    
    socket.on("chat_notification", (data: MessageData) => {
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

  return (
    <div className="fixed bottom-4 right-4 space-y-3 z-50 max-w-sm w-full">
      <AnimatePresence>
        {notifications.map((notif) => (
          <motion.div
            key={notif._id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.25 }}
            onClick={() => router.push(`/user/chat?id=${notif.privateChat}`)}
            className="relative bg-white rounded-2xl shadow-lg border border-gray-200 p-4 pr-12 hover:shadow-xl transition-all duration-200"
          >
            <button
              onClick={() => handleDismiss(notif._id)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
              aria-label="Close notification"
            >
              <X size={16} />
            </button>

            <div className="flex items-start gap-3">
              <div className="min-w-10 min-h-10 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-500 overflow-hidden">
                {notif.sender.profileimage?.url ? (
                  <img
                    src={notif.sender.profileimage.url}
                    alt={notif.sender.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  notif.sender.name.charAt(0).toUpperCase()
                )}
              </div>

              <div className="flex flex-col max-w-[80%]">
                <span className="text-sm font-semibold text-gray-900 truncate">
                  {notif.sender.name}
                </span>
                <span className="text-sm text-gray-600 break-words">
                  {notif.content}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
