"use client";

import { Question } from "@/types/survey";

interface QuestionCardProps {
  question: Question;
  selected: string;
  onSelect: (value: string) => void;
}

export function QuestionCard({
  question,
  selected,
  onSelect,
}: QuestionCardProps) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-slate-900 mb-5">
        {question.question}
      </h3>
      <div className="space-y-3">
        {question.options.map((option) => (
          <label
            key={option}
            className="flex items-start p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-violet-400 hover:bg-violet-50 transition-all duration-200 group"
          >
            <div className="flex items-center h-5 mt-0.5">
              <input
                type="radio"
                name={question.id}
                value={option}
                checked={selected === option}
                onChange={(e) => onSelect(e.target.value)}
                className="w-5 h-5 text-violet-600 cursor-pointer accent-violet-600"
              />
            </div>
            <span className="ml-4 text-slate-700 group-hover:text-slate-900 font-medium">
              {option}
            </span>
            {selected === option && (
              <div className="ml-auto">
                <div className="w-5 h-5 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            )}
          </label>
        ))}
      </div>
    </div>
  );
}
