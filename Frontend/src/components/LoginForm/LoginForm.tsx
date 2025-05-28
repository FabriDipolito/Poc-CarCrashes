'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { requestLoginCode, verifyLoginCode } from '@/lib/api';
import { useLoadingTruck } from '@/hooks/useLoadingTruck';
import { useNotification } from '@/hooks/useNotification';
import CodeInput from './CodeInput';
import Image from "next/image";

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'verify'>('email');
  const { isLoading, showLoader, hideLoader } = useLoadingTruck();
  const router = useRouter();
  const { notify } = useNotification();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    showLoader();

    try {
      const success = await requestLoginCode(email);
      if (success) {
        notify({
          title: 'Code Sent! 🎉',
          message: 'We sent a login code to your email. Check your inbox!',
          type: 'success',
        });
        setStep('verify');
      } else {
        notify({
          title: 'Error 😢',
          message: 'Failed to send login code. Please try again.',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('❌ Error in requestLoginCode:', error);
      notify({
        title: 'Internal Error 😵',
        message: 'Something went wrong. Please try later.',
        type: 'error',
      });
    } finally {
      hideLoader();
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    showLoader();

    try {
      const success = await verifyLoginCode(email, code);
      if (success) {
        notify({
          title: 'Login Successful! 🎉',
          message: 'Welcome back! You have logged in successfully.',
          type: 'success',
        });
        router.push('/');
      } else {
        notify({
          title: 'Invalid Code 😢',
          message: 'The code you entered is incorrect or has expired.',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('❌ Error in verifyLoginCode:', error);
      notify({
        title: 'Internal Error 😵',
        message: 'Something went wrong. Please try later.',
        type: 'error',
      });
    } finally {
      hideLoader();
    }
  };

  const reset = () => {
    setEmail('');
    setCode('');
    setStep('email');
  };

  return (
    <div className="bg-white rounded-xl w-full max-w-md p-8">
      <div className="flex flex-col items-center justify-start">
        <h1 className="text-3xl font-semibold text-center text-gray-800 select-none">Welcome to</h1>
        <h1 className="text-4xl font-bold text-gray-800 mb-4 select-none">
          Car Crashes!
        </h1>
        <div className="flex items-center justify-center w-[150px] h-[120px] rounded-full bg-white round select-none">
          <Image
            src="/images/Login/carCrashesTransparentAuth.webp"
            alt="Car Icon"
            width={110}
            height={110}
          />
        </div>
      </div>
      <p className="text-center text-sm text-gray-500 mb-6 select-none">
        Enter your email to receive a login code.
      </p>
      {step === 'email' && (
        <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Your email"
            className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#47b9ff] transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-[#0d87d2] text-white p-3 rounded-md hover:bg-[#47b9ff] hover:cursor-pointer transition font-semibold disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Code'}
          </button>
        </form>
      )}

      {step === 'verify' && (
        <form onSubmit={handleCodeSubmit} className="flex flex-col gap-4">
          <CodeInput onComplete={(code) => setCode(code)} />
          <button
            type="submit"
            className="bg-[#0d87d2] text-white p-3 rounded-md hover:bg-[#47b9ff] hover:cursor-pointer transition font-semibold disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Verifying...' : 'Verify'}
          </button>
          <div className="flex flex-row items-center justify-center gap-12">
            <button
              type="button"
              onClick={reset}
              className="text-sm text-[#0d87d2] hover:text-[#47b9ff] hover:cursor-pointer mt-2 self-start select-none"
            >
              Change email
            </button>
            <button
              type="button"
              onClick={handleEmailSubmit}
              className="text-sm text-[#0d87d2] hover:text-[#47b9ff] hover:cursor-pointer mt-2 self-start select-none"
            >
              Resend code
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
