'use client';

import { useRef, useState } from 'react';

type CodeInputProps = {
  onComplete: (code: string) => void;
};

export default function CodeInput({ onComplete }: CodeInputProps) {
  const [values, setValues] = useState<string[]>(Array(6).fill(''));
  const inputsRef = useRef<HTMLInputElement[]>([]);

  const handleChange = (i: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newValues = [...values];
    newValues[i] = value;
    setValues(newValues);

    if (value && i < 5) {
      inputsRef.current[i + 1]?.focus();
    }

    const code = newValues.join('');
    if (code.length === 6) {
      onComplete(code);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('Text').slice(0, 6).split('');
    const newValues = Array(6).fill('');
    for (let i = 0; i < pasted.length; i++) {
      if (/^\d$/.test(pasted[i])) {
        newValues[i] = pasted[i];
      }
    }
    setValues(newValues);
    newValues.forEach((_, i) => {
      if (newValues[i]) inputsRef.current[i]?.focus();
    });

    const code = newValues.join('');
    if (code.length === 6) {
      onComplete(code);
    }
  };

  return (
    <div className="flex gap-2 justify-center" onPaste={handlePaste}>
      {values.map((val, i) => (
        <input
          key={i}
          ref={(el) => {
            if (el) inputsRef.current[i] = el;
          }}          
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={val}
          onChange={(e) => handleChange(i, e.target.value)}
          className="w-10 h-12 text-center border border-gray-300 rounded-md text-xl focus:outline-none focus:ring-2 focus:ring-[#47b9ff]"
        />
      ))}
    </div>
  );
}
