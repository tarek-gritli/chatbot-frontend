import type React from "react";
import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface MessageProps {
  content: string;
  isUser: boolean;
  isError: boolean;
  showFeedback?: boolean;
  onFeedback?: (feedback: boolean) => void;
  language: "en" | "fr";
}

const Message: React.FC<MessageProps> = ({
  content,
  isUser,
  isError,
  showFeedback = false,
  onFeedback,
  language,
}) => {
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  const handleFeedback = (helpful: boolean) => {
    if (onFeedback && !feedbackGiven) {
      onFeedback(helpful);
      setFeedbackGiven(true);
    }
  };
  const feedbackText =
    language === "en" ? "Was this helpful?" : "Était-ce utile ?";
  const thankYouText =
    language === "en"
      ? "Thank you for your feedback!"
      : "Merci pour votre retour !";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-3/4 p-3 rounded-lg ${
          isUser
            ? "bg-[#171c5c] text-white"
            : isError
            ? "bg-red-100 text-red-700"
            : "bg-gray-200"
        }`}
      >
        <p>{content}</p>
        {showFeedback && !feedbackGiven && (
          <div className="mt-2">
            <p className="text-sm text-gray-600 mb-1">{feedbackText}</p>
            <div className="flex space-x-2">
              <button
                onClick={() => handleFeedback(true)}
                className="text-green-500 hover:text-green-600"
                aria-label={language === "en" ? "Yes, helpful" : "Oui, utile"}
              >
                <ThumbsUp size={16} />
              </button>
              <button
                onClick={() => handleFeedback(false)}
                className="text-red-500 hover:text-red-600"
                aria-label={
                  language === "en" ? "No, not helpful" : "Non, pas utile"
                }
              >
                <ThumbsDown size={16} />
              </button>
            </div>
          </div>
        )}
        {feedbackGiven && (
          <p className="mt-2 text-sm text-gray-500">{thankYouText}</p>
        )}
      </div>
    </div>
  );
};

export default Message;
