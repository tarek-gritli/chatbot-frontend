"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FrequentlyAskedQuestionsProps {
  faqs: FAQ[];
  language: "en" | "fr"; // Add language prop to handle multilingual content
}

export default function FrequentlyAskedQuestions({
  faqs,
  language,
}: FrequentlyAskedQuestionsProps) {
  const [openQuestions, setOpenQuestions] = useState<number[]>([]);

  const toggleQuestion = (id: number) => {
    setOpenQuestions((prev) =>
      prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id]
    );
  };

  // Group FAQs by category
  const groupedFaqs = faqs.reduce((acc, faq) => {
    const category = faq.category[language]; // Use language-specific category
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(faq);
    return acc;
  }, {} as Record<string, FAQ[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedFaqs).map(([category, categoryFaqs]) => (
        <div key={category} className="space-y-2">
          <h3 className="font-semibold text-lg">{category}</h3>
          {categoryFaqs.map((faq) => (
            <div key={faq.id} className="border rounded-md">
              <button
                onClick={() => toggleQuestion(faq.id)}
                className="flex justify-between items-center w-full p-3 text-left hover:bg-gray-50 transition-colors"
                aria-expanded={openQuestions.includes(faq.id)}
                aria-controls={`faq-answer-${faq.id}`}
              >
                <span>{faq.question[language]}</span>
                {openQuestions.includes(faq.id) ? (
                  <ChevronUp className="flex-shrink-0" />
                ) : (
                  <ChevronDown className="flex-shrink-0" />
                )}
              </button>
              {openQuestions.includes(faq.id) && (
                <div
                  id={`faq-answer-${faq.id}`}
                  className="p-3 bg-gray-50"
                  aria-hidden={!openQuestions.includes(faq.id)}
                >
                  {faq.answer[language]}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
