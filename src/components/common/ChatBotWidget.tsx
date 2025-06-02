"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, X, Send } from "lucide-react";
import { API_ROUTES } from "@/utils/constant";
import { apiCall } from "@/utils/services/request";
import { getUserRole } from "@/utils/helper";

interface Message {
  sender: "user" | "bot";
  text: string;
  time: string;
}

const ChatBotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [botTyping, setBotTyping] = useState(false);
  const [showChatBot, setShowChatBot] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Load initial messages if needed
    const initialMessages: Message[] = [
      {
        sender: "bot",
        text: "Hello! How can I assist you today?",
        time: new Date().toLocaleTimeString(),
      },
    ];
    setMessages(initialMessages);
    setShowChatBot(getUserRole() !== "admin");
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      sender: "user",
      text: input,
      time: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate bot typing
    setBotTyping(true);

    try {
      const response = await apiCall({
        endPoint: API_ROUTES.CHATBOT.CHAT,
        method: "POST",
        body: { message: input },
      });

      const botMessage: Message = {
        sender: "bot",
        text: response.reply,
        time: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setBotTyping(false);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        sender: "bot",
        text: "Sorry, I couldn't process your request. Please try again later.",
        time: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setBotTyping(false);
    }
  };

  return showChatBot ? (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Icon Button */}
      <button
        className={`bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 ${
          isOpen ? "hidden" : ""
        }`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open chat"
      >
        <Bot className="w-6 h-6" />
      </button>

      {/* Chat Popup */}
      {isOpen && (
        <div className="w-80 h-96 bg-white shadow-2xl rounded-xl flex flex-col overflow-hidden mt-2">
          {/* Header */}
          <div className="bg-blue-500 text-white px-4 py-2 font-semibold flex justify-between items-center">
            <span>AI Assistant</span>
            <button onClick={() => setIsOpen(false)} aria-label="Close">
              <X className="w-5 h-5 stroke-[3]" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`text-sm flex flex-wrap gap-1 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <span
                  className={`px-3 py-2 rounded-xl max-w-[80%] ${
                    msg.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: msg.text,
                    }}
                  />
                </span>
                <span
                  className={`text-xs text-gray-500 ml-2 w-full ${
                    msg.sender === "user" ? "text-right" : "text-left"
                  }`}
                >
                  {msg.time}
                </span>
              </div>
            ))}
            {botTyping && (
              <div className="flex flex-wrap justify-start gap-1">
                <div className="flex items-center gap-1.5 bg-gray-200 text-black px-3 py-1 rounded-xl max-w-[80%] text-lg font-medium">
                  <span className="dot animate-bounce [animation-delay:0s]">
                    .
                  </span>
                  <span className="dot animate-bounce [animation-delay:0.2s]">
                    .
                  </span>
                  <span className="dot animate-bounce [animation-delay:0.4s]">
                    .
                  </span>
                </div>
                <span className="text-xs text-gray-500 w-full text-left">
                  typing...
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t px-3 py-2 flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 border rounded-full px-3 py-1 text-sm"
              placeholder="Type a message..."
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 disabled:bg-gray-300 text-white disabled:text-black p-2 rounded-full text-sm"
              disabled={!input.trim()}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  ) : (
    <></>
  );
};

export default ChatBotWidget;
