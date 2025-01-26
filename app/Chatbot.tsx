"use client";

import { Globe, X } from "lucide-react";
import FrequentlyAskedQuestions from "./FrequentlyAskedQuestions";
import { frequentlyAskedQuestions, translations } from "@/data";
import { useEffect, useState } from "react";
import Message from "./Message";

interface ChatInterfaceProps {
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  isError: boolean;
}

export default function Chatbot({ onClose }: ChatInterfaceProps) {
  const [language, setLanguage] = useState<"en" | "fr">("fr");
  const [message, setMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [feedbackGiven, setFeedbackGiven] = useState<Set<string>>(new Set());

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "fr" : "en");
  };

  useEffect(() => {
    setLanguage("fr");
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!message.trim()) return;

    const userMessage = {
      content: message,
      isUser: true,
      isError: false,
      id: Date.now().toString(),
    };
    setChatHistory([...chatHistory, userMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });
      if (!response.ok) {
        throw new Error("Failed to get response from the server");
      }
      const data = await response.json();
      const botMessage = {
        content: data.message,
        isUser: false,
        isError: false,
        id: Date.now().toString(),
      };
      setChatHistory([...chatHistory, botMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage = {
        content:
          language === "en"
            ? "Sorry, I couldn't process your request"
            : "Désolé, je n'ai pas pu traiter votre demande",
        isUser: false,
        isError: true,
        id: Date.now().toString(),
      };
      setChatHistory([...chatHistory, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = async (messageId: string, helpful: boolean) => {
    try {
      const message = chatHistory.find((msg) => msg.id === messageId);
      if (!message) return;

      const response = await fetch("http://localhost:3001/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: message.content, helpful }),
      });
      if (!response.ok) {
        throw new Error("Failed to send feedback");
      }
      setFeedbackGiven((prev) => new Set([...prev, messageId]));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md w-96 h-[32rem] flex flex-col">
      <div className="bg-[#171c5c] text-white p-4 flex justify-between items-center rounded-t-lg">
        <h2 className="text-xl font-semibold">CarthageBot</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleLanguage}
            className="text-white hover:text-gray-200"
            aria-label={
              language === "en" ? "Switch to French" : "Passer à l'anglais"
            }
          >
            <Globe size={24} />
          </button>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200"
            aria-label={language === "en" ? "Close chat" : "Fermer le chat"}
          >
            <X size={24} />
          </button>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        <FrequentlyAskedQuestions
          faqs={frequentlyAskedQuestions}
          language={language}
        />

        {chatHistory.map((msg, index) => (
          <Message
            key={index}
            content={msg.content}
            isUser={msg.isUser}
            isError={msg.isError}
            showFeedback={
              !msg.isUser && !msg.isError && !feedbackGiven.has(msg.id)
            }
            onFeedback={(helpful) => handleFeedback(msg.id, helpful)}
            language={language}
          />
        ))}
        {isLoading && <p className="text-center">Loading...</p>}
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            className="flex-1 p-2 border rounded-md"
            placeholder={translations[language].placeholder}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-[#171c5c] text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            disabled={isLoading}
          >
            {translations[language].send}
          </button>
        </div>
      </form>
    </div>
  );
}
