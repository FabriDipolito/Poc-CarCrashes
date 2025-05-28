'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLoadingTruck } from '@/hooks/useLoadingTruck';
import { useNotification } from '@/hooks/useNotification';
import { postFeedback } from '@/lib/api/feedback';

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState('');
  const { showLoader, hideLoader } = useLoadingTruck();
  const { notify } = useNotification();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    showLoader();

    try {
      await postFeedback(feedback);

      notify({
        title: 'Feedback sent! 🎉',
        message: 'Thanks for helping improve this project!',
        type: 'success',
      });

      router.push('/');
    } catch (error) {
      console.error('❌ Error sending feedback:', error);
      notify({
        title: 'Submission failed ❌',
        message: 'Something went wrong, please try again later.',
        type: 'error',
      });
    } finally {
      hideLoader();
    }
  };

  return (
    <div className="min-w-150 flex flex-col items-center justify-center px-4">
      <div className="w-full bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-2xl font-bold mb-4 text-center">Leave your Feedback</h1>
        <p className="text-sm text-gray-600 mb-6 text-center">
          I’d love to hear your thoughts and suggestions!
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            className="w-full border rounded-md p-3 text-sm min-h-[150px]"
            placeholder="Write your feedback here..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-[#1590ef] text-white py-2 rounded-md hover:bg-[#1590ef] hover:opacity-80 transition cursor-pointer"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
