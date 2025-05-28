'use client';

import { questions } from '@/constants';
import { useEffect, useState } from 'react';

export default function QuestionBox({ currentSlide }: { currentSlide: number }) {
  const question = questions[currentSlide];

  const [answersArray, setAnswersArray] = useState<number[]>(
    Array(questions.length).fill(-1)
  );

  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    if(currentSlide !== questions.length) {
      const savedAnswer = answersArray[currentSlide];
      setSelected(savedAnswer !== -1 ? savedAnswer : null);
      setAnswered(savedAnswer !== -1);
      setIsCorrect(
        savedAnswer !== -1 ? savedAnswer === question.correctIndex : null
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlide]);

  const handleAnswer = () => {
    if (selected === null || answered) return;

    const updated = [...answersArray];
    updated[currentSlide] = selected;
    setAnswersArray(updated);
    setAnswered(true);
    setIsCorrect(selected === question.correctIndex);
  };

  if (currentSlide === questions.length) {
    const totalCorrect = answersArray.filter((a, i) => a === questions[i].correctIndex).length;
    const unansweredIndexes = answersArray
      .map((a, i) => (a === -1 ? i + 1 : null))
      .filter((n) => n !== null);
    const percentage = Math.round((totalCorrect / questions.length) * 100);

    return (
      <div className="flex flex-col h-76 items-center justify-center bg-white p-6 rounded-b-xl text-center gap-4 shadow-lg">
        {unansweredIndexes.length > 0 ? (
          <>
            <p className="text-xl text-red-600 font-semibold">⚠️ You haven&apos;t answered all the questions!</p>
            <p className="text-sm text-gray-700">
              Please go back and answer the following questions:{" "}
              <strong>{unansweredIndexes.join(", ")}</strong>
            </p>
          </>
        ) : (
          <>
            <p className="text-xl font-semibold text-blue-800">🎉 Quiz Completed!</p>
            <div className="relative w-32 h-32">
              <svg className="transform rotate-[-90deg]" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="#e5e7eb"
                  strokeWidth="10"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="#3b82f6"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * percentage) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-blue-800">{percentage}%</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              You answered <strong>{totalCorrect}</strong> out of <strong>{questions.length}</strong> questions correctly.
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-76 bg-white p-4 rounded-b-xl justify-between items-between shadow-lg">
      <div className="flex flex-row justify-between align-center border-t-1 border-l-1 border-r-1 rounded-t px-6 py-4">
        <div className="flex flex-col h-full self-center">
          <p className="text-sm text-gray-700">
            <strong>{currentSlide + 1}/{questions.length}</strong> {question.text}
          </p>
        </div>
        <div className="flex flex-row items-center justify-center gap-4">
          {answered && isCorrect && (
            <div className="text-green-600 font-semibold animate-bounce">✔️ Correct!</div>
          )}
          {answered && !isCorrect && (
            <div className="text-red-600 font-semibold animate-bounce">❌ Incorrect!</div>
          )}
          <button
            onClick={handleAnswer}
            disabled={answered || selected === null}
            className="px-4 py-1.5 bg-[#1590ef] text-white rounded-xl hover:bg-[#1590ef] hover:opacity-80 disabled:opacity-50 cursor-pointer"
          >
            Answer
          </button>
        </div>
      </div>

      <div className="border-b-1 border-l-1 border-r-1 rounded-b">
        {question.options.map((opt, i) => (
          <label
            key={i}
            className={`flex items-center gap-1 p-1 px-2 border-t-1 cursor-pointer text-sm leading-tight px-6 py-4 ${
              answered
                ? i === question.correctIndex
                  ? "border-green-500 border bg-green-100"
                  : i === selected
                  ? "border-red-500 border bg-red-100"
                  : "opacity-50"
                : "hover:bg-gray-100"
            }`}
          >
            <input
              type="radio"
              name={`question-${currentSlide}`}
              value={i}
              disabled={answered}
              checked={selected === i}
              onChange={() => setSelected(i)}
              className="w-3 h-3"
            />
            <span className="truncate">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
