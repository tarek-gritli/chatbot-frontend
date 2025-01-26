"use client";

import { useState } from "react";
import Image from "next/image";
import Chatbot from "./Chatbot";

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="flex items-end justify-end fixed bottom-0 right-0 mb-8 mr-8">
      {!isChatOpen ? (
        <button
          onClick={toggleChat}
          className="relative p-1 group"
          aria-label="Open chat"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute inset-0.5 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative rounded-full overflow-hidden">
            <Image
              src="/chatbot-dark.png"
              alt="Chat icon"
              width={80}
              height={80}
              className="rounded-full transition-transform duration-300 ease-in-out group-hover:scale-105"
            />
          </div>
        </button>
      ) : (
        <Chatbot onClose={toggleChat} />
      )}
    </div>
  );
}
